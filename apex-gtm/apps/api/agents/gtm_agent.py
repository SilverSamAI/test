"""GTM Strategy Engine — AI-powered go-to-market strategy generation."""

try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False

GTM_STRATEGY_PROMPT = """You are an expert GTM strategist. Based on the following company context, generate a comprehensive go-to-market strategy.

Company Description: {company_description}
Current ICP: {current_icp}
Top Competitors: {competitors}
Target Markets: {target_markets}
Current Channels: {current_channels}

Generate a GTM strategy in JSON format:
{{
  "icp": {{
    "description": "...",
    "firmographics": {{
      "company_size": "...",
      "stage": "...",
      "industries": [...],
      "geography": "..."
    }},
    "psychographics": {{
      "pain_points": [...],
      "buying_triggers": [...],
      "buying_committee": [...]
    }}
  }},
  "positioning": {{
    "headline": "...",
    "subline": "...",
    "differentiators": [...],
    "proof_points": [...]
  }},
  "channels": [
    {{"name": "...", "priority": "high|medium|low", "rationale": "...", "roi_estimate": "..."}}
  ],
  "messaging_by_segment": [
    {{"segment": "...", "message": "...", "tone": "..."}}
  ],
  "competitive_moat": "...",
  "90_day_plan": [
    {{"week": "1-2", "focus": "...", "actions": [...]}}
  ]
}}"""


async def run_gtm_agent(payload: dict) -> dict:
    """Generate a GTM strategy using Claude."""
    if not ANTHROPIC_AVAILABLE:
        return {
            "error": "Anthropic SDK not available",
            "icp": {"description": "Configure Anthropic API key to generate ICP"},
            "positioning": {"headline": "AI-Powered GTM Platform"},
            "channels": [],
        }

    try:
        from core.config import get_settings
        settings = get_settings()
        client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

        response = await client.messages.create(
            model=settings.claude_opus_model,  # Use Opus for strategic work
            max_tokens=2048,
            messages=[{
                "role": "user",
                "content": GTM_STRATEGY_PROMPT.format(
                    company_description=payload.get("company_description", "B2B SaaS company"),
                    current_icp=payload.get("current_icp", "Not defined"),
                    competitors=", ".join(payload.get("top_competitors", [])),
                    target_markets=", ".join(payload.get("target_markets", [])),
                    current_channels=", ".join(payload.get("current_channels", [])),
                ),
            }],
        )

        import json
        text = response.content[0].text
        start = text.find("{")
        end = text.rfind("}") + 1
        return json.loads(text[start:end]) if start != -1 else {"raw": text}

    except Exception as e:
        return {"error": str(e)}
