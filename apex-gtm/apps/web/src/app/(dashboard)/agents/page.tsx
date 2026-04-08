"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Bot, Play, Square, Settings2, ChevronRight,
  Search, Mail, Phone, Target, Megaphone,
  Zap, Activity, Clock, CheckCircle2, AlertCircle,
  RotateCcw, Eye, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const agents = [
  {
    id: "sdr",
    name: "SDR Agent",
    description: "Autonomous prospecting, lead enrichment, and personalized multi-channel outreach",
    icon: Search,
    accent: "blue" as const,
    status: "active",
    currentTask: "Enriching 47 Fintech VP Sales leads from Apollo batch",
    stats: { tasksToday: 234, successRate: 94, avgDuration: "2.3m", totalRuns: 12408 },
    capabilities: ["Apollo Prospecting", "Lead Enrichment", "Email Sequences", "LinkedIn Outreach", "Follow-up Cadences"],
    integrations: ["Apollo", "HubSpot", "LinkedIn"],
    lastRun: "2 min ago",
    nextRun: "Continuous",
    color: { bg: "from-apex-blue/10 to-transparent", border: "border-apex-blue/20", text: "text-apex-blue-bright", dot: "bg-apex-blue", badge: "bg-apex-blue-dim text-apex-blue-bright" },
  },
  {
    id: "deal",
    name: "Deal Intelligence",
    description: "Analyzes sales calls, extracts insights, updates CRM, and surfaces next-best-actions",
    icon: Phone,
    accent: "green" as const,
    status: "active",
    currentTask: "Processing Fireflies call #284 — Acme Corp discovery call",
    stats: { tasksToday: 18, successRate: 98, avgDuration: "4.1m", totalRuns: 2891 },
    capabilities: ["Call Transcription Analysis", "Objection Detection", "Next Step Extraction", "HubSpot Updates", "Win/Loss Analysis"],
    integrations: ["Fireflies", "HubSpot"],
    lastRun: "5 min ago",
    nextRun: "On meeting end",
    color: { bg: "from-apex-green/10 to-transparent", border: "border-apex-green/20", text: "text-apex-green-bright", dot: "bg-apex-green", badge: "bg-apex-green-dim text-apex-green-bright" },
  },
  {
    id: "gtm",
    name: "GTM Strategy Engine",
    description: "Generates go-to-market strategies, refines ICP, creates positioning, and competitive analysis",
    icon: Target,
    accent: "purple" as const,
    status: "idle",
    currentTask: "Scheduled: ICP refresh at 3:00 PM",
    stats: { tasksToday: 4, successRate: 100, avgDuration: "8.7m", totalRuns: 204 },
    capabilities: ["ICP Definition", "Positioning Frameworks", "Channel Strategy", "Competitive Analysis", "Messaging Architecture"],
    integrations: ["Apollo", "LinkedIn"],
    lastRun: "2 hours ago",
    nextRun: "3:00 PM today",
    color: { bg: "from-apex-purple/10 to-transparent", border: "border-apex-purple/20", text: "text-apex-purple-bright", dot: "bg-apex-purple", badge: "bg-apex-purple-dim text-apex-purple-bright" },
  },
  {
    id: "marketing",
    name: "Marketing AI",
    description: "Creates content, plans campaigns, writes LinkedIn posts, and generates nurture sequences",
    icon: Megaphone,
    accent: "blue" as const,
    status: "active",
    currentTask: "Drafting LinkedIn thought leadership series (5 posts)",
    stats: { tasksToday: 47, successRate: 91, avgDuration: "3.2m", totalRuns: 5670 },
    capabilities: ["LinkedIn Content", "Email Campaigns", "SEO Content Briefs", "Ad Copy", "Case Study Drafts"],
    integrations: ["HubSpot", "LinkedIn"],
    lastRun: "18 min ago",
    nextRun: "Continuous",
    color: { bg: "from-apex-blue/10 to-transparent", border: "border-apex-blue/20", text: "text-apex-blue-bright", dot: "bg-apex-blue", badge: "bg-apex-blue-dim text-apex-blue-bright" },
  },
];

