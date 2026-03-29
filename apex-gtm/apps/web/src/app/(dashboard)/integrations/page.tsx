"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Plug, CheckCircle2, AlertCircle, RefreshCw,
  Settings2, ExternalLink, Zap, Activity,
  Database, Lock, ArrowRight, Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

type IntegrationStatus = "connected" | "error" | "disconnected" | "syncing";

type Integration = {
  id: string;
  name: string;
  description: string;
  category: string;
  status: IntegrationStatus;
  lastSync?: string;
  recordsSync?: number;
  icon: string;
  color: string;
  features: string[];
  apiHealth?: number;
  webhooksActive?: number;
};

const integrations: Integration[] = [
  {
    id: "apollo",
    name: "Apollo.io",
    description: "B2B prospecting, lead enrichment, and email sequencing platform",
    category: "Prospecting",
    status: "connected",
    lastSync: "2 min ago",
    recordsSync: 47203,
    icon: "🎯",
    color: "from-orange-600 to-orange-800",
    features: ["Contact Search", "Email Enrichment", "Phone Numbers", "Sequences", "Intent Data"],
    apiHealth: 99.8,
    webhooksActive: 3,
  },
  {
    id: "hubspot",
    name: "HubSpot CRM",
    description: "CRM, deal pipeline, contact management, and marketing automation",
    category: "CRM",
    status: "connected",
    lastSync: "1 min ago",
    recordsSync: 8841,
    icon: "🟠",
    color: "from-orange-500 to-red-600",
    features: ["Deal Pipeline", "Contact Sync", "Activity Logging", "Email Tracking", "Reports"],
    apiHealth: 100,
    webhooksActive: 7,
  },
  {
    id: "linkedin",
    name: "LinkedIn Sales Navigator",
    description: "Advanced prospect search, account tracking, and social selling intelligence",
    category: "Social Selling",
    status: "syncing",
    lastSync: "Syncing now...",
    recordsSync: 1204,
    icon: "💼",
    color: "from-blue-600 to-blue-800",
    features: ["Lead Search", "Account Insights", "Connection Requests", "InMail", "Alerts"],
    apiHealth: 97.2,
    webhooksActive: 1,
  },
  {
    id: "fireflies",
    name: "Fireflies.ai",
    description: "AI meeting recorder, call transcription, and action item extraction",
    category: "Call Intelligence",
    status: "connected",
    lastSync: "5 min ago",
    recordsSync: 284,
    icon: "🔥",
    color: "from-purple-600 to-purple-800",
    features: ["Auto-Join", "Transcription", "Action Items", "Sentiment Analysis", "HubSpot Sync"],
    apiHealth: 99.1,
    webhooksActive: 2,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Team notifications for deal updates, agent alerts, and pipeline changes",
    category: "Notifications",
    status: "disconnected",
    icon: "💬",
    color: "from-purple-500 to-pink-600",
    features: ["Deal Alerts", "Agent Notifications", "Weekly Digest", "Command Interface"],
  },
  {
    id: "gong",
    name: "Gong.io",
    description: "Revenue intelligence, call coaching, and deal risk detection",
    category: "Call Intelligence",
    status: "disconnected",
    icon: "🔔",
    color: "from-blue-500 to-indigo-600",
    features: ["Call Analytics", "Deal Intelligence", "Coaching Insights", "Forecast"],
  },
  {
    id: "outreach",
    name: "Outreach",
    description: "Sales execution platform for sequences and pipeline management",
    category: "Sequences",
    status: "error",
    lastSync: "Failed 1h ago",
    icon: "📤",
    color: "from-indigo-600 to-purple-700",
    features: ["Sequences", "Dialer", "Analytics", "Pipeline Management"],
    apiHealth: 0,
  },
  {
    id: "clay",
    name: "Clay",
    description: "Data enrichment and personalization at scale",
    category: "Enrichment",
    status: "disconnected",
    icon: "🧱",
    color: "from-amber-600 to-orange-700",
    features: ["Multi-source Enrichment", "Waterfall", "AI Research", "CRM Push"],
  },
];

const statusConfig = {
  connected: { label: "Connected", color: "text-apex-green-bright bg-apex-green-dim border-apex-green/20", dot: "bg-apex-green animate-pulse" },
  syncing: { label: "Syncing", color: "text-apex-blue-bright bg-apex-blue-dim border-apex-blue/20", dot: "bg-apex-blue animate-pulse" },
  error: { label: "Error", color: "text-red-400 bg-red-950/40 border-red-900/40", dot: "bg-red-500" },
  disconnected: { label: "Not Connected", color: "text-apex-text-muted bg-apex-surface border-apex-border", dot: "bg-apex-text-muted" },
};

