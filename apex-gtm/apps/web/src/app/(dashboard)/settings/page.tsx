"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Settings, User, Bell, Shield, Zap, CreditCard,
  Key, Globe, Moon, Sliders, ChevronRight, Check,
  Eye, EyeOff, Copy, RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "ai", label: "AI Configuration", icon: Zap },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "api", label: "API Keys", icon: Key },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative w-10 h-5 rounded-full transition-colors",
        enabled ? "bg-apex-blue" : "bg-apex-surface border border-apex-border"
      )}
    >
      <motion.div
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
      />
    </button>
  );
}

function ApiKeyRow({ label, value, masked = true }: { label: string; value: string; masked?: boolean }) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-apex-surface/60 border border-apex-border">
      <div>
        <p className="text-xs font-medium text-apex-text-primary">{label}</p>
        <p className="text-xs font-mono text-apex-text-muted mt-0.5">
          {masked && !show ? "•".repeat(32) : value}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {masked && (
          <button onClick={() => setShow(!show)} className="p-1.5 rounded-lg hover:bg-apex-surface text-apex-text-muted hover:text-apex-text-primary transition-colors">
            {show ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        )}
        <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-apex-surface text-apex-text-muted hover:text-apex-text-primary transition-colors">
          {copied ? <Check size={13} className="text-apex-green-bright" /> : <Copy size={13} />}
        </button>
        <button className="p-1.5 rounded-lg hover:bg-apex-surface text-apex-text-muted hover:text-apex-text-primary transition-colors">
          <RefreshCw size={13} />
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [notifications, setNotifications] = useState({
    dealUpdates: true, agentAlerts: true, weeklyDigest: true,
    emailNotifs: false, slackNotifs: true,
  });
  const [aiConfig, setAiConfig] = useState({
    autoEnrich: true, autoSequence: false, callAnalysis: true,
    agentLogging: true, smartScheduling: true,
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-apex-text-primary">Settings</h2>
        <p className="text-sm text-apex-text-muted mt-0.5">Manage your workspace, AI agents, and integrations</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 shrink-0 space-y-1">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all text-left",
                activeSection === id
                  ? "bg-apex-card border border-apex-border-bright text-apex-text-primary"
                  : "text-apex-text-muted hover:text-apex-text-secondary hover:bg-apex-surface/50"
              )}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {activeSection === "profile" && (
            <div className="space-y-4">
              <div className="glass rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-semibold text-apex-text-primary">Profile Information</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-apex-blue to-apex-purple flex items-center justify-center text-2xl font-bold text-white">
                    A
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-apex-text-primary">Alex Rivera</p>
                    <p className="text-xs text-apex-text-muted">alex@apexgtm.com</p>
                    <p className="text-xs text-apex-text-muted mt-0.5">Head of Revenue · APEX GTM</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Full Name", value: "Alex Rivera" },
                    { label: "Email", value: "alex@apexgtm.com" },
                    { label: "Company", value: "APEX GTM" },
                    { label: "Role", value: "Head of Revenue" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <label className="text-[11px] text-apex-text-muted uppercase tracking-wide block mb-1.5">{label}</label>
                      <input
                        defaultValue={value}
                        className="w-full bg-apex-surface border border-apex-border rounded-xl px-3 py-2 text-sm text-apex-text-primary focus:outline-none focus:border-apex-border-bright transition-colors"
                      />
                    </div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-apex-blue to-apex-purple text-white text-sm font-medium"
                >
                  Save Changes
                </motion.button>
              </div>
            </div>
          )}

          {activeSection === "ai" && (
            <div className="glass rounded-2xl p-6 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-apex-text-primary">AI Agent Configuration</h3>
                <p className="text-xs text-apex-text-muted mt-0.5">Control autonomous AI agent behaviors</p>
              </div>

              <div className="space-y-4">
                {[
                  { key: "autoEnrich" as const, label: "Auto-Enrich Leads", desc: "Automatically enrich new leads via Apollo when added to CRM" },
                  { key: "autoSequence" as const, label: "Auto-Enroll Sequences", desc: "Automatically enroll ICP-matching leads in email sequences" },
                  { key: "callAnalysis" as const, label: "Call Analysis", desc: "Process Fireflies transcripts and update HubSpot automatically" },
                  { key: "agentLogging" as const, label: "Verbose Agent Logging", desc: "Store detailed agent reasoning and action logs" },
                  { key: "smartScheduling" as const, label: "AI Scheduling", desc: "Let AI suggest optimal follow-up times based on engagement" },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-apex-border last:border-0">
                    <div>
                      <p className="text-sm text-apex-text-primary">{label}</p>
                      <p className="text-xs text-apex-text-muted mt-0.5">{desc}</p>
                    </div>
                    <Toggle
                      enabled={aiConfig[key]}
                      onChange={(v) => setAiConfig((prev) => ({ ...prev, [key]: v }))}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="text-[11px] text-apex-text-muted uppercase tracking-wide block mb-1.5">Default Claude Model</label>
                <select className="w-full bg-apex-surface border border-apex-border rounded-xl px-3 py-2 text-sm text-apex-text-primary focus:outline-none focus:border-apex-border-bright">
                  <option value="claude-opus-4-6">Claude Opus 4.6 (Most capable)</option>
                  <option value="claude-sonnet-4-6">Claude Sonnet 4.6 (Balanced)</option>
                  <option value="claude-haiku-4-5">Claude Haiku 4.5 (Fast)</option>
                </select>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-apex-text-primary">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { key: "dealUpdates" as const, label: "Deal Stage Updates", desc: "When deals advance or stall in pipeline" },
                  { key: "agentAlerts" as const, label: "Agent Alerts", desc: "When agents complete tasks or encounter errors" },
                  { key: "weeklyDigest" as const, label: "Weekly AI Digest", desc: "Summary of agent activity, pipeline changes, insights" },
                  { key: "emailNotifs" as const, label: "Email Notifications", desc: "Receive notifications via email" },
                  { key: "slackNotifs" as const, label: "Slack Notifications", desc: "Send notifications to Slack (requires Slack integration)" },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-apex-border last:border-0">
                    <div>
                      <p className="text-sm text-apex-text-primary">{label}</p>
                      <p className="text-xs text-apex-text-muted mt-0.5">{desc}</p>
                    </div>
                    <Toggle
                      enabled={notifications[key]}
                      onChange={(v) => setNotifications((prev) => ({ ...prev, [key]: v }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "api" && (
            <div className="glass rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-apex-text-primary">API Keys & Credentials</h3>
                <p className="text-xs text-apex-text-muted mt-0.5">Manage your integration API keys</p>
              </div>
              <div className="space-y-3">
                <ApiKeyRow label="Apollo.io API Key" value="••••••••••••••••••••••••••••••••" />
                <ApiKeyRow label="HubSpot Private App Token" value="••••••••••••••••••••••••••••••••" />
                <ApiKeyRow label="LinkedIn Access Token" value="••••••••••••••••••••••••••••••••" />
                <ApiKeyRow label="Fireflies API Key" value="••••••••••••••••••••••••••••••••" />
                <ApiKeyRow label="Anthropic API Key" value="••••••••••••••••••••••••••••••••" />
                <ApiKeyRow label="APEX GTM Workspace Key" value="Set via environment variable" masked={false} />
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div className="glass rounded-2xl p-6 space-y-5">
              <h3 className="text-sm font-semibold text-apex-text-primary">Security Settings</h3>
              <div className="space-y-3">
                {[
                  { label: "Two-Factor Authentication", value: "Enabled via TOTP", status: "good" },
                  { label: "Session Timeout", value: "8 hours", status: "good" },
                  { label: "IP Allowlist", value: "Not configured", status: "warn" },
                  { label: "Audit Log", value: "Last 90 days retained", status: "good" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-apex-surface/60 border border-apex-border">
                    <div>
                      <p className="text-sm text-apex-text-primary">{item.label}</p>
                      <p className="text-xs text-apex-text-muted mt-0.5">{item.value}</p>
                    </div>
                    <span className={cn(
                      "text-[10px] font-medium px-2 py-0.5 rounded-full",
                      item.status === "good" ? "text-apex-green-bright bg-apex-green-dim" : "text-amber-400 bg-amber-900/30"
                    )}>
                      {item.status === "good" ? "Secure" : "Review"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "billing" && (
            <div className="space-y-4">
              <div className="glass rounded-2xl p-6 border border-apex-purple/20 bg-gradient-to-br from-apex-purple-dim/20 to-transparent">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs text-apex-purple-bright font-semibold uppercase tracking-wide">Current Plan</span>
                    <h3 className="text-2xl font-bold text-apex-text-primary mt-1">Scale</h3>
                    <p className="text-sm text-apex-text-muted">$899 / month · billed annually</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-apex-text-muted">Next billing</p>
                    <p className="text-sm text-apex-text-secondary">April 1, 2026</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  {[
                    { label: "AI Agent Runs", used: "12,408", limit: "Unlimited" },
                    { label: "Contacts", used: "47,203", limit: "100,000" },
                    { label: "Sequences", used: "47", limit: "Unlimited" },
                  ].map((u) => (
                    <div key={u.label}>
                      <p className="text-apex-text-muted">{u.label}</p>
                      <p className="text-apex-text-primary font-mono">{u.used} / {u.limit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
