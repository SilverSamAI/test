"""Pydantic schemas for APEX GTM API."""

from pydantic import BaseModel, Field
from typing import Optional, List, Any
from enum import Enum


class AgentStatus(str, Enum):
    IDLE = "idle"
    RUNNING = "running"
    COMPLETED = "completed"
    ERROR = "error"


class AgentRunRequest(BaseModel):
    agent_id: str
    payload: dict = Field(default_factory=dict)
    dry_run: bool = False


class AgentRunResponse(BaseModel):
    run_id: str
    agent_id: str
    status: AgentStatus
    message: str
    result: Optional[dict] = None


class ProspectSearchRequest(BaseModel):
    job_titles: List[str] = []
    industries: List[str] = []
    company_size_min: Optional[int] = None
    company_size_max: Optional[int] = None
    location: Optional[str] = None
    keywords: List[str] = []
    limit: int = Field(default=25, le=100)


class Prospect(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    title: str
    company: str
    linkedin_url: Optional[str] = None
    icp_score: Optional[float] = None
    enriched: bool = False


class Deal(BaseModel):
    id: str
    name: str
    company: str
    contact_name: str
    value: float
    stage: str
    probability: int
    close_date: Optional[str] = None
    hubspot_deal_id: Optional[str] = None


class CallAnalysisRequest(BaseModel):
    transcript_id: str
    transcript_text: Optional[str] = None
    meeting_name: Optional[str] = None
    participants: List[str] = []


class CallAnalysisResult(BaseModel):
    transcript_id: str
    summary: str
    action_items: List[str]
    objections: List[str]
    next_steps: List[str]
    sentiment: str
    deal_stage_recommendation: Optional[str] = None


class GTMStrategyRequest(BaseModel):
    company_description: str
    current_icp: Optional[str] = None
    top_competitors: List[str] = []
    target_markets: List[str] = []
    current_channels: List[str] = []


class ContentGenerationRequest(BaseModel):
    content_type: str  # linkedin, email, blog, ad
    topic: str
    target_persona: Optional[str] = None
    tone: Optional[str] = None
    length: Optional[str] = "medium"
    icp_context: Optional[str] = None


class ContentGenerationResult(BaseModel):
    content_type: str
    title: str
    body: str
    ai_score: int
    suggestions: List[str] = []
