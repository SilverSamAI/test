"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Megaphone, Sparkles, Calendar, Plus, Edit3,
  Linkedin, Mail, FileText, Image, Video,
  Clock, CheckCircle2, RefreshCw, Eye, Send,
  TrendingUp, Users, Heart, MessageCircle,
  Copy, Download, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ContentType = "linkedin" | "email" | "blog" | "ad";
type ContentStatus = "draft" | "ready" | "scheduled" | "published";

type ContentItem = {
  id: string;
  type: ContentType;
  title: string;
  preview: string;
  status: ContentStatus;
  scheduledFor?: string;
  metrics?: { views?: number; clicks?: number; opens?: number; likes?: number };
  aiScore: number;
};

const contentItems: ContentItem[] = [
  {
    id: "1", type: "linkedin", title: "How Fintech teams cut SDR time by 70%",
    preview: "Most B2B sales teams spend 60% of their time on prospecting. Here's how AI agents are changing that...",
    status: "ready", scheduledFor: "Today 2:00 PM", aiScore: 92,
    metrics: { views: 0, likes: 0 },
  },
  {
    id: "2", type: "email", title: "Q2 Nurture: 'The Pipeline Problem' series",
    preview: "Subject: Your SDRs are spending 4 hours/day on the wrong activity. Hi {{first_name}}, Last week I talked to 23 CROs...",
    status: "draft", aiScore: 87,
  },
  {
    id: "3", type: "linkedin", title: "Outreach raised $200M — what it means for you",
    preview: "Big news in sales tech: Outreach just raised a massive round. Here's our take on what this signals...",
    status: "scheduled", scheduledFor: "Tomorrow 9:00 AM", aiScore: 78,
    metrics: { views: 0, likes: 0 },
  },
  {
    id: "4", type: "blog", title: "The Complete Guide to AI-Powered SDR Teams in 2025",
    preview: "Introduction: The traditional SDR playbook is dead. In 2025, companies that still rely purely on manual prospecting...",
    status: "draft", aiScore: 95,
  },
  {
    id: "5", type: "email", title: "Cold outreach: VP Sales Fintech sequence (3-touch)",
    preview: "Touch 1: Hi {{first_name}}, I noticed {{company}} recently expanded into APAC — congrats on the momentum...",
    status: "ready", scheduledFor: "Live — 47 enrolled", aiScore: 89,
    metrics: { opens: 68, clicks: 24 },
  },
  {
    id: "6", type: "ad", title: "LinkedIn Sponsored: AI SDR for Scaleups",
    preview: "Stop hiring SDRs. Start scaling with AI. APEX GTM automates your entire top-of-funnel — prospecting, enrichment, outreach.",
    status: "published", aiScore: 74,
    metrics: { views: 8400, clicks: 312 },
  },
];

const contentTypeConfig = {
  linkedin: { icon: Linkedin, label: "LinkedIn", color: "text-blue-400 bg-blue-900/30" },
  email: { icon: Mail, label: "Email", color: "text-apex-purple-bright bg-apex-purple-dim" },
  blog: { icon: FileText, label: "Blog", color: "text-amber-400 bg-amber-900/30" },
  ad: { icon: Image, label: "Ad Copy", color: "text-apex-green-bright bg-apex-green-dim" },
};

const statusConfig = {
  draft: { label: "Draft", color: "text-apex-text-muted bg-apex-surface border-apex-border" },
  ready: { label: "Ready", color: "text-amber-400 bg-amber-900/20 border-amber-700/20" },
  scheduled: { label: "Scheduled", color: "text-apex-blue-bright bg-apex-blue-dim border-apex-blue/20" },
  published: { label: "Published", color: "text-apex-green-bright bg-apex-green-dim border-apex-green/20" },
};

