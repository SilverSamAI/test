"""Apollo.io API client."""

import httpx
from typing import List, Optional

from core.config import get_settings


class ApolloClient:
    BASE_URL = "https://api.apollo.io/v1"

    def __init__(self):
        self.api_key = get_settings().apollo_api_key
        self.headers = {"Content-Type": "application/json", "Cache-Control": "no-cache"}

    async def search_people(
        self,
        job_titles: List[str] = None,
        industries: List[str] = None,
        company_size_min: Optional[int] = None,
        company_size_max: Optional[int] = None,
        location: Optional[str] = None,
        limit: int = 25,
    ) -> dict:
        """Search for people in Apollo.io database."""
        payload = {
            "api_key": self.api_key,
            "page": 1,
            "per_page": min(limit, 100),
        }

        if job_titles:
            payload["person_titles"] = job_titles
        if industries:
            payload["organization_industry_tag_ids"] = industries
        if location:
            payload["person_locations"] = [location]
        if company_size_min or company_size_max:
            payload["organization_num_employees_ranges"] = [
                f"{company_size_min or 1},{company_size_max or 10000}"
            ]

        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{self.BASE_URL}/mixed_people/search",
                json=payload,
                headers=self.headers,
            )
            if response.status_code == 200:
                data = response.json()
                return {
                    "people": data.get("people", []),
                    "total": data.get("pagination", {}).get("total_entries", 0),
                }
            return {"people": [], "total": 0, "error": response.text}

    async def enrich_contact(self, email: str) -> dict:
        """Enrich a contact by email address."""
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{self.BASE_URL}/people/match",
                json={"api_key": self.api_key, "email": email},
                headers=self.headers,
            )
            if response.status_code == 200:
                return response.json().get("person", {})
            return {"error": response.text}

    async def create_sequence(self, prospect_ids: List[str], sequence_id: str) -> dict:
        """Enroll prospects in an email sequence."""
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{self.BASE_URL}/emailer_campaigns/{sequence_id}/add_contact_ids",
                json={"api_key": self.api_key, "contact_ids": prospect_ids},
                headers=self.headers,
            )
            return response.json()
