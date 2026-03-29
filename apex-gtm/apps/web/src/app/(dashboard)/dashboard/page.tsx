"use client";

import { motion } from "framer-motion";
import {
  TrendingUp, Users, Mail, Phone, Target,
  ArrowUpRight, ArrowDownRight, Bot, Activity,
  Zap, Clock, CheckCircle2, AlertCircle,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";
import { AgentFeed } from "@/components/agents/AgentFeed";
import { MetricCard, type MetricCardProps } from "@/components/ui/MetricCard";
import { cn } from "@/lib/utils";

const pipelineData = [
  { month: "Oct", value: 280000, closed: 120000 },
  { month: "Nov", value: 340000, closed: 180000 },
  { month: "Dec", value: 290000, closed: 160000 },
  { month: "Jan", value: 420000, closed: 210000 },
  { month: "Feb", value: 510000, closed: 280000 },
  { month: "Mar", value: 680000, closed: 340000 },
];

const conversionData = [
  { stage: "Prospects", count: 1240 },
  { stage: "Contacted", count: 680 },
  { stage: "Qualified", count: 290 },
  { stage: "Demo", count: 142 },
  { stage: "Proposal", count: 68 },
  { stage: "Closed", count: 31 },
];

const metrics: MetricCardProps[] = [
  {
    label: "Pipeline Value",
    value: "$2.4M",
    change: "+18.2%",
    up: true,
    icon: TrendingUp,
    accent: "blue",
    sub: "vs last quarter",
  },
  {
    label: "Active Prospects",
    value: "1,240",
    change: "+124",
    up: true,
    icon: Users,
    accent: "purple",
    sub: "AI-sourced today",
  },
  {
    label: "Sequences Active",
    value: "47",
    change: "68% open rate",
    up: true,
    icon: Mail,
    accent: "green",
    sub: "across all cadences",
  },
  {
    label: "Meetings Booked",
    value: "18",
    change: "+3 this week",
    up: true,
    icon: Phone,
    accent: "blue",
    sub: "via AI outreach",
  },
];

const agentStatus = [
  { name: "SDR Agent", status: "active", task: "Enriching 47 Apollo leads", runs: 1240 },
  { name: "Deal Intel", status: "active", task: "Analyzing Fireflies call #284", runs: 891 },
  { name: "GTM Engine", status: "idle", task: "Strategy refresh at 3pm", runs: 204 },
  { name: "Marketing AI", status: "active", task: "Drafting LinkedIn campaign", runs: 567 },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass px-3 py-2 rounded-xl text-xs">
      <p className="text-apex-text-muted mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === "value" ? "Pipeline" : "Closed"}: ${(p.value / 1000).toFixed(0)}k
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-apex-text-primary flex items-center gap-2">
            War Room
            <span className="text-xs px-2 py-0.5 rounded-full bg-apex-green-dim border border-apex-green/30 text-apex-green-bright font-normal">
              Live
            </span>
          </h2>
          <p className="text-sm text-apex-text-muted mt-0.5">
            4 agents working autonomously across your pipeline
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl bg-apex-surface border border-apex-border text-sm text-apex-text-secondary hover:border-apex-border-bright transition-colors">
            Last 30 days
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-apex-blue to-apex-purple text-white text-sm font-medium flex items-center gap-2 glow-blue"
          >
            <Zap size={14} />
            Run All Agents
          </motion.button>
        </div>
      </motion.div>

      {/* Metric cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {metrics.map((m) => (
          <motion.div key={m.label} variants={item}>
            <MetricCard {...m} />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts row */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 xl:grid-cols-3 gap-4"
      >
        {/* Pipeline trend */}
        <motion.div
          variants={item}
          className="xl:col-span-2 glass rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-apex-text-primary">Pipeline vs Closed</h3>
              <p className="text-xs text-apex-text-muted mt-0.5">6-month trend</p>
            </div>
            <div className="flex gap-4 text-xs text-apex-text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-apex-blue" />
                Pipeline
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-apex-green" />
                Closed
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={pipelineData}>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D40" />
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fill="url(#blueGrad)" />
              <Area type="monotone" dataKey="closed" stroke="#10B981" strokeWidth={2} fill="url(#greenGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Conversion funnel */}
        <motion.div variants={item} className="glass rounded-2xl p-5">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-apex-text-primary">Conversion Funnel</h3>
            <p className="text-xs text-apex-text-muted mt-0.5">This quarter</p>
          </div>
          <div className="space-y-3">
            {conversionData.map((stage, i) => {
              const pct = Math.round((stage.count / conversionData[0].count) * 100);
              return (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-apex-text-secondary">{stage.stage}</span>
                    <span className="text-apex-text-muted font-mono">{stage.count.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-apex-surface rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, #3B82F6, #8B5CF6)`,
                        opacity: 1 - i * 0.1,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* Agents + Activity */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 xl:grid-cols-3 gap-4"
      >
        {/* Agent status grid */}
        <motion.div variants={item} className="xl:col-span-1 space-y-3">
          <h3 className="text-sm font-semibold text-apex-text-primary flex items-center gap-2">
            <Bot size={14} className="text-apex-purple-bright" />
            Agent Status
          </h3>
          {agentStatus.map((agent) => (
            <div
              key={agent.name}
              className="glass rounded-xl p-4 flex items-start gap-3"
            >
              <div className={cn(
                "w-2 h-2 rounded-full mt-1 shrink-0",
                agent.status === "active" ? "bg-apex-green animate-pulse-slow" : "bg-apex-text-muted"
              )} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-apex-text-primary">{agent.name}</span>
                  <span className="text-[10px] text-apex-text-muted font-mono">{agent.runs.toLocaleString()} runs</span>
                </div>
                <p className="text-xs text-apex-text-muted mt-0.5 truncate">{agent.task}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Live agent feed */}
        <motion.div variants={item} className="xl:col-span-2">
          <AgentFeed />
        </motion.div>
      </motion.div>
    </div>
  );
}
