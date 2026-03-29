"""Deal Intelligence Agent — call analysis, CRM updates, next-step suggestions."""

from typing import TypedDict, Annotated, List, Optional
import operator

try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False


ANALYZE_PROMPT = """You are an expert sales intelligence AI. Analyze this sales call transcript and extract:

1. **Summary** (2-3 sentences)
2. **Action Items** (bulleted list — concrete next steps for the seller)
3. **Objections Raised** (exact objections the prospect raised)
4. **Next Steps** (what was agreed on by both sides)
5. **Sentiment** (positive/neutral/negative + brief rationale)
6. **Deal Stage Recommendation** (should the deal advance, stay, or retreat? why?)

Transcript:
{transcript}

Respond in JSON format:
{{
  "summary": "...",
  "action_items": ["...", "..."],
  "objections": ["...", "..."],
  "next_steps": ["...", "..."],
  "sentiment": "positive|neutral|negative",
  "sentiment_rationale": "...",
  "deal_stage_recommendation": "advance|hold|retreat",
  "deal_stage_reason": "..."
}}"""


async def analyze_transcript(transcript_id: str, transcript_text: str) -> dict:
    """Analyze a call transcript using Claude."""
    if not transcript_text:
        return {"error": "No transcript text provided"}

    if not ANTHROPIC_AVAILABLE:
        return {
            "transcript_id": transcript_id,
            "summary": "Call analysis unavailable — Anthropic SDK not installed",
            "action_items": ["Install anthropic package"],
            "objections": [],
            "next_steps": [],
            "sentiment": "neutral",
            "deal_stage_recommendation": "hold",
        }

    try:
        from core.config import get_settings
        settings = get_settings()
        client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

        response = await client.messages.create(
            model=settings.claude_model,
            max_tokens=1024,
            messages=[{
                "role": "user",
                "content": ANALYZE_PROMPT.format(transcript=transcript_text[:8000]),
            }],
        )

        import json
        text = response.content[0].text
        # Extract JSON from response
        start = text.find("{")
        end = text.rfind("}") + 1
        result = json.loads(text[start:end]) if start != -1 else {}
        return {"transcript_id": transcript_id, **result}

    except Exception as e:
        return {
            "transcript_id": transcript_id,
            "error": str(e),
            "summary": "Analysis failed",
            "action_items": [],
            "objections": [],
            "next_steps": [],
            "sentiment": "neutral",
            "deal_stage_recommendation": "hold",
        }


async def run_deal_agent(payload: dict) -> dict:
    """Run the Deal Intelligence agent."""
    transcript_id = payload.get("transcript_id", "unknown")
    transcript_text = payload.get("transcript_text", "")

    if not transcript_text:
        # Fetch from Fireflies if not provided
        try:
            from integrations.fireflies.client import FirefliesClient
            client = FirefliesClient()
            data = await client.get_transcript(transcript_id)
            transcript_text = data.get("text", "")
        except Exception:
            transcript_text = ""

    analysis = await analyze_transcript(transcript_id, transcript_text)

    # Push to HubSpot if deal_id provided
    if payload.get("hubspot_deal_id") and analysis.get("deal_stage_recommendation") == "advance":
        try:
            from integrations.hubspot.client import HubSpotClient
            hs = HubSpotClient()
            await hs.log_activity(
                deal_id=payload["hubspot_deal_id"],
                activity_type="call",
                note=analysis.get("summary", ""),
            )
        except Exception:
            pass

    return analysis
