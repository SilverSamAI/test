"""Pipeline and deal management endpoints."""

from fastapi import APIRouter
from models.schemas import Deal

router = APIRouter()


@router.get("/")
async def get_pipeline():
    """Return full pipeline with AI scoring."""
    return {
        "deals": [
            {
                "id": "1", "company": "Stripe", "contact": "Sarah Chen", "value": 120000,
                "stage": "proposal", "probability": 70, "ai_score": 94,
                "close_date": "Apr 15", "ai_insight": "High intent: viewed pricing 4x this week",
            },
            {
                "id": "2", "company": "Acme Corp", "contact": "James Parker", "value": 84000,
                "stage": "negotiation", "probability": 85, "ai_score": 88,
                "close_date": "Mar 31", "ai_insight": "At risk: no response in 5 days",
            },
        ],
        "summary": {
            "total_value": 2400000,
            "weighted_forecast": 1100000,
            "deals_count": 8,
            "avg_deal_size": 98000,
        },
    }


@router.get("/forecast")
async def get_forecast():
    """AI-powered revenue forecast."""
    return {
        "current_quarter": {"target": 500000, "committed": 320000, "best_case": 480000},
        "next_quarter": {"projected": 620000, "confidence": 0.74},
        "monthly": [
            {"month": "Apr", "projected": 180000, "committed": 140000},
            {"month": "May", "projected": 210000, "committed": 100000},
            {"month": "Jun", "projected": 230000, "committed": 80000},
        ],
    }


@router.post("/{deal_id}/score")
async def score_deal(deal_id: str):
    """Re-score a deal using AI based on latest signals."""
    return {
        "deal_id": deal_id,
        "score": 87,
        "signals": [
            {"type": "engagement", "description": "Opened last 3 emails", "weight": 0.3},
            {"type": "intent", "description": "Visited pricing page twice", "weight": 0.4},
            {"type": "firmographic", "description": "Strong ICP match", "weight": 0.3},
        ],
        "recommendation": "High priority — schedule follow-up call within 24h",
    }
