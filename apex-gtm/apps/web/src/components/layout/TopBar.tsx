"use client";

import { motion } from "framer-motion";
import { Bell, Search, User, ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const breadcrumbMap: Record<string, string> = {
  dashboard: "War Room",
  agents: "AI Agents",
  pipeline: "Pipeline",
  gtm: "GTM Strategy",
  marketing: "Marketing",
  integrations: "Integrations",
  settings: "Settings",
};

interface TopBarProps {
  pathname: string;
}

export function TopBar({ pathname }: TopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const segment = pathname.split("/")[1] || "dashboard";
  const title = breadcrumbMap[segment] || "APEX GTM";

  return (
    <header className="h-16 border-b border-apex-border bg-apex-dark/80 backdrop-blur-xl flex items-center px-6 gap-4 shrink-0">
      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-apex-text-primary">{title}</h1>
        <p className="text-xs text-apex-text-muted">
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Search */}
      <div className="hidden md:flex">
        <motion.div
          animate={{ width: searchOpen ? 280 : 180 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-apex-text-muted" />
          <input
            type="text"
            placeholder="Search anything..."
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setSearchOpen(false)}
            className="w-full h-9 pl-9 pr-3 bg-apex-surface border border-apex-border rounded-xl text-sm text-apex-text-primary placeholder:text-apex-text-muted focus:outline-none focus:border-apex-blue/50 focus:bg-apex-card transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-apex-text-muted font-mono bg-apex-card px-1.5 py-0.5 rounded border border-apex-border">
            ⌘K
          </kbd>
        </motion.div>
      </div>

      {/* AI Status */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-apex-purple-dim/50 border border-apex-purple/20 cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5 text-apex-purple-bright" />
        <span className="text-xs text-apex-purple-bright font-medium">Claude Opus</span>
        <span className="w-1.5 h-1.5 rounded-full bg-apex-green animate-pulse-slow" />
      </motion.div>

      {/* Notifications */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-9 h-9 rounded-xl bg-apex-surface border border-apex-border flex items-center justify-center text-apex-text-muted hover:text-apex-text-primary hover:border-apex-border-bright transition-colors"
      >
        <Bell size={16} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-apex-blue border-2 border-apex-dark" />
      </motion.button>

      {/* User */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-apex-surface border border-apex-border hover:border-apex-border-bright transition-colors"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-apex-blue to-apex-purple flex items-center justify-center">
          <User size={14} className="text-white" />
        </div>
        <span className="hidden sm:block text-sm font-medium text-apex-text-secondary">
          Admin
        </span>
        <ChevronDown size={14} className="text-apex-text-muted" />
      </motion.button>
    </header>
  );
}
