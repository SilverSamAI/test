"""Agent execution endpoints."""

import uuid
from fastapi import APIRouter, BackgroundTasks, HTTPException
from models.schemas import AgentRunRequest, AgentRunResponse, AgentStatus

router = APIRouter()

# In-memory run tracking (replace with Supabase in production)
_runs: dict[str, dict] = {}


@router.get("/")
async def list_agents():
    return {
        "agents": [
            {
                "id": "sdr",
                "name": "SDR Agent",
                "description": "Autonomous prospecting, lead enrichment, and personalized multi-channel outreach",
                "status": "active",
                "capabilities": ["prospecting", "enrichment", "email_sequences", "linkedin_outreach"],
            },
            {
                "id": "deal",
                "name": "Deal Intelligence",
                "description": "Analyzes sales calls, extracts insights, updates CRM, and surfaces next-best-actions",
                "status": "active",
                "capabilities": ["call_analysis", "objection_detection", "next_steps", "hubspot_sync"],
            },
            {
                "id": "gtm",
                "name": "GTM Strategy Engine",
                "description": "Generates go-to-market strategies, refines ICP, creates positioning",
                "status": "idle",
                "capabilities": ["icp_definition", "positioning", "channel_strategy", "competitive_analysis"],
            },
            {
                "id": "marketing",
                "name": "Marketing AI",
                "description": "Creates content, plans campaigns, writes LinkedIn posts",
                "status": "active",
                "capabilities": ["linkedin_content", "email_campaigns", "ad_copy", "blog_posts"],
            },
        ]
    }


@router.post("/{agent_id}/run", response_model=AgentRunResponse)
async def run_agent(agent_id: str, request: AgentRunRequest, background_tasks: BackgroundTasks):
    valid_agents = {"sdr", "deal", "gtm", "marketing"}
    if agent_id not in valid_agents:
        raise HTTPException(status_code=404, detail=f"Agent '{agent_id}' not found")

    run_id = str(uuid.uuid4())
    _runs[run_id] = {"agent_id": agent_id, "status": "running", "payload": request.payload}

    background_tasks.add_task(_execute_agent, run_id, agent_id, request.payload)

    return AgentRunResponse(
        run_id=run_id,
        agent_id=agent_id,
        status=AgentStatus.RUNNING,
        message=f"Agent '{agent_id}' started. Track via /api/agents/runs/{run_id}",
    )


@router.get("/runs/{run_id}")
async def get_run_status(run_id: str):
    if run_id not in _runs:
        raise HTTPException(status_code=404, detail="Run not found")
    return _runs[run_id]


async def _execute_agent(run_id: str, agent_id: str, payload: dict):
    """Dispatch to the appropriate LangGraph agent."""
    try:
        if agent_id == "sdr":
            from agents.sdr_agent import run_sdr_agent
            result = await run_sdr_agent(payload)
        elif agent_id == "deal":
            from agents.deal_agent import run_deal_agent
            result = await run_deal_agent(payload)
        elif agent_id == "gtm":
            from agents.gtm_agent import run_gtm_agent
            result = await run_gtm_agent(payload)
        elif agent_id == "marketing":
            from agents.marketing_agent import run_marketing_agent
            result = await run_marketing_agent(payload)
        else:
            result = {"error": "Unknown agent"}

        _runs[run_id]["status"] = "completed"
        _runs[run_id]["result"] = result
    except Exception as e:
        _runs[run_id]["status"] = "error"
        _runs[run_id]["error"] = str(e)