const LogLine = ({ text, type }: { text: string; type: "info" | "success" | "thinking" }) => (
  <div className={cn("flex gap-2 text-xs font-mono", {
    "text-apex-text-secondary": type === "info",
    "text-apex-green-bright": type === "success",
    "text-apex-purple-bright": type === "thinking",
  })}>
    <span className="text-apex-text-muted shrink-0">{new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
    <span>{text}</span>
  </div>
);

export default function AgentsPage() {
  const [selected, setSelected] = useState<string | null>("sdr");
  const [runningAgent, setRunningAgent] = useState<string | null>(null);

  const selectedAgent = agents.find((a) => a.id === selected);

  const handleRun = (id: string) => {
    setRunningAgent(id);
    setTimeout(() => setRunningAgent(null), 4000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-apex-text-primary">AI Agents</h2>
          <p className="text-sm text-apex-text-muted mt-0.5">4 agents — 3 active, 1 scheduled</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-apex-blue to-apex-purple text-white text-sm font-medium flex items-center gap-2"
          onClick={() => agents.forEach((a) => handleRun(a.id))}
        >
          <Zap size={14} />
          Run All Agents
        </motion.button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Agent list */}
        <div className="xl:col-span-2 space-y-3">
          {agents.map((agent) => {
            const Icon = agent.icon;
            const isSelected = selected === agent.id;
            const isRunning = runningAgent === agent.id;

            return (
              <motion.div
                key={agent.id}
                whileHover={{ x: 2 }}
                onClick={() => setSelected(agent.id)}
                className={cn(
                  "glass rounded-2xl p-4 cursor-pointer transition-all border",
                  isSelected
                    ? `${agent.color.border} bg-gradient-to-r ${agent.color.bg}`
                    : "border-apex-border hover:border-apex-border-bright"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("p-2.5 rounded-xl shrink-0", agent.color.badge)}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-apex-text-primary">{agent.name}</span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1",
                        agent.status === "active" ? "bg-apex-green-dim text-apex-green-bright" : "bg-apex-surface text-apex-text-muted"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", agent.status === "active" ? "bg-apex-green animate-pulse" : "bg-apex-text-muted")} />
                        {agent.status}
                      </span>
                    </div>
                    <p className="text-xs text-apex-text-muted truncate">{agent.currentTask}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-apex-text-muted">
                      <span className="flex items-center gap-1"><Activity size={9} />{agent.stats.tasksToday} today</span>
                      <span className="flex items-center gap-1"><CheckCircle2 size={9} />{agent.stats.successRate}%</span>
                      <span className="flex items-center gap-1"><Clock size={9} />avg {agent.stats.avgDuration}</span>
                    </div>
                  </div>
                  <ChevronRight size={14} className={cn("shrink-0 mt-1 transition-colors", isSelected ? agent.color.text : "text-apex-text-muted")} />
                </div>
                {isRunning && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 pt-3 border-t border-apex-border"
                  >
                    <div className="flex items-center gap-2 text-xs text-apex-purple-bright">
                      <div className="w-3 h-3 border border-apex-purple-bright border-t-transparent rounded-full animate-spin" />
                      Agent running...
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Agent detail panel */}
        <AnimatePresence mode="wait">
          {selectedAgent && (
            <motion.div
              key={selectedAgent.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25 }}
              className="xl:col-span-3 glass rounded-2xl p-6 space-y-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={cn("p-3 rounded-xl", selectedAgent.color.badge)}>
                    <selectedAgent.icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-apex-text-primary">{selectedAgent.name}</h3>
                    <p className="text-sm text-apex-text-muted mt-0.5 max-w-md">{selectedAgent.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-xl bg-apex-surface border border-apex-border hover:border-apex-border-bright transition-colors text-apex-text-muted hover:text-apex-text-primary">
                    <Settings2 size={14} />
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRun(selectedAgent.id)}
                    className={cn("px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-colors",
                      selectedAgent.status === "active"
                        ? "bg-red-950/40 text-red-400 border border-red-900/40 hover:bg-red-950/60"
                        : "bg-apex-green-dim text-apex-green-bright border border-apex-green/20 hover:bg-apex-green/10"
                    )}
                  >
                    {selectedAgent.status === "active" ? <><Square size={12} /> Stop</> : <><Play size={12} /> Run</>}
                  </motion.button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Today", value: selectedAgent.stats.tasksToday.toString() },
                  { label: "Success Rate", value: `${selectedAgent.stats.successRate}%` },
                  { label: "Avg Duration", value: selectedAgent.stats.avgDuration },
                  { label: "Total Runs", value: selectedAgent.stats.totalRuns.toLocaleString() },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-apex-surface/60 rounded-xl p-3">
                    <div className={cn("text-lg font-bold font-mono", selectedAgent.color.text)}>{value}</div>
                    <div className="text-[10px] text-apex-text-muted mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              {/* Live log */}
              <div>
                <h4 className="text-xs font-semibold text-apex-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Activity size={10} />
                  Live Log
                </h4>
                <div className="bg-apex-black/60 rounded-xl p-4 space-y-1.5 font-mono h-40 overflow-y-auto border border-apex-border">
                  <LogLine type="thinking" text="→ Analyzing ICP signals from Apollo dataset..." />
                  <LogLine type="info" text="   Loaded 47 prospects matching Fintech VP Sales criteria" />
                  <LogLine type="thinking" text="→ Enriching contact data via Apollo API..." />
                  <LogLine type="info" text="   Rate limit: 4 req/s — batching in groups of 10" />
                  <LogLine type="success" text="✓ Enriched 23/47 — LinkedIn URLs, emails, phone numbers" />
                  <LogLine type="thinking" text="→ Generating personalized email for Sarah Chen @ Stripe..." />
                  <LogLine type="info" text="   Context: Series D, APAC expansion, hired 3 AEs last month" />
                  <LogLine type="success" text="✓ Draft complete — 94% personalization score" />
                </div>
              </div>

              {/* Capabilities + integrations */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-apex-text-muted uppercase tracking-wider mb-2">Capabilities</h4>
                  <div className="space-y-1.5">
                    {selectedAgent.capabilities.map((cap) => (
                      <div key={cap} className="flex items-center gap-2 text-xs text-apex-text-secondary">
                        <CheckCircle2 size={10} className={selectedAgent.color.text} />
                        {cap}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-apex-text-muted uppercase tracking-wider mb-2">Connected To</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent.integrations.map((int) => (
                      <span key={int} className={cn("px-2.5 py-1 rounded-lg text-xs font-medium", selectedAgent.color.badge)}>
                        {int}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 space-y-1.5 text-xs text-apex-text-muted">
                    <div className="flex justify-between">
                      <span>Last run</span>
                      <span className="text-apex-text-secondary">{selectedAgent.lastRun}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next run</span>
                      <span className="text-apex-text-secondary">{selectedAgent.nextRun}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
