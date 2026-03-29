"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Target, Sparkles, ChevronRight, Play, Download,
  Users, TrendingUp, Globe, Zap, CheckCircle2,
  BarChart2, MessageSquare, Map, Lightbulb, RefreshCw,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const icpAttributes = [
  { label: "Company Size", value: "50–200 employees", confidence: 92 },
  { label: "Stage", value: "Series B / Series C", confidence: 88 },
  { label: "Revenue", value: "$5M–$50M ARR", confidence: 85 },
  { label: "Industry", value: "B2B SaaS, Fintech, DevTools", confidence: 96 },
  { label: "Geography", value: "North America, EMEA", confidence: 90 },
  { label: "Buying Signal", value: "Hiring AEs, recent funding", confidence: 83 },
  { label: "Tech Stack", value: "HubSpot, Salesforce, Outreach", confidence: 79 },
  { label: "Pain Points", value: "Manual prospecting, slow pipeline", confidence: 94 },
];

const channels = [
  { name: "LinkedIn Outreach", roi: 4.2, priority: "high", effort: "medium", recommended: true },
  { name: "Cold Email Sequences", roi: 3.8, priority: "high", effort: "low", recommended: true },
  { name: "Content Marketing", roi: 2.9, priority: "medium", effort: "high", recommended: false },
  { name: "Paid LinkedIn Ads", roi: 2.1, priority: "medium", effort: "medium", recommended: false },
  { name: "Webinars / Events", roi: 3.5, priority: "high", effort: "high", recommended: true },
  { name: "Partner / Referrals", roi: 5.1, priority: "high", effort: "low", recommended: true },
];

const positioning = [
  {
    segment: "Fintech Scaleups",
    headline: "The AI Sales Team That Never Sleeps",
    subline: "Replace 3 SDRs with one autonomous AI agent that prospects, enriches, and personalizes at scale.",
    tone: "Bold / Performance",
  },
  {
    segment: "B2B SaaS (Series B)",
    headline: "From ICP to Signed Contract — On Autopilot",
    subline: "APEX GTM connects your entire revenue stack and lets AI drive pipeline while your team focuses on closing.",
    tone: "Outcome-focused",
  },
  {
    segment: "DevTools & Infra",
    headline: "Sales Intelligence Built for Technical GTM Teams",
    subline: "Deep Apollo + LinkedIn enrichment, Fireflies call AI, and HubSpot automation — orchestrated by LangGraph agents.",
    tone: "Technical / Credibility",
  },
];

const competitors = [
  { name: "Outreach.io", strength: "Sequences", weakness: "No AI agents", threat: "high" },
  { name: "Salesloft", strength: "Enterprise", weakness: "No GTM strategy", threat: "medium" },
  { name: "Apollo.io", strength: "Prospecting data", weakness: "Weak automation", threat: "medium" },
  { name: "Gong.io", strength: "Call intelligence", weakness: "No SDR automation", threat: "low" },
  { name: "Clay", strength: "Enrichment", weakness: "No AI orchestration", threat: "high" },
];

const strategySteps = [
  { phase: "1. ICP Definition", status: "complete", output: "8 firmographic + behavioral signals defined" },
  { phase: "2. Channel Strategy", status: "complete", output: "4 high-ROI channels prioritized" },
  { phase: "3. Messaging Architecture", status: "complete", output: "3 segment-specific positioning frameworks" },
  { phase: "4. Competitive Moat", status: "running", output: "Analyzing 5 competitors..." },
  { phase: "5. Outreach Playbook", status: "pending", output: "Awaiting competitive analysis" },
  { phase: "6. Forecast Model", status: "pending", output: "Requires channel data" },
];

