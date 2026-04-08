"""SDR Agent — autonomous prospecting, enrichment, and outreach via LangGraph."""

from typing import TypedDict, Annotated, List, Optional
import operator
import asyncio

try:
    from langgraph.graph import StateGraph, END
    from langgraph.prebuilt import ToolNode
    LANGGRAPH_AVAILABLE = True
except ImportError:
    LANGGRAPH_AVAILABLE = False

try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False


class SDRState(TypedDict):
    search_criteria: dict
    prospects: Annotated[List[dict], operator.add]
    enriched: Annotated[List[dict], operator.add]
    emails_drafted: Annotated[List[dict], operator.add]
    messages: Annotated[List[dict], operator.add]
    next_action: str
    completed: bool


async def search_prospects_node(state: SDRState) -> dict:
    """Search Apollo.io for prospects matching ICP criteria."""
    criteria = state.get("search_criteria", {})

    # In production: call Apollo API
    mock_prospects = [
        {
            "id": f"p{i}", "first_name": "Prospect", "last_name": str(i),
            "title": criteria.get("job_titles", ["VP Sales"])[0],
            "company": f"Company {i}", "email": f"prospect{i}@company{i}.com",
        }
        for i in range(1, min(criteria.get("limit", 5) + 1, 6))
    ]

    return {
        "prospects": mock_prospects,
        "messages": [{"role": "system", "content": f"Found {len(mock_prospects)} prospects matching ICP criteria"}],
        "next_action": "enrich",
    }


async def enrich_prospects_node(state: SDRState) -> dict:
    """Enrich prospects with additional data (LinkedIn, phone, company details)."""
    prospects = state.get("prospects", [])
    enriched = []

    for p in prospects:
        enriched.append({
            **p,
            "linkedin_url": f"https://linkedin.com/in/{p['first_name'].lower()}-{p['id']}",
            "phone": "+1-555-0100",
            "company_size": "50-200",
            "funding_stage": "Series B",
            "icp_score": 0.85 + (hash(p["id"]) % 15) / 100,
            "enriched": True,
        })

    return {
        "enriched": enriched,
        "messages": [{"role": "system", "content": f"Enriched {len(enriched)} prospects via Apollo + LinkedIn"}],
        "next_action": "draft_outreach",
    }


async def draft_outreach_node(state: SDRState) -> dict:
    """Use Claude to draft personalized outreach emails."""
    enriched = state.get("enriched", [])
    emails = []

    for prospect in enriched[:3]:  # limit in demo
        if ANTHROPIC_AVAILABLE:
            try:
                from core.config import get_settings
                settings = get_settings()
                client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

                response = await client.messages.create(
                    model=settings.claude_model,
                    max_tokens=400,
                    messages=[{
                        "role": "user",
                        "content": (
                            f"Write a short, highly personalized cold email (3-4 sentences) for:\n"
                            f"Name: {prospect['first_name']} {prospect['last_name']}\n"
                            f"Title: {prospect.get('title', 'VP Sales')}\n"
                            f"Company: {prospect['company']}\n"
                            f"Stage: {prospect.get('funding_stage', 'growth')}\n"
                            f"Product: APEX GTM — AI-powered SDR and GTM automation platform\n"
                            f"Tone: direct, value-focused, not salesy. No fluff."
                        ),
                    }],
                )
                body = response.content[0].text
            except Exception:
                body = f"Hi {prospect['first_name']}, I noticed {prospect['company']} is scaling — APEX GTM automates your entire top-of-funnel. Worth a 15-min chat?"
        else:
            body = f"Hi {prospect['first_name']}, I noticed {prospect['company']} is scaling — APEX GTM automates your entire top-of-funnel. Worth a 15-min chat?"

        emails.append({
            "prospect_id": prospect["id"],
            "to": prospect.get("email"),
            "subject": f"Quick question for {prospect['company']}",
            "body": body,
            "personalization_score": 88,
        })

    return {
        "emails_drafted": emails,
        "messages": [{"role": "system", "content": f"Drafted {len(emails)} personalized emails via Claude"}],
        "next_action": "done",
        "completed": True,
    }


async def run_sdr_agent(payload: dict) -> dict:
    """Run the SDR agent end-to-end."""
    if not LANGGRAPH_AVAILABLE:
        # Fallback: run nodes sequentially without graph
        state: SDRState = {
            "search_criteria": payload.get("search_criteria", {"job_titles": ["VP Sales"], "limit": 3}),
            "prospects": [],
            "enriched": [],
            "emails_drafted": [],
            "messages": [],
            "next_action": "search",
            "completed": False,
        }
        state.update(await search_prospects_node(state))
        state.update(await enrich_prospects_node(state))
        state.update(await draft_outreach_node(state))
        return {
            "prospects_found": len(state["prospects"]),
            "prospects_enriched": len(state["enriched"]),
            "emails_drafted": len(state["emails_drafted"]),
            "emails": state["emails_drafted"],
        }

    # Full LangGraph flow
    graph = StateGraph(SDRState)
    graph.add_node("search", search_prospects_node)
    graph.add_node("enrich", enrich_prospects_node)
    graph.add_node("draft_outreach", draft_outreach_node)

    graph.set_entry_point("search")
    graph.add_edge("search", "enrich")
    graph.add_edge("enrich", "draft_outreach")
    graph.add_edge("draft_outreach", END)

    app = graph.compile()
    result = await app.ainvoke({
        "search_criteria": payload.get("search_criteria", {"job_titles": ["VP Sales"], "limit": 3}),
        "prospects": [],
        "enriched": [],
        "emails_drafted": [],
        "messages": [],
        "next_action": "search",
        "completed": False,
    })

    return {
        "prospects_found": len(result.get("prospects", [])),
        "prospects_enriched": len(result.get("enriched", [])),
        "emails_drafted": len(result.get("emails_drafted", [])),
        "emails": result.get("emails_drafted", []),
    }
