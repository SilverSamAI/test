"""Marketing AI Agent — content generation, campaign planning, social posts."""

try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False

CONTENT_PROMPTS = {
    "linkedin": """Write a high-performing LinkedIn post about: {topic}

Target persona: {persona}
Tone: {tone}

Rules:
- Start with a bold hook (no "I" or "We" to open)
- Use short paragraphs (1-2 sentences max)
- Include a numbered list or insights
- End with a thought-provoking question or CTA
- No hashtag spam (max 3 relevant hashtags at the end)
- 150-300 words

Write only the post content, no explanation.""",

    "email": """Write a cold outreach email about: {topic}

Target persona: {persona}
Tone: {tone}

Rules:
- Subject line: compelling, under 50 chars
- 3-4 sentence body maximum
- One clear CTA
- No fluff, no generic phrases
- Personalize to the persona

Format as:
Subject: [subject line]

[email body]""",

    "blog": """Write a blog post outline and introduction (first 200 words) about: {topic}

Target persona: {persona}
Tone: {tone}

Include:
1. SEO-optimized title
2. Meta description (155 chars)
3. Full outline (H2s and H3s)
4. Introduction (200 words)""",

    "ad": """Write LinkedIn ad copy for: {topic}

Target persona: {persona}

Include:
- Headline (under 70 chars)
- Introductory text (under 150 chars)
- CTA button text
- Two copy variations (A/B test)""",
}


async def generate_content(content_type: str, topic: str, persona: str = None, tone: str = "professional") -> dict:
    """Generate marketing content using Claude."""
    if not ANTHROPIC_AVAILABLE:
        return {
            "content_type": content_type,
            "title": topic,
            "body": f"[Configure Anthropic API key to generate {content_type} content about: {topic}]",
            "ai_score": 0,
            "suggestions": [],
        }

    prompt_template = CONTENT_PROMPTS.get(content_type, CONTENT_PROMPTS["linkedin"])
    prompt = prompt_template.format(
        topic=topic,
        persona=persona or "B2B SaaS VP Sales",
        tone=tone,
    )

    try:
        from core.config import get_settings
        settings = get_settings()
        client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

        response = await client.messages.create(
            model=settings.claude_model,
            max_tokens=800,
            messages=[{"role": "user", "content": prompt}],
        )

        body = response.content[0].text

        # Extract title from content
        lines = body.strip().split("\n")
        title = lines[0].replace("#", "").strip() if lines else topic

        return {
            "content_type": content_type,
            "title": title[:100],
            "body": body,
            "ai_score": 85,
            "suggestions": ["Add specific data points", "Include a customer quote"],
        }

    except Exception as e:
        return {
            "content_type": content_type,
            "title": topic,
            "body": f"Generation failed: {str(e)}",
            "ai_score": 0,
            "suggestions": [],
        }


async def run_marketing_agent(payload: dict) -> dict:
    """Run the Marketing AI agent."""
    content_type = payload.get("content_type", "linkedin")
    topic = payload.get("topic", "")
    persona = payload.get("target_persona")
    tone = payload.get("tone", "professional")

    if not topic:
        return {"error": "Topic is required"}

    result = await generate_content(content_type, topic, persona, tone)
    return result