export default function GTMPage() {
  const [activeTab, setActiveTab] = useState<"icp" | "channels" | "positioning" | "competitive">("icp");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 3000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-apex-text-primary">GTM Strategy Engine</h2>
          <p className="text-sm text-apex-text-muted mt-0.5">AI-generated go-to-market strategy, updated in real-time</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl bg-apex-surface border border-apex-border text-sm text-apex-text-secondary hover:border-apex-border-bright transition-colors flex items-center gap-2">
            <Download size={14} />
            Export Strategy
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-apex-purple to-apex-blue text-white text-sm font-medium flex items-center gap-2"
          >
            {generating ? (
              <><div className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
            ) : (
              <><Sparkles size={14} /> Refresh Strategy</>
            )}
          </motion.button>
        </div>
      </div>

      {/* Strategy progress */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-apex-text-primary flex items-center gap-2">
            <Map size={14} className="text-apex-purple-bright" />
            Strategy Pipeline
          </h3>
          <span className="text-xs text-apex-green-bright bg-apex-green-dim px-2 py-0.5 rounded-full">4/6 complete</span>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {strategySteps.map((step, i) => (
            <div key={i} className="space-y-2">
              <div className={cn(
                "h-1.5 rounded-full",
                step.status === "complete" ? "bg-apex-green" :
                step.status === "running" ? "bg-apex-purple animate-pulse" :
                "bg-apex-surface"
              )} />
              <p className="text-[10px] text-apex-text-muted font-medium">{step.phase}</p>
              <p className="text-[10px] text-apex-text-secondary leading-relaxed">{step.output}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 p-1 bg-apex-surface rounded-xl border border-apex-border w-fit">
        {([
          { id: "icp", label: "ICP Profile", icon: Users },
          { id: "channels", label: "Channels", icon: TrendingUp },
          { id: "positioning", label: "Positioning", icon: MessageSquare },
          { id: "competitive", label: "Competitive", icon: BarChart2 },
        ] as const).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all",
              activeTab === id
                ? "bg-apex-card text-apex-text-primary border border-apex-border-bright"
                : "text-apex-text-muted hover:text-apex-text-secondary"
            )}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === "icp" && (
          <motion.div
            key="icp"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="grid grid-cols-1 xl:grid-cols-2 gap-4"
          >
            <div className="glass rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-apex-text-primary flex items-center gap-2">
                <Target size={14} className="text-apex-blue-bright" />
                Ideal Customer Profile
              </h3>
              <div className="space-y-3">
                {icpAttributes.map((attr) => (
                  <div key={attr.label} className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-apex-text-muted">{attr.label}</span>
                        <span className="text-[10px] text-apex-blue-bright font-mono">{attr.confidence}%</span>
                      </div>
                      <p className="text-xs text-apex-text-secondary">{attr.value}</p>
                      <div className="h-1 bg-apex-surface rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-apex-blue to-apex-purple rounded-full"
                          style={{ width: `${attr.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-apex-text-primary flex items-center gap-2 mb-4">
                  <Lightbulb size={14} className="text-amber-400" />
                  Buying Committee
                </h3>
                <div className="space-y-2.5">
                  {[
                    { role: "Economic Buyer", title: "CRO / VP Revenue", influence: 95 },
                    { role: "Champion", title: "VP Sales / Head of SDR", influence: 88 },
                    { role: "Technical Evaluator", title: "RevOps Manager", influence: 72 },
                    { role: "End User", title: "SDR / AE", influence: 55 },
                  ].map((person) => (
                    <div key={person.role} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-apex-purple shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-0.5">
                          <span className="text-apex-text-secondary">{person.role}</span>
                          <span className="text-apex-text-muted">{person.title}</span>
                        </div>
                        <div className="h-0.5 bg-apex-surface rounded-full overflow-hidden">
                          <div
                            className="h-full bg-apex-purple rounded-full"
                            style={{ width: `${person.influence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-apex-text-primary flex items-center gap-2 mb-3">
                  <Globe size={14} className="text-apex-green-bright" />
                  Total Addressable Market
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "TAM", value: "$8.2B", sub: "Global" },
                    { label: "SAM", value: "$1.4B", sub: "ICP-fit" },
                    { label: "SOM", value: "$120M", sub: "Year 1 target" },
                  ].map((m) => (
                    <div key={m.label} className="text-center">
                      <div className="text-lg font-bold text-apex-text-primary font-mono">{m.value}</div>
                      <div className="text-[10px] text-apex-blue-bright font-semibold">{m.label}</div>
                      <div className="text-[10px] text-apex-text-muted">{m.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "channels" && (
          <motion.div
            key="channels"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="glass rounded-2xl p-5"
          >
            <h3 className="text-sm font-semibold text-apex-text-primary mb-4">Channel Prioritization Matrix</h3>
            <div className="space-y-3">
              {channels.sort((a, b) => b.roi - a.roi).map((channel) => (
                <div
                  key={channel.name}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border transition-all",
                    channel.recommended
                      ? "bg-apex-blue-dim/10 border-apex-blue/20"
                      : "bg-apex-surface/40 border-apex-border"
                  )}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-apex-text-primary">{channel.name}</span>
                      {channel.recommended && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-apex-green-dim text-apex-green-bright font-medium">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-apex-text-muted">
                      <span>Priority: <span className={cn(
                        channel.priority === "high" ? "text-apex-green-bright" :
                        channel.priority === "medium" ? "text-amber-400" : "text-apex-text-muted"
                      )}>{channel.priority}</span></span>
                      <span>Effort: <span className={cn(
                        channel.effort === "low" ? "text-apex-green-bright" :
                        channel.effort === "medium" ? "text-amber-400" : "text-red-400"
                      )}>{channel.effort}</span></span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold font-mono text-apex-text-primary">{channel.roi}x</div>
                    <div className="text-[10px] text-apex-text-muted">ROI estimate</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "positioning" && (
          <motion.div
            key="positioning"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="space-y-4"
          >
            {positioning.map((pos, i) => (
              <div key={i} className="glass rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-semibold text-apex-purple-bright bg-apex-purple-dim px-2.5 py-1 rounded-full">
                    {pos.segment}
                  </span>
                  <span className="text-[10px] text-apex-text-muted">{pos.tone}</span>
                </div>
                <h3 className="text-xl font-bold text-apex-text-primary mb-2">{pos.headline}</h3>
                <p className="text-sm text-apex-text-secondary leading-relaxed">{pos.subline}</p>
                <div className="mt-4 flex gap-2">
                  <button className="px-3 py-1.5 rounded-xl bg-apex-surface border border-apex-border text-xs text-apex-text-secondary hover:border-apex-border-bright transition-colors">
                    Use in Sequences
                  </button>
                  <button className="px-3 py-1.5 rounded-xl bg-apex-surface border border-apex-border text-xs text-apex-text-secondary hover:border-apex-border-bright transition-colors">
                    Generate Variations
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === "competitive" && (
          <motion.div
            key="competitive"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="glass rounded-2xl p-5"
          >
            <h3 className="text-sm font-semibold text-apex-text-primary mb-4">Competitive Intelligence</h3>
            <div className="space-y-3">
              {competitors.map((comp) => (
                <div key={comp.name} className="flex items-center gap-4 p-4 rounded-xl bg-apex-surface/40 border border-apex-border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-semibold text-apex-text-primary">{comp.name}</span>
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                        comp.threat === "high" ? "bg-red-950/40 text-red-400" :
                        comp.threat === "medium" ? "bg-amber-900/30 text-amber-400" :
                        "bg-apex-green-dim text-apex-green-bright"
                      )}>
                        {comp.threat} threat
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-apex-text-muted">Strength: </span>
                        <span className="text-apex-text-secondary">{comp.strength}</span>
                      </div>
                      <div>
                        <span className="text-apex-text-muted">Weakness: </span>
                        <span className="text-apex-green-bright">{comp.weakness}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-1.5 rounded-lg bg-apex-surface border border-apex-border hover:border-apex-border-bright text-apex-text-muted hover:text-apex-text-primary transition-colors">
                    <ArrowRight size={12} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
