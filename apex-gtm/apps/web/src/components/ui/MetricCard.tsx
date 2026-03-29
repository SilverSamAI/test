"use client";

import { motion } from "framer-motion";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

const accents = {
  blue: {
    icon: "bg-apex-blue-dim text-apex-blue-bright",
    border: "hover:border-apex-blue/30",
    glow: "hover:glow-blue",
    badge: "bg-apex-green-dim text-apex-green-bright",
  },
  purple: {
    icon: "bg-apex-purple-dim text-apex-purple-bright",
    border: "hover:border-apex-purple/30",
    glow: "hover:glow-purple",
    badge: "bg-apex-green-dim text-apex-green-bright",
  },
  green: {
    icon: "bg-apex-green-dim text-apex-green-bright",
    border: "hover:border-apex-green/30",
    glow: "hover:glow-green",
    badge: "bg-apex-green-dim text-apex-green-bright",
  },
};

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: LucideIcon;
  accent: "blue" | "purple" | "green";
  sub: string;
}

export function MetricCard({ label, value, change, up, icon: Icon, accent, sub }: MetricCardProps) {
  const a = accents[accent];

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "glass rounded-2xl p-5 border transition-all duration-300 shadow-card hover:shadow-card-hover cursor-pointer",
        a.border
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2.5 rounded-xl", a.icon)}>
          <Icon size={18} />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg",
          up ? "bg-apex-green-dim text-apex-green-bright" : "bg-red-950/40 text-red-400"
        )}>
          {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {change}
        </div>
      </div>
      <div className="text-2xl font-bold text-apex-text-primary font-mono tracking-tight">
        {value}
      </div>
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs font-medium text-apex-text-secondary">{label}</p>
        <p className="text-[10px] text-apex-text-muted">{sub}</p>
      </div>
    </motion.div>
  );
}
