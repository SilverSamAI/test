"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Bot, Search, Mail, Phone, Target, Sparkles, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type FeedEvent = {
  id: string;
  agent: string;
  action: string;
  detail: string;
  time: string;
  type: "prospect" | "email" | "call" | "strategy" | "enrich" | "complete";
  accent: "blue" | "purple" | "green" | "amber";
};

const icons = {
  prospect: Search,
  email: Mail,
  call: Phone,
  strategy: Target,
  enrich: Sparkles,
  complete: CheckCircle2,
};

const accentClasses = {
  blue: "text-apex-blue-bright bg-apex-blue-dim",
  purple: "text-apex-purple-bright bg-apex-purple-dim",
  green: "text-apex-green-bright bg-apex-green-dim",
  amber: "text-amber-400 bg-amber-900/30",
};

const accentDot = {
  blue: "bg-apex-blue",
  purple: "bg-apex-purple",
  green: "bg-apex-green",
  amber: "bg-amber-400",
};

const mockEvents: FeedEvent[] = [
  { id: "1", agent: "SDR Agent", action: "Enriched prospect", detail: "Sarah Chen, VP Sales @ Stripe — LinkedIn + Apollo match found", time: "now", type: "enrich", accent: "purple" },
  { id: "2", agent: "SDR Agent", action: "Drafted sequence", detail: "Personalized 3-touch email sequence for Fintech ICP batch (47 leads)", time: "2m ago", type: "email", accent: "blue" },
  { id: "3", agent: "Deal Intel", action: "Call analyzed", detail: "Fireflies #284 with Acme Corp — extracted 3 action items, 2 objections", time: "5m ago", type: "call", accent: "green" },
  { id: "4", agent: "Deal Intel", action: "HubSpot updated", detail: "Deal stage advanced: Acme Corp → Proposal ($84k)", time: "5m ago", type: "complete", accent: "green" },
  { id: "5", agent: "GTM Engine", action: "ICP refined", detail: "New signals: SaaS companies 50-200 employees, recent Series B, APAC expansion", time: "12m ago", type: "strategy", accent: "blue" },
  { id: "6", agent: "Marketing AI", action: "Content drafted", detail: "LinkedIn post: 'How Fintech teams cut SDR time by 70%' — ready for review", time: "18m ago", type: "email", accent: "purple" },
  { id: "7", agent: "SDR Agent", action: "Sequence enrolled", detail: "12 prospects added to 'Fintech VP Sales Q2' cadence", time: "24m ago", type: "prospect", accent: "blue" },
  { id: "8", agent: "GTM Engine", action: "Competitive update", detail: "Outreach raised $200M Series E — repositioning opportunity detected", time: "31m ago", type: "strategy", accent: "amber" },
];

export function AgentFeed() {
  const [events, setEvents] = useState<FeedEvent[]>(mockEvents);
  const [newEvent, setNewEvent] = useState<FeedEvent | null>(null);

  // Simulate live events
  useEffect(() => {
    const liveEvents: FeedEvent[] = [
      { id: "live-1", agent: "SDR Agent", action: "New lead found", detail: "Mike Torres, CRO @ Plaid — 94% ICP match via Apollo", time: "just now", type: "prospect", accent: "purple" },
      { id: "live-2", agent: "Deal Intel", action: "Meeting booked", detail: "DataDog follow-up scheduled — AI suggested Monday 2pm EST", time: "just now", type: "complete", accent: "green" },
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < liveEvents.length) {
        const e = liveEvents[i];
        setNewEvent(e);
        setEvents((prev) => [e, ...prev.slice(0, 9)]);
        i++;
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass rounded-2xl p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bot size={16} className="text-apex-purple-bright" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-apex-green border border-apex-dark animate-pulse" />
          </div>
          <h3 className="text-sm font-semibold text-apex-text-primary">Agent Activity Feed</h3>
        </div>
        <span className="text-xs text-apex-text-muted px-2 py-1 rounded-lg bg-apex-surface border border-apex-border">
          Live
        </span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {events.map((event) => {
            const Icon = icons[event.type];
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -12, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex gap-3 p-3 rounded-xl bg-apex-surface/50 border border-apex-border/50 hover:border-apex-border transition-colors group"
              >
                <div className={cn("p-1.5 rounded-lg shrink-0 mt-0.5", accentClasses[event.accent])}>
                  <Icon size={12} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-medium text-apex-text-primary">{event.agent}</span>
                    <span className="text-[10px] text-apex-text-muted">·</span>
                    <span className="text-[10px] text-apex-text-muted">{event.action}</span>
                    <span className="ml-auto text-[10px] text-apex-text-muted shrink-0 flex items-center gap-1">
                      <Clock size={10} />
                      {event.time}
                    </span>
                  </div>
                  <p className="text-xs text-apex-text-secondary truncate">{event.detail}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
