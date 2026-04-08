"""Analytics and reporting endpoints."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/dashboard")
async def dashboard_metrics():
    return {
        "pipeline_value": 2400000,
        "pipeline_change": 0.182,
        "active_prospects": 1240,
        "prospects_added_today": 124,
        "active_sequences": 47,
        "email_open_rate": 0.68,
        "meetings_booked": 18,
        "meetings_this_week": 3,
        "agent_runs_today": 303,
        "agent_success_rate": 0.944,
    }


@router.get("/pipeline-trend")
async def pipeline_trend():
    return {
        "data": [
            {"month": "Oct", "pipeline": 280000, "closed": 120000},
            {"month": "Nov", "pipeline": 340000, "closed": 180000},
            {"month": "Dec", "pipeline": 290000, "closed": 160000},
            {"month": "Jan", "pipeline": 420000, "closed": 210000},
            {"month": "Feb", "pipeline": 510000, "closed": 280000},
            {"month": "Mar", "pipeline": 680000, "closed": 340000},
        ]
    }


@router.get("/conversion-funnel")
async def conversion_funnel():
    return {
        "stages": [
            {"stage": "Prospects", "count": 1240},
            {"stage": "Contacted", "count": 680},
            {"stage": "Qualified", "count": 290},
            {"stage": "Demo", "count": 142},
            {"stage": "Proposal", "count": 68},
            {"stage": "Closed", "count": 31},
        ]
    }


@router.get("/agent-activity")
async def agent_activity():
    return {
        "today": {
            "sdr": {"runs": 234, "success_rate": 0.94, "leads_enriched": 47, "emails_sent": 89},
            "deal": {"runs": 18, "success_rate": 0.98, "calls_analyzed": 12, "deals_updated": 8},
            "gtm": {"runs": 4, "success_rate": 1.0, "strategies_generated": 2},
            "marketing": {"runs": 47, "success_rate": 0.91, "content_pieces": 12},
        }
    }
