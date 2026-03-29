# APEX GTM

## What This Is

APEX GTM is an agentic AI platform that acts as an autonomous revenue team for B2B companies. It connects Apollo, HubSpot, LinkedIn Sales Navigator, and Fireflies into a unified intelligence layer, then runs AI agents that prospect, personalize outreach, execute sequences, analyze calls, and generate GTM strategy — all without human micromanagement.

## Core Value

Close more pipeline faster by letting AI agents handle the full SDR + GTM motion while humans focus only on high-value conversations.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] AI SDR Agent — prospect discovery, lead enrichment via Apollo, personalized email + LinkedIn sequences
- [ ] Deal Intelligence — HubSpot pipeline sync, Fireflies call analysis, AI-generated next steps
- [ ] GTM Strategy Engine — ICP definition, positioning, go-to-market plan generation via Claude
- [ ] Marketing Automation — content generation, campaign planning, social posts, competitive intel
- [ ] Revenue Dashboard — real-time pipeline metrics, forecasting, attribution, agent activity feed
- [ ] Integration Hub — Apollo, HubSpot, LinkedIn Sales Navigator, Fireflies.ai connections
- [ ] Premium UI — dark theme, neon accents, glassmorphism, Framer Motion animations

### Out of Scope

- Native mobile app — web-first, responsive later
- Self-hosted LLM — Claude API only for quality
- Cold calling dialer — Fireflies covers call analysis; outbound calling not in v1

## Context

- Stack: Next.js 15 (App Router), TypeScript, Tailwind, shadcn/ui, Framer Motion, FastAPI, LangGraph, Claude API, Supabase
- Deploy: Next.js frontend on Vercel, FastAPI backend on Railway, Supabase for DB + real-time
- Auth: Supabase Auth (simpler stack alignment)
- Design direction: premium dark theme with electric blue/purple neon accents — Vercel + Linear + Stripe meets war room dashboard

## Constraints

- **Stack**: Next.js 15 + FastAPI + Supabase — no deviations without explicit discussion
- **Deploy**: Vercel (frontend) + Railway (backend) — Docker Compose for local dev
- **AI**: Claude API via Anthropic SDK only — LangGraph for agent orchestration
- **APIs**: Apollo, HubSpot, LinkedIn Sales Navigator, Fireflies — all via official APIs

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| FastAPI over Node backend | LangGraph + Python agents, better AI ecosystem | — Pending |
| Supabase Auth over Clerk | Fewer services, Supabase already in stack | — Pending |
| LangGraph for agents | Production-grade stateful agent orchestration | — Pending |
| shadcn/ui + Tailwind | Fastest to premium-looking UI, fully customizable | — Pending |

---
*Last updated: 2026-03-29 after project initialization*
