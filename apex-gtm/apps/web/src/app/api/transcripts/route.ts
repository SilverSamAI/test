import { NextResponse } from "next/server";

const FIREFLIES_KEY = process.env.FIREFLIES_API_KEY;

const QUERY = `
  query GetTranscripts($limit: Int) {
    transcripts(limit: $limit) {
      id
      title
      date
      duration
      participants
      summary {
        overview
        action_items
        keywords
        shorthand_bullet
      }
    }
  }
`;

export async function GET(req: Request) {
  if (!FIREFLIES_KEY) {
    return NextResponse.json({ error: "FIREFLIES_API_KEY not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "10");

  try {
    const res = await fetch("https://api.fireflies.ai/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FIREFLIES_KEY}`,
      },
      body: JSON.stringify({ query: QUERY, variables: { limit } }),
      next: { revalidate: 300 },
    });

    const data = await res.json();

    if (data.errors) {
      return NextResponse.json({ error: data.errors[0].message }, { status: 500 });
    }

    const transcripts = (data.data?.transcripts || []).map((t: any) => ({
      id: t.id,
      title: t.title || "Untitled Meeting",
      date: t.date,
      duration: Math.round(t.duration || 0),
      participants: Array.isArray(t.participants) ? t.participants : [],
      overview: t.summary?.overview || null,
      actionItems: t.summary?.action_items || null,
      keywords: t.summary?.keywords || [],
      bullets: t.summary?.shorthand_bullet || null,
    }));

    return NextResponse.json({ transcripts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
