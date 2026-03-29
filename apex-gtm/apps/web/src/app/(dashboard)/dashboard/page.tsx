"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  TrendingUp, DollarSign, CheckCircle2,
  Zap, Bot, RefreshCw, Phone,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { AgentFeed } from "@/components/agents/AgentFeed";
import { MetricCard, type MetricCardProps } from "@/components/ui/MetricCard";
import { cn } from "@/lib/utils";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${n}`;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-apex-card border border-apex-border rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-apex-text-muted mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {fmt(p.value)}</p>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [byStage, setByStage] = useState<Record<string, any[]>>({});
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [dealsRes, transcriptsRes] = await Promise.all([
        fetch("/api/deals"),
        fetch("/api/transcripts?limit=5"),
      ]);
      const dealsData = await dealsRes.json();
      const transcriptsData = await transcriptsRes.json();
      setMetrics(dealsData.metrics || null);
      setByStage(dealsData.byStage || {});
      setTranscripts(transcriptsData.transcripts || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  // Build funnel data from real stage counts
  const stageOrder = ["prospect", "qualified", "proposal", "negotiation", "closed_won"];
  const stageLabels: Record<string, string> = {
    prospect: "Prospect", qualified: "Qualified", proposal: "Proposal",
    negotiation: "Contract Sent", closed_won: "Won",
  };
  const conversionData = stageOrder.map(s => ({
    stage: stageLabels[s],
    count: (byStage[s] || []).length,
  }));

  const metricCards: MetricCardProps[] = metrics ? [
    { label: "Total Pipeline", value: fmt(metrics.totalPipeline), change: `${metrics.activeCount} active`, up: true, icon: TrendingUp, accent: "blue", sub: "live HubSpot data" },
    { label: "Weighted Forecast", value: fmt(metrics.weightedForecast), change: "probability-weighted", up: true, icon: Zap, accent: "purple", sub: "vs target" },
    { label: "Closed Won", value: fmt(metrics.totalWon), change: `${metrics.wonCount} deals`, up: true, icon: CheckCircle2, accent: "green", sub: "all time" },
    { label: "Win Rate", value: `${metrics.winRate}%`, change: `${metrics.wonCount} won`, up: metrics.winRate > 30, icon: DollarSign, accent: "green", sub: "closed deals" },
  ] : [];

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-apex-text-primary">War Room</h2>
          <p className="text-sm text-apex-text-muted mt-0.5">Live HubSpot pipeline · Fireflies call intelligence</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-apex-surface border border-apex-border text-sm text-apex-text-muted hover:text-apex-text-primary transition-colors">
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-apex-text-muted">
            <RefreshCw size={16} className="animate-spin" />
            <span className="text-sm">Loading live data…</span>
          </div>
        </div>
      ) : (
        <>
          {/* Metric cards */}
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {metricCards.map((m) => (
              <motion.div key={m.label} variants={item}>
                <MetricCard {...m} />
              </motion.div>
            ))}
          </motion.div>

          {/* Charts row */}
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Pipeline funnel */}
            <motion.div variants={item} className="xl:col-span-2 glass rounded-2xl p-5">
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-apex-text-primary">Deal Funnel</h3>
                <p className="text-xs text-apex-text-muted mt-0.5">Active deals by stage</p>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={conversionData}>
                  <defs>
                    <linearGradient id="funnelGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2D40" />
                  <XAxis dataKey="stage" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="count" name="Deals" stroke="#3B82F6" strokeWidth={2} fill="url(#funnelGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Stage breakdown */}
            <motion.div variants={item} className="glass rounded-2xl p-5">
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-apex-text-primary">By Stage</h3>
                <p className="text-xs text-apex-text-muted mt-0.5">Deal count & value</p>
              </div>
              <div className="space-y-3">
                {conversionData.filter(s => s.count > 0).map((s, i) => {
                  const max = Math.max(...conversionData.map(x => x.count), 1);
                  const pct = Math.round((s.count / max) * 100);
                  return (
                    <div key={s.stage}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-apex-text-secondary">{s.stage}</span>
                        <span className="text-apex-text-muted font-mono">{s.count}</span>
                      </div>
                      <div className="h-1.5 bg-apex-surface rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className="h-full rounded-full bg-gradient-to-r from-apex-blue to-apex-purple"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Transcripts + Agent Feed */}
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Recent calls from Fireflies */}
            <motion.div variants={item} className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Phone size={14} className="text-apex-purple-bright" />
                <h3 className="text-sm font-semibold text-apex-text-primary">Recent Calls</h3>
                <span className="text-[10px] text-apex-purple-bright bg-apex-purple-dim px-2 py-0.5 rounded-full ml-auto">Fireflies</span>
              </div>
              <div className="space-y-3">
                {transcripts.length === 0 && (
                  <p className="text-xs text-apex-text-muted text-center py-4">No recent transcripts</p>
                )}
                {transcripts.map((t) => (
                  <div key={t.id} className="p-3 rounded-xl bg-apex-surface/60 border border-apex-border">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-apex-text-primary leading-snug">{t.title}</p>
                      <span className="text-[10px] text-apex-text-muted font-mono shrink-0">
                        {Math.round(t.duration)}m
                      </span>
                    </div>
                    {t.overview && (
                      <p className="text-[11px] text-apex-text-muted mt-1.5 line-clamp-2 leading-relaxed">
                        {t.overview.replace(/\*\*/g, '').substring(0, 120)}…
                      </p>
                    )}
                    {t.actionItems && (
                      <div className="mt-2 pt-2 border-t border-apex-border">
                        <p className="text-[10px] text-apex-blue-bright font-medium mb-1">Action items</p>
                        <p className="text-[10px] text-apex-text-muted line-clamp-2">
                          {t.actionItems.replace(/\*\*/g, '').substring(0, 100)}…
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Agent feed */}
            <motion.div variants={item}>
              <AgentFeed />
            </motion.div>
          </motion.div>
        </>
      )}
    </div>
  );
}
