"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  TrendingUp, DollarSign, ChevronRight,
  ArrowRight, Building2, Clock, CheckCircle2, Zap, RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DealStage = "prospect" | "qualified" | "proposal" | "negotiation" | "closed_won" | "closed_lost";

type Deal = {
  id: string;
  name: string;
  stage: DealStage;
  stageLabel: string;
  amount: number;
  probability: number;
  closeDate: string | null;
  updatedAt: string;
};

type Metrics = {
  totalPipeline: number;
  weightedForecast: number;
  avgDealSize: number;
  winRate: number;
  activeCount: number;
  wonCount: number;
};

const stages: { id: DealStage; label: string; color: string; bg: string; border: string }[] = [
  { id: "prospect", label: "Prospect", color: "text-apex-text-muted", bg: "bg-apex-surface/40", border: "border-apex-border" },
  { id: "qualified", label: "Qualified", color: "text-apex-blue-bright", bg: "bg-apex-blue-dim/30", border: "border-apex-blue/20" },
  { id: "proposal", label: "Proposal", color: "text-amber-400", bg: "bg-amber-900/20", border: "border-amber-700/20" },
  { id: "negotiation", label: "Contract Sent", color: "text-orange-400", bg: "bg-orange-900/20", border: "border-orange-700/20" },
  { id: "closed_won", label: "Closed Won", color: "text-apex-green-bright", bg: "bg-apex-green-dim/30", border: "border-apex-green/20" },
];

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${n}`;
}

function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const d = Math.floor(ms / 86400000);
  if (d === 0) return "today";
  if (d === 1) return "1d ago";
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Deal | null>(null);
  const [activeStages, setActiveStages] = useState<Set<DealStage>>(
    new Set(["prospect", "qualified", "proposal", "negotiation", "closed_won"])
  );

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/deals");
      const data = await res.json();
      setDeals(data.deals || []);
      setMetrics(data.metrics || null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const byStage = stages.reduce((acc, s) => {
    acc[s.id] = deals.filter(d => d.stage === s.id);
    return acc;
  }, {} as Record<DealStage, Deal[]>);

  const visibleStages = stages.filter(s => activeStages.has(s.id));

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-apex-text-primary">Pipeline</h2>
          <p className="text-sm text-apex-text-muted mt-0.5">
            Live HubSpot deal data · {deals.length} deals
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-apex-surface border border-apex-border text-sm text-apex-text-muted hover:text-apex-text-primary transition-colors"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Total Pipeline", value: fmt(metrics.totalPipeline), icon: TrendingUp, accent: "blue" },
            { label: "Weighted Forecast", value: fmt(metrics.weightedForecast), icon: Zap, accent: "purple" },
            { label: "Avg Deal Size", value: fmt(metrics.avgDealSize), icon: DollarSign, accent: "green" },
            { label: "Win Rate", value: `${metrics.winRate}%`, icon: CheckCircle2, accent: "green" },
          ].map(({ label, value, icon: Icon, accent }) => (
            <div key={label} className="glass rounded-2xl p-5">
              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center mb-3",
                accent === "blue" ? "bg-apex-blue-dim text-apex-blue-bright" :
                accent === "purple" ? "bg-apex-purple-dim text-apex-purple-bright" :
                "bg-apex-green-dim text-apex-green-bright"
              )}>
                <Icon size={15} />
              </div>
              <div className="text-xl font-bold text-apex-text-primary font-mono">{value}</div>
              <div className="text-xs text-apex-text-muted mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-apex-text-muted">
            <RefreshCw size={16} className="animate-spin" />
            <span className="text-sm">Loading HubSpot deals…</span>
          </div>
        </div>
      )}

      {/* Kanban */}
      {!loading && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {visibleStages.map((stage) => {
            const stageDeals = byStage[stage.id] || [];
            const stageTotal = stageDeals.reduce((s, d) => s + d.amount, 0);
            return (
              <div key={stage.id} className="shrink-0 w-72 space-y-3">
                {/* Column header */}
                <div className={cn("flex items-center justify-between px-3 py-2 rounded-xl border", stage.bg, stage.border)}>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-semibold", stage.color)}>{stage.label}</span>
                    <span className="text-[10px] bg-apex-surface px-1.5 py-0.5 rounded-full text-apex-text-muted font-mono">
                      {stageDeals.length}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-apex-text-muted">{fmt(stageTotal)}</span>
                </div>

                {/* Cards */}
                <div className="space-y-2">
                  {stageDeals.map((deal) => (
                    <motion.div
                      key={deal.id}
                      whileHover={{ y: -1, scale: 1.01 }}
                      onClick={() => setSelected(deal)}
                      className="glass rounded-xl p-4 cursor-pointer border border-apex-border hover:border-apex-border-bright transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-apex-blue-dim to-apex-purple-dim flex items-center justify-center shrink-0">
                            <Building2 size={12} className="text-apex-blue-bright" />
                          </div>
                          <span className="text-sm font-semibold text-apex-text-primary truncate">{deal.name}</span>
                        </div>
                        <ChevronRight size={13} className="text-apex-text-muted shrink-0 mt-0.5" />
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-base font-bold text-apex-text-primary font-mono">{fmt(deal.amount)}</span>
                        <span className="text-[10px] text-apex-text-muted flex items-center gap-1">
                          <Clock size={10} />
                          {timeAgo(deal.updatedAt)}
                        </span>
                      </div>

                      {/* Probability bar */}
                      <div className="mt-2.5">
                        <div className="h-1 bg-apex-surface rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${deal.probability}%` }}
                            transition={{ duration: 0.6 }}
                            className="h-full rounded-full bg-gradient-to-r from-apex-blue to-apex-purple"
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-[9px] text-apex-text-muted">Probability</span>
                          <span className="text-[9px] font-mono text-apex-text-muted">{deal.probability}%</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {stageDeals.length === 0 && (
                    <div className="text-center py-6 text-xs text-apex-text-muted opacity-50">No deals</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Deal drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-96 bg-apex-card border-l border-apex-border z-50 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-apex-text-primary">{selected.name}</h3>
                <button onClick={() => setSelected(null)} className="text-apex-text-muted hover:text-apex-text-primary">
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="glass rounded-xl p-4 space-y-3">
                  {[
                    { label: "Stage", value: selected.stageLabel },
                    { label: "Value", value: fmt(selected.amount) },
                    { label: "Probability", value: `${selected.probability}%` },
                    { label: "Close Date", value: selected.closeDate ? new Date(selected.closeDate).toLocaleDateString() : "—" },
                    { label: "Last Updated", value: timeAgo(selected.updatedAt) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-apex-text-muted">{label}</span>
                      <span className="text-apex-text-primary font-medium">{value}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={`https://app.hubspot.com/contacts/deals/${selected.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-apex-blue to-apex-purple text-white text-sm font-medium"
                >
                  Open in HubSpot <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
