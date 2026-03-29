"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Bot,
  TrendingUp,
  Megaphone,
  Target,
  Plug,
  Settings,
  ChevronLeft,
  Activity,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  {
    label: "War Room",
    href: "/dashboard",
    icon: LayoutDashboard,
    accent: "blue",
  },
  {
    label: "AI Agents",
    href: "/agents",
    icon: Bot,
    accent: "purple",
    badge: "4 active",
  },
  {
    label: "Pipeline",
    href: "/pipeline",
    icon: TrendingUp,
    accent: "green",
  },
  {
    label: "GTM Strategy",
    href: "/gtm",
    icon: Target,
    accent: "blue",
  },
  {
    label: "Marketing",
    href: "/marketing",
    icon: Megaphone,
    accent: "purple",
  },
  {
    label: "Integrations",
    href: "/integrations",
    icon: Plug,
    accent: "green",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    accent: "blue",
  },
];

const accentColors = {
  blue: {
    bg: "bg-apex-blue-dim",
    text: "text-apex-blue-bright",
    border: "border-apex-blue/30",
    glow: "shadow-glow-blue",
    dot: "bg-apex-blue",
  },
  purple: {
    bg: "bg-apex-purple-dim",
    text: "text-apex-purple-bright",
    border: "border-apex-purple/30",
    glow: "shadow-glow-purple",
    dot: "bg-apex-purple",
  },
  green: {
    bg: "bg-apex-green-dim",
    text: "text-apex-green-bright",
    border: "border-apex-green/30",
    glow: "shadow-glow-green",
    dot: "bg-apex-green",
  },
};

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-full bg-apex-dark border-r border-apex-border shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-apex-border shrink-0">
        <motion.div
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 min-w-0"
        >
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-apex-blue to-apex-purple flex items-center justify-center glow-blue">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-apex-green border-2 border-apex-dark" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <span className="font-bold text-sm tracking-wider gradient-text-blue whitespace-nowrap">
                  APEX GTM
                </span>
                <p className="text-[10px] text-apex-text-muted whitespace-nowrap">
                  Revenue Intelligence
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Agent activity pulse */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-3 mt-3 mb-1 px-3 py-2 rounded-lg bg-apex-purple-dim/50 border border-apex-purple/20 flex items-center gap-2"
          >
            <Activity className="w-3.5 h-3.5 text-apex-purple-bright shrink-0" />
            <span className="text-xs text-apex-purple-bright font-medium">
              4 agents running
            </span>
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-apex-purple animate-pulse-slow" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {nav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const colors = accentColors[item.accent as keyof typeof accentColors];
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: collapsed ? 0 : 2 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group cursor-pointer",
                  active
                    ? `${colors.bg} ${colors.border} border`
                    : "hover:bg-apex-surface border border-transparent"
                )}
              >
                {/* Active indicator bar */}
                {active && (
                  <motion.div
                    layoutId="activeBar"
                    className={cn(
                      "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full",
                      colors.dot
                    )}
                  />
                )}

                <Icon
                  className={cn(
                    "w-4.5 h-4.5 shrink-0 transition-colors",
                    active
                      ? colors.text
                      : "text-apex-text-muted group-hover:text-apex-text-secondary"
                  )}
                  size={18}
                />

                <AnimatePresence>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-between flex-1 min-w-0"
                    >
                      <span
                        className={cn(
                          "text-sm font-medium transition-colors truncate",
                          active
                            ? colors.text
                            : "text-apex-text-secondary group-hover:text-apex-text-primary"
                        )}
                      >
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="ml-2 px-1.5 py-0.5 text-[10px] rounded-md bg-apex-purple/20 text-apex-purple-bright border border-apex-purple/20 whitespace-nowrap">
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-apex-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 rounded-lg hover:bg-apex-surface transition-colors text-apex-text-muted hover:text-apex-text-secondary"
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronLeft size={16} />
          </motion.div>
        </button>
      </div>
    </motion.aside>
  );
}
