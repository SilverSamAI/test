"""Fireflies.ai API client."""

import httpx
from core.config import get_settings

FIREFLIES_GQL = "https://api.fireflies.ai/graphql"

GET_TRANSCRIPT_QUERY = """
query GetTranscript($transcriptId: String!) {
  transcript(id: $transcriptId) {
    id
    title
    date
    duration
    summary {
      keywords
      action_items
      overview
      shorthand_bullet
      bullet_gist
      gist
      short_summary
    }
    sentences {
      index
      speaker_name
      speaker_id
      start_time
      end_time
      text
    }
  }
}
"""

LIST_TRANSCRIPTS_QUERY = """
query ListTranscripts($limit: Int, $skip: Int) {
  transcripts(limit: $limit, skip: $skip) {
    id
    title
    date
    duration
    summary {
      overview
    }
    organizer_email
    participants
  }
}
"""


class FirefliesClient:
    def __init__(self):
        self.api_key = get_settings().fireflies_api_key
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    async def get_transcript(self, transcript_id: str) -> dict:
        """Fetch a transcript by ID from Fireflies."""
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                FIREFLIES_GQL,
                json={"query": GET_TRANSCRIPT_QUERY, "variables": {"transcriptId": transcript_id}},
                headers=self.headers,
            )
            if response.status_code == 200:
                data = response.json()
                transcript = data.get("data", {}).get("transcript", {})

                # Combine sentences into full text
                sentences = transcript.get("sentences", [])
                full_text = "\n".join(
                    f"{s.get('speaker_name', 'Unknown')}: {s.get('text', '')}"
                    for s in sentences
                )
                return {
                    **transcript,
                    "text": full_text,
                    "built_in_summary": transcript.get("summary", {}),
                }
            return {"error": response.text, "text": ""}

    async def list_transcripts(self, limit: int = 10, skip: int = 0) -> dict:
        """List recent transcripts."""
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                FIREFLIES_GQL,
                json={"query": LIST_TRANSCRIPTS_QUERY, "variables": {"limit": limit, "skip": skip}},
                headers=self.headers,
            )
            if response.status_code == 200:
                return response.json().get("data", {}).get("transcripts", [])
            return []
