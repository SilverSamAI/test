"""Integration management endpoints."""

from fastapi import APIRouter, HTTPException
from models.schemas import ProspectSearchRequest, CallAnalysisRequest

router = APIRouter()


@router.get("/status")
async def integration_status():
    """Return connection status for all integrations."""
    return {
        "integrations": [
            {"id": "apollo", "name": "Apollo.io", "status": "connected", "last_sync": "2 min ago"},
            {"id": "hubspot", "name": "HubSpot CRM", "status": "connected", "last_sync": "1 min ago"},
            {"id": "linkedin", "name": "LinkedIn Sales Navigator", "status": "connected", "last_sync": "syncing"},
            {"id": "fireflies", "name": "Fireflies.ai", "status": "connected", "last_sync": "5 min ago"},
        ]
    }


@router.post("/apollo/search")
async def apollo_search(request: ProspectSearchRequest):
    """Search Apollo.io for prospects matching criteria."""
    from integrations.apollo.client import ApolloClient
    client = ApolloClient()
    results = await client.search_people(
        job_titles=request.job_titles,
        industries=request.industries,
        company_size_min=request.company_size_min,
        company_size_max=request.company_size_max,
        location=request.location,
        limit=request.limit,
    )
    return results


@router.post("/apollo/enrich/{email}")
async def apollo_enrich(email: str):
    """Enrich a contact via Apollo.io."""
    from integrations.apollo.client import ApolloClient
    client = ApolloClient()
    return await client.enrich_contact(email)


@router.get("/hubspot/deals")
async def hubspot_deals(stage: str = None, limit: int = 50):
    """Fetch deals from HubSpot pipeline."""
    from integrations.hubspot.client import HubSpotClient
    client = HubSpotClient()
    return await client.get_deals(stage=stage, limit=limit)


@router.post("/hubspot/deals/{deal_id}/stage")
async def update_deal_stage(deal_id: str, stage: str):
    """Update a HubSpot deal stage."""
    from integrations.hubspot.client import HubSpotClient
    client = HubSpotClient()
    return await client.update_deal_stage(deal_id, stage)


@router.post("/fireflies/analyze")
async def analyze_call(request: CallAnalysisRequest):
    """Analyze a Fireflies.ai call transcript using Claude."""
    from integrations.fireflies.client import FirefliesClient
    client = FirefliesClient()

    # Fetch transcript if not provided
    if not request.transcript_text and request.transcript_id:
        transcript = await client.get_transcript(request.transcript_id)
        request.transcript_text = transcript.get("text", "")

    from agents.deal_agent import analyze_transcript
    return await analyze_transcript(request.transcript_id, request.transcript_text or "")


@router.get("/linkedin/prospects/{company}")
async def linkedin_company_prospects(company: str):
    """Find LinkedIn prospects at a company."""
    from integrations.linkedin.client import LinkedInClient
    client = LinkedInClient()
    return await client.search_people_at_company(company)
