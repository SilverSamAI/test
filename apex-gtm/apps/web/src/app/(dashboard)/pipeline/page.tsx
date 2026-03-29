"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  TrendingUp, DollarSign, Users, Calendar, ChevronRight,
  MoreHorizontal, Plus, ArrowRight, Building2, Phone,
  Mail, Clock, Star, AlertCircle, CheckCircle2, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DealStage = "prospect" | "qualified" | "demo" | "proposal" | "negotiation" | "closed_won" | "closed_lost";

type Deal = {
  id: string;
  company: string;
  contact: string;
  title: string;
  value: number;
  stage: DealStage;
  probability: number;
  closeDate: string;
  daysInStage: number;
  activity: string;
  score: number;
  tags: string[];
  aiInsight?: string;
};

const stages: { id: DealStage; label: string; color: string; bg: string; border: string }[] = [
  { id: "prospect", label: "Prospect", color: "text-apex-text-muted", bg: "bg-apex-surface/40", border: "border-apex-border" },
  { id: "qualified", label: "Qualified", color: "text-apex-blue-bright", bg: "bg-apex-blue-dim/30", border: "border-apex-blue/20" },
  { id: "demo", label: "Demo", color: "text-apex-purple-bright", bg: "bg-apex-purple-dim/30", border: "border-apex-purple/20" },
  { id: "proposal", label: "Proposal", color: "text-amber-400", bg: "bg-amber-900/20", border: "border-amber-700/20" },
  { id: "negotiation", label: "Negotiation", color: "text-orange-400", bg: "bg-orange-900/20", border: "border-orange-700/20" },
  { id: "closed_won", label: "Closed Won", color: "text-apex-green-bright", bg: "bg-apex-green-dim/30", border: "border-apex-green/20" },
];

const deals: Deal[] = [
  {
    id: "1", company: "Stripe", contact: "Sarah Chen", title: "VP Sales", value: 120000,
    stage: "proposal", probability: 70, closeDate: "Apr 15", daysInStage: 3,
    activity: "Proposal sent 2h ago", score: 94,
    tags: ["Fintech", "Series D"],
    aiInsight: "High intent signal: viewed pricing page 4x this week",
  },
  {
    id: "2", company: "Acme Corp", contact: "James Parker", title: "CRO", value: 84000,
    stage: "negotiation", probability: 85, closeDate: "Mar 31", daysInStage: 7,
    activity: "Follow-up call scheduled", score: 88,
    tags: ["SaaS", "Mid-Market"],
    aiInsight: "Deal at risk: no response in 5 days — follow up now",
  },
  {
    id: "3", company: "DataDog", contact: "Lisa Tran", title: "Head of Growth", value: 96000,
    stage: "demo", probability: 55, closeDate: "Apr 22", daysInStage: 2,
    activity: "Demo completed yesterday", score: 76,
    tags: ["DevOps", "Enterprise"],
  },
  {
    id: "4", company: "Plaid", contact: "Mike Torres", title: "CEO", value: 200000,
    stage: "qualified", probability: 40, closeDate: "May 10", daysInStage: 1,
    activity: "Enriched via Apollo today", score: 91,
    tags: ["Fintech", "Series E"],
    aiInsight: "New ICP match — 94% fit score",
  },
  {
    id: "5", company: "Notion", contact: "Emma Walsh", title: "VP Marketing", value: 48000,
    stage: "prospect", probability: 20, closeDate: "May 30", daysInStage: 5,
    activity: "Email sequence started", score: 62,
    tags: ["SaaS", "SMB"],
  },
  {
    id: "6", company: "Figma", contact: "David Kim", title: "Head of Sales", value: 72000,
    stage: "demo", probability: 60, closeDate: "Apr 18", daysInStage: 4,
    activity: "Deck shared via email", score: 79,
    tags: ["Design", "PLG"],
  },
  {
    id: "7", company: "Vercel", contact: "Ana Costa", title: "CRO", value: 150000,
    stage: "closed_won", probability: 100, closeDate: "Mar 28", daysInStage: 0,
    activity: "Contract signed!", score: 99,
    tags: ["Infra", "Enterprise"],
    aiInsight: "Won — champion: Ana Costa moved from Netlify",
  },
  {
    id: "8", company: "Linear", contact: "Tom Bradley", title: "VP Engineering", value: 36000,
    stage: "qualified", probability: 35, closeDate: "May 15", daysInStage: 3,
    activity: "LinkedIn reply received", score: 68,
    tags: ["B2B SaaS", "SMB"],
  },
];

const pipelineMetrics = [
  { label: "Total Pipeline", value: "$2.4M", change: "+18%", up: true },
  { label: "Weighted Forecast", value: "$1.1M", change: "+12%", up: true },
  { label: "Avg Deal Size", value: "$98k", change: "+5%", up: true },
  { label: "Win Rate", value: "34%", change: "+3pt", up: true },
];