function IntegrationCard({ integration, onSelect }: { integration: Integration; onSelect: () => void }) {
  const sc = statusConfig[integration.status];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onSelect}
      className="glass rounded-2xl p-5 border border-apex-border hover:border-apex-border-bright cursor-pointer transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl", integration.color)}>
            {integration.icon}
          </div>
          <div>
            <h3 className="text-sm font-bold text-apex-text-primary">{integration.name}</h3>
            <span className="text-[10px] text-apex-text-muted bg-apex-surface px-2 py-0.5 rounded-full border border-apex-border">
              {integration.category}
            </span>
          </div>
        </div>
        <div className={cn("flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-full border", sc.color)}>
          <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", sc.dot)} />
          {sc.label}
        </div>
      </div>

      <p className="text-xs text-apex-text-muted mb-4 line-clamp-2">{integration.description}</p>

      {integration.status === "connected" || integration.status === "syncing" ? (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {integration.lastSync && (
            <div>
              <div className="text-[10px] text-apex-text-muted mb-0.5">Last sync</div>
              <div className="text-xs text-apex-text-secondary">{integration.lastSync}</div>
            </div>
          )}
          {integration.recordsSync !== undefined && (
            <div>
              <div className="text-[10px] text-apex-text-muted mb-0.5">Records</div>
              <div className="text-xs font-mono text-apex-text-secondary">{integration.recordsSync.toLocaleString()}</div>
            </div>
          )}
          {integration.apiHealth !== undefined && (
            <div>
              <div className="text-[10px] text-apex-text-muted mb-0.5">API health</div>
              <div className={cn("text-xs font-mono", integration.apiHealth >= 99 ? "text-apex-green-bright" : "text-amber-400")}>
                {integration.apiHealth}%
              </div>
            </div>
          )}
        </div>
      ) : null}

      {integration.status === "error" && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-950/20 border border-red-900/30 mb-4">
          <AlertCircle size={12} className="text-red-400 shrink-0" />
          <span className="text-[11px] text-red-400">API authentication failed — reconfigure</span>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {integration.features.slice(0, 3).map((f) => (
          <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-apex-surface border border-apex-border text-apex-text-muted">
            {f}
          </span>
        ))}
        {integration.features.length > 3 && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-apex-surface border border-apex-border text-apex-text-muted">
            +{integration.features.length - 3} more
          </span>
        )}
      </div>

      {integration.status === "disconnected" && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 py-2 rounded-xl bg-gradient-to-r from-apex-blue/10 to-apex-purple/10 border border-apex-blue/20 text-xs text-apex-blue-bright hover:from-apex-blue/20 hover:to-apex-purple/20 transition-all flex items-center justify-center gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <Plus size={11} /> Connect
        </motion.button>
      )}
    </motion.div>
  );
}

export default function IntegrationsPage() {
  const [selected, setSelected] = useState<Integration | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(integrations.map((i) => i.category)))];
  const filtered = categoryFilter === "All" ? integrations : integrations.filter((i) => i.category === categoryFilter);

  const connected = integrations.filter((i) => i.status === "connected" || i.status === "syncing").length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-apex-text-primary">Integrations</h2>
          <p className="text-sm text-apex-text-muted mt-0.5">{connected} of {integrations.length} connected · 13 active webhooks</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 rounded-xl bg-apex-surface border border-apex-border text-sm text-apex-text-secondary hover:border-apex-border-bright transition-colors flex items-center gap-2"
        >
          <RefreshCw size={14} />
          Sync All
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Connected", value: connected.toString(), color: "text-apex-green-bright" },
          { label: "Records Synced", value: "57.5k", color: "text-apex-blue-bright" },
          { label: "Active Webhooks", value: "13", color: "text-apex-purple-bright" },
          { label: "Sync Errors", value: "1", color: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-4 border border-apex-border">
            <div className={cn("text-2xl font-bold font-mono", s.color)}>{s.value}</div>
            <div className="text-xs text-apex-text-muted mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-medium transition-all border",
              categoryFilter === cat
                ? "bg-apex-card border-apex-border-bright text-apex-text-primary"
                : "bg-apex-surface border-apex-border text-apex-text-muted hover:text-apex-text-secondary"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
        {filtered.map((integration) => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onSelect={() => setSelected(integration)}
          />
        ))}
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-96 bg-apex-dark border-l border-apex-border p-6 overflow-y-auto z-50 space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl", selected.color)}>
                    {selected.icon}
                  </div>
                  <h3 className="text-lg font-bold text-apex-text-primary">{selected.name}</h3>
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-apex-surface text-apex-text-muted">✕</button>
              </div>

              <div className="glass rounded-xl p-4 space-y-3">
                {selected.webhooksActive !== undefined && (
                  <div className="flex justify-between text-xs">
                    <span className="text-apex-text-muted">Active Webhooks</span>
                    <span className="text-apex-text-secondary font-mono">{selected.webhooksActive}</span>
                  </div>
                )}
                {selected.apiHealth !== undefined && (
                  <div className="flex justify-between text-xs">
                    <span className="text-apex-text-muted">API Uptime</span>
                    <span className={cn("font-mono", selected.apiHealth >= 99 ? "text-apex-green-bright" : "text-amber-400")}>
                      {selected.apiHealth}%
                    </span>
                  </div>
                )}
                {selected.recordsSync !== undefined && (
                  <div className="flex justify-between text-xs">
                    <span className="text-apex-text-muted">Synced Records</span>
                    <span className="text-apex-text-secondary font-mono">{selected.recordsSync.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-semibold text-apex-text-muted uppercase tracking-wider mb-3">Features</h4>
                <div className="space-y-2">
                  {selected.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-apex-text-secondary">
                      <CheckCircle2 size={11} className="text-apex-green-bright shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {selected.status === "connected" && (
                <div className="space-y-2">
                  <button className="w-full py-2.5 rounded-xl bg-apex-surface border border-apex-border text-xs text-apex-text-secondary hover:border-apex-border-bright transition-colors flex items-center justify-center gap-2">
                    <Settings2 size={12} /> Configure
                  </button>
                  <button className="w-full py-2.5 rounded-xl bg-apex-surface border border-apex-border text-xs text-apex-text-secondary hover:border-apex-border-bright transition-colors flex items-center justify-center gap-2">
                    <RefreshCw size={12} /> Force Sync
                  </button>
                </div>
              )}

              {selected.status === "disconnected" && (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-apex-blue to-apex-purple text-white text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Plug size={14} /> Connect {selected.name}
                </motion.button>
              )}

              {selected.status === "error" && (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  className="w-full py-3 rounded-xl bg-red-950/30 border border-red-900/40 text-red-400 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <RefreshCw size={14} /> Reconnect
                </motion.button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