const campaignMetrics = [
  { label: "Content Published", value: "47", change: "+12 this week", up: true },
  { label: "Avg Open Rate", value: "68%", change: "+8pt vs industry", up: true },
  { label: "LinkedIn Reach", value: "24.1k", change: "+3.2k this week", up: true },
  { label: "Pipeline Attributed", value: "$480k", change: "from content", up: true },
];

function GeneratorPanel({ onClose }: { onClose: () => void }) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [type, setType] = useState<ContentType>("linkedin");
  const [topic, setTopic] = useState("");

  const handleGenerate = () => {
    if (!topic) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2500);
  };

  return (
    <div className="glass rounded-2xl p-5 border border-apex-purple/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-apex-text-primary flex items-center gap-2">
          <Sparkles size={14} className="text-apex-purple-bright" />
          AI Content Generator
        </h3>
        <button onClick={onClose} className="text-apex-text-muted hover:text-apex-text-primary text-xs">✕</button>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          {(Object.entries(contentTypeConfig) as [ContentType, typeof contentTypeConfig[ContentType]][]).map(([id, cfg]) => {
            const Icon = cfg.icon;
            return (
              <button
                key={id}
                onClick={() => setType(id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                  type === id
                    ? `${cfg.color} border-current`
                    : "text-apex-text-muted bg-apex-surface border-apex-border hover:border-apex-border-bright"
                )}
              >
                <Icon size={11} />
                {cfg.label}
              </button>
            );
          })}
        </div>

        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Topic, angle, or key message (e.g. 'AI replacing manual SDR work, target VP Sales at Fintech scaleups')"
          className="w-full bg-apex-surface border border-apex-border rounded-xl p-3 text-xs text-apex-text-primary placeholder-apex-text-muted focus:outline-none focus:border-apex-border-bright resize-none h-20"
        />

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleGenerate}
          disabled={!topic || generating}
          className={cn(
            "w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all",
            topic && !generating
              ? "bg-gradient-to-r from-apex-purple to-apex-blue text-white"
              : "bg-apex-surface text-apex-text-muted cursor-not-allowed"
          )}
        >
          {generating ? (
            <><div className="w-3.5 h-3.5 border border-white/60 border-t-transparent rounded-full animate-spin" /> Generating with Claude...</>
          ) : (
            <><Sparkles size={14} /> Generate Content</>
          )}
        </motion.button>

        {generated && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-apex-black/60 border border-apex-border font-mono text-xs text-apex-text-secondary space-y-2"
          >
            <p className="text-apex-green-bright">✓ Content generated (92/100 AI score)</p>
            <p className="text-apex-text-primary font-sans font-semibold">Most sales teams are doing prospecting wrong.</p>
            <p className="text-apex-text-secondary font-sans">
              We analyzed 500+ B2B sales cycles and found that 71% of SDR time goes to leads that will never convert.<br /><br />
              The fix? AI agents that enrich, score, and prioritize before your team ever touches a lead.<br /><br />
              Here's the exact system we built at APEX GTM 👇
            </p>
            <div className="flex gap-2 pt-2">
              <button className="px-3 py-1.5 rounded-lg bg-apex-surface border border-apex-border text-[11px] text-apex-text-secondary flex items-center gap-1">
                <Copy size={10} /> Copy
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-apex-green-dim text-apex-green-bright border border-apex-green/20 text-[11px] flex items-center gap-1">
                <CheckCircle2 size={10} /> Save to Library
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function MarketingPage() {
  const [filter, setFilter] = useState<ContentStatus | "all">("all");
  const [showGenerator, setShowGenerator] = useState(false);

  const filtered = filter === "all" ? contentItems : contentItems.filter((c) => c.status === filter);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-apex-text-primary">Marketing AI</h2>
          <p className="text-sm text-apex-text-muted mt-0.5">AI-generated content, campaigns, and sequences</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowGenerator(!showGenerator)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-apex-purple to-apex-blue text-white text-sm font-medium flex items-center gap-2"
        >
          <Sparkles size={14} />
          Generate Content
        </motion.button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-3">
        {campaignMetrics.map((m) => (
          <div key={m.label} className="glass rounded-xl p-4 border border-apex-border">
            <div className="text-xl font-bold text-apex-text-primary font-mono">{m.value}</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-apex-text-muted">{m.label}</span>
              <span className={cn("text-[10px] font-medium", m.up ? "text-apex-green-bright" : "text-red-400")}>{m.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Generator panel */}
      <AnimatePresence>
        {showGenerator && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <GeneratorPanel onClose={() => setShowGenerator(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 p-1 bg-apex-surface rounded-xl border border-apex-border">
          {(["all", "draft", "ready", "scheduled", "published"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all",
                filter === f
                  ? "bg-apex-card text-apex-text-primary border border-apex-border-bright"
                  : "text-apex-text-muted hover:text-apex-text-secondary"
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="text-xs text-apex-text-muted">{filtered.length} items</span>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const typeCfg = contentTypeConfig[item.type];
          const TypeIcon = typeCfg.icon;
          const statusCfg = statusConfig[item.status];

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-5 border border-apex-border hover:border-apex-border-bright transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={cn("p-1.5 rounded-lg text-[11px]", typeCfg.color)}>
                    <TypeIcon size={12} />
                  </span>
                  <span className="text-xs text-apex-text-muted">{typeCfg.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border", statusCfg.color)}>
                    {statusCfg.label}
                  </span>
                  <span className={cn(
                    "text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md",
                    item.aiScore >= 90 ? "bg-apex-green-dim text-apex-green-bright" :
                    item.aiScore >= 75 ? "bg-apex-blue-dim text-apex-blue-bright" :
                    "bg-apex-surface text-apex-text-muted"
                  )}>
                    {item.aiScore}
                  </span>
                </div>
              </div>

              <h4 className="text-sm font-semibold text-apex-text-primary mb-1.5">{item.title}</h4>
              <p className="text-xs text-apex-text-muted line-clamp-2 mb-3">{item.preview}</p>

              {item.scheduledFor && (
                <div className="flex items-center gap-1.5 text-[10px] text-apex-text-muted mb-3">
                  <Clock size={9} />
                  {item.scheduledFor}
                </div>
              )}

              {item.metrics && (
                <div className="flex items-center gap-4 text-[10px] text-apex-text-muted mb-3">
                  {item.metrics.views !== undefined && (
                    <span className="flex items-center gap-1"><Eye size={9} />{item.metrics.views.toLocaleString()}</span>
                  )}
                  {item.metrics.likes !== undefined && (
                    <span className="flex items-center gap-1"><Heart size={9} />{item.metrics.likes}</span>
                  )}
                  {item.metrics.opens !== undefined && (
                    <span className="flex items-center gap-1"><Mail size={9} />{item.metrics.opens}% opens</span>
                  )}
                  {item.metrics.clicks !== undefined && (
                    <span className="flex items-center gap-1"><TrendingUp size={9} />{item.metrics.clicks}% CTR</span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-apex-surface border border-apex-border text-[11px] text-apex-text-secondary hover:border-apex-border-bright transition-colors">
                  <Edit3 size={10} /> Edit
                </button>
                {item.status === "ready" && (
                  <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-apex-green-dim text-apex-green-bright border border-apex-green/20 text-[11px] hover:bg-apex-green/10 transition-colors">
                    <Send size={10} /> Publish
                  </button>
                )}
                {item.status === "draft" && (
                  <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-apex-blue-dim text-apex-blue-bright border border-apex-blue/20 text-[11px] hover:bg-apex-blue/10 transition-colors">
                    <Sparkles size={10} /> Polish with AI
                  </button>
                )}
                <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-apex-surface border border-apex-border text-[11px] text-apex-text-secondary hover:border-apex-border-bright transition-colors ml-auto">
                  <Copy size={10} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
