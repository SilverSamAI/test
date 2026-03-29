import { NextResponse } from "next/server";

const HUBSPOT_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;

const STAGE_MAP: Record<string, string> = {
  appointmentscheduled: "prospect",
  qualifiedtobuy: "qualified",
  presentationscheduled: "proposal",
  contractsent: "negotiation",
  closedwon: "closed_won",
  closedlost: "closed_lost",
};

const STAGE_LABELS: Record<string, string> = {
  prospect: "Prospect",
  qualified: "Qualified",
  proposal: "Proposal",
  negotiation: "Contract Sent",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
};

export async function GET() {
  if (!HUBSPOT_TOKEN) {
    return NextResponse.json({ error: "HUBSPOT_ACCESS_TOKEN not configured" }, { status: 500 });
  }

  try {
    let all: any[] = [];
    let after: string | undefined;

    // Paginate through all deals
    do {
      const url = new URL("https://api.hubapi.com/crm/v3/objects/deals");
      url.searchParams.set("limit", "100");
      url.searchParams.set("properties", "dealname,amount,dealstage,closedate,hs_deal_stage_probability,createdate,hs_lastmodifieddate");
      if (after) url.searchParams.set("after", after);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}` },
        next: { revalidate: 300 },
      });
      const data = await res.json();
      all = all.concat(data.results || []);
      after = data.paging?.next?.after;
    } while (after && all.length < 500);

    // Map to deals
    const deals = all
      .filter(r => r.properties?.dealstage && r.properties?.dealname)
      .map(r => {
        const p = r.properties;
        const stage = STAGE_MAP[p.dealstage] || "prospect";
        const amount = parseFloat(p.amount || "0") || 0;
        const prob = parseFloat(p.hs_deal_stage_probability || "0");

        return {
          id: r.id,
          name: p.dealname,
          stage,
          stageLabel: STAGE_LABELS[stage] || stage,
          amount,
          probability: prob || stageProbability(stage),
          closeDate: p.closedate,
          createdAt: p.createdate,
          updatedAt: p.hs_lastmodifieddate,
        };
      });

    // Group by stage
    const byStage = deals.reduce((acc, d) => {
      if (!acc[d.stage]) acc[d.stage] = [];
      acc[d.stage].push(d);
      return acc;
    }, {} as Record<string, typeof deals>);

    // Metrics
    const active = deals.filter(d => d.stage !== "closed_won" && d.stage !== "closed_lost");
    const won = deals.filter(d => d.stage === "closed_won");
    const lost = deals.filter(d => d.stage === "closed_lost");
    const totalPipeline = active.reduce((s, d) => s + d.amount, 0);
    const weightedForecast = active.reduce((s, d) => s + d.amount * (d.probability / 100), 0);
    const totalWon = won.reduce((s, d) => s + d.amount, 0);
    const winRate = won.length + lost.length > 0
      ? Math.round((won.length / (won.length + lost.length)) * 100)
      : 0;
    const avgDealSize = active.length > 0 ? Math.round(totalPipeline / active.length) : 0;

    return NextResponse.json({
      deals,
      byStage,
      metrics: {
        totalPipeline,
        weightedForecast,
        totalWon,
        winRate,
        avgDealSize,
        activeCount: active.length,
        wonCount: won.length,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function stageProbability(stage: string) {
  const map: Record<string, number> = {
    prospect: 10,
    qualified: 25,
    proposal: 50,
    negotiation: 75,
    closed_won: 100,
    closed_lost: 0,
  };
  return map[stage] || 10;
}