function DealCard({ deal, onClick }: { deal: Deal; onClick: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="glass rounded-xl p-3.5 border border-apex-border hover:border-apex-border-bright cursor-pointer transition-all group"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-apex-surface border border-apex-border flex items-center justify-center">
            <Building2 size={12} className="text-apex-text-muted" />
          </div>
          <div>
            <p className="text-xs font-semibold text-apex-text-primary">{deal.company}</p>
            <p className="text-[10px] text-apex-text-muted">{deal.contact} · {deal.title}</p>
          </div>
        </div>
        <div className={cn(
          "text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md",
          deal.score >= 90 ? "bg-apex-green-dim text-apex-green-bright" :
          deal.score >= 70 ? "bg-apex-blue-dim text-apex-blue-bright" :
          "bg-apex-surface text-apex-text-muted"
        )}>
          {deal.score}
        </div>
      </div>

      <div className="text-sm font-bold text-apex-text-primary font-mono mb-2">
        ${(deal.value / 1000).toFixed(0)}k
      </div>

      {deal.aiInsight && (
        <div className="flex items-start gap-1.5 mb-2 p-2 rounded-lg bg-apex-purple-dim/20 border border-apex-purple/10">
          <Zap size={9} className="text-apex-purple-bright shrink-0 mt-0.5" />
          <p className="text-[10px] text-apex-purple-bright leading-relaxed">{deal.aiInsight}</p>
        </div>
      )}

      <div className="flex items-center justify-between text-[10px] text-apex-text-muted">
        <span className="flex items-center gap-1"><Calendar size={9} />{deal.closeDate}</span>
        <span className="flex items-center gap-1"><Clock size={9} />{deal.daysInStage}d here</span>
        <span className="font-mono">{deal.probability}%</span>
      </div>

      <div className="mt-2 pt-2 border-t border-apex-border/50 flex items-center gap-1">
        <div className="h-1 flex-1 bg-apex-surface rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-apex-blue to-apex-purple transition-all"
            style={{ width: `${deal.probability}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function PipelinePage() {
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [view, setView] = useState<"kanban" | "list">("kanban");

  const dealsByStage = (stage: DealStage) => deals.filter((d) => d.stage === stage);
  const stageValue = (stage: DealStage) => dealsByStage(stage).reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-apex-text-primary">Pipeline</h2>
          <p className="text-sm text-apex-text-muted mt-0.5">8 active deals · AI-scored and enriched</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-xl border border-apex-border overflow-hidden">
            {(["kanban", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors capitalize",
                  view === v ? "bg-apex-surface text-apex-text-primary" : "text-apex-text-muted hover:text-apex-text-secondary"
                )}
              >
                {v}
              </button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-apex-blue to-apex-purple text-white text-sm font-medium flex items-center gap-2"
          >
            <Plus size={14} />
            Add Deal
          </motion.button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-3">
        {pipelineMetrics.map((m) => (
          <div key={m.label} className="glass rounded-xl p-4 border border-apex-border">
            <div className="text-xl font-bold text-apex-text-primary font-mono">{m.value}</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-apex-text-muted">{m.label}</span>
              <span className={cn("text-[10px] font-medium", m.up ? "text-apex-green-bright" : "text-red-400")}>{m.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Kanban */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageDeals = dealsByStage(stage.id);
          const total = stageValue(stage.id);

          return (
            <div key={stage.id} className="flex-shrink-0 w-64">
              <div className={cn("rounded-xl border p-3 mb-3", stage.bg, stage.border)}>
                <div className="flex items-center justify-between mb-1">
                  <span className={cn("text-xs font-semibold", stage.color)}>{stage.label}</span>
                  <span className="text-[10px] bg-apex-surface rounded-full px-1.5 py-0.5 text-apex-text-muted font-mono">
                    {stageDeals.length}
                  </span>
                </div>
                <div className="text-xs text-apex-text-secondary font-mono">
                  ${(total / 1000).toFixed(0)}k
                </div>
              </div>

              <div className="space-y-2.5">
                {stageDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    onClick={() => setSelectedDeal(deal)}
                  />
                ))}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  className="w-full py-2 rounded-xl border border-dashed border-apex-border text-[11px] text-apex-text-muted hover:text-apex-text-secondary hover:border-apex-border-bright transition-colors flex items-center justify-center gap-1"
                >
                  <Plus size={10} /> Add deal
                </motion.button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deal detail drawer */}
      <AnimatePresence>
        {selectedDeal && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-96 bg-apex-dark border-l border-apex-border p-6 overflow-y-auto z-50"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-apex-text-primary">{selectedDeal.company}</h3>
              <button
                onClick={() => setSelectedDeal(null)}
                className="p-1.5 rounded-lg hover:bg-apex-surface text-apex-text-muted"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
              <div className="glass rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-apex-text-muted">Deal Value</span>
                  <span className="font-bold text-apex-text-primary font-mono">${selectedDeal.value.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-apex-text-muted">Close Date</span>
                  <span className="text-apex-text-secondary">{selectedDeal.closeDate}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-apex-text-muted">Probability</span>
                  <span className="text-apex-blue-bright font-mono">{selectedDeal.probability}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-apex-text-muted">AI Score</span>
                  <span className={cn("font-mono font-bold",
                    selectedDeal.score >= 90 ? "text-apex-green-bright" :
                    selectedDeal.score >= 70 ? "text-apex-blue-bright" : "text-apex-text-muted"
                  )}>{selectedDeal.score}/100</span>
                </div>
              </div>

              {selectedDeal.aiInsight && (
                <div className="glass rounded-xl p-4 border border-apex-purple/20 bg-apex-purple-dim/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={12} className="text-apex-purple-bright" />
                    <span className="text-xs font-semibold text-apex-purple-bright">AI Insight</span>
                  </div>
                  <p className="text-xs text-apex-text-secondary">{selectedDeal.aiInsight}</p>
                </div>
              )}

              <div>
                <h4 className="text-xs font-semibold text-apex-text-muted uppercase tracking-wider mb-3">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Mail, label: "Send Email" },
                    { icon: Phone, label: "Log Call" },
                    { icon: Calendar, label: "Schedule" },
                    { icon: ArrowRight, label: "Advance Stage" },
                  ].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-apex-surface border border-apex-border hover:border-apex-border-bright text-xs text-apex-text-secondary hover:text-apex-text-primary transition-all"
                    >
                      <Icon size={12} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-apex-text-muted uppercase tracking-wider mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDeal.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-apex-surface border border-apex-border text-[10px] text-apex-text-secondary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedDeal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSelectedDeal(null)}
        />
      )}
    </div>
  );
}
