"""HubSpot CRM API client."""

import httpx
from typing import Optional

from core.config import get_settings


class HubSpotClient:
    BASE_URL = "https://api.hubapi.com"

    def __init__(self):
        self.token = get_settings().hubspot_access_token
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }

    async def get_deals(self, stage: Optional[str] = None, limit: int = 50) -> dict:
        """Fetch deals from HubSpot pipeline."""
        params = {
            "limit": min(limit, 100),
            "properties": "dealname,amount,dealstage,closedate,hs_deal_stage_probability,hubspot_owner_id",
            "associations": "contacts",
        }
        if stage:
            params["filterGroups"] = [{"filters": [{"propertyName": "dealstage", "operator": "EQ", "value": stage}]}]

        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(
                f"{self.BASE_URL}/crm/v3/objects/deals",
                params=params,
                headers=self.headers,
            )
            if response.status_code == 200:
                return response.json()
            return {"results": [], "error": response.text}

    async def update_deal_stage(self, deal_id: str, stage: str) -> dict:
        """Update a deal's pipeline stage."""
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.patch(
                f"{self.BASE_URL}/crm/v3/objects/deals/{deal_id}",
                json={"properties": {"dealstage": stage}},
                headers=self.headers,
            )
            return response.json() if response.status_code == 200 else {"error": response.text}

    async def create_contact(self, email: str, first_name: str, last_name: str, company: str = None) -> dict:
        """Create a new contact in HubSpot."""
        props = {"email": email, "firstname": first_name, "lastname": last_name}
        if company:
            props["company"] = company

        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{self.BASE_URL}/crm/v3/objects/contacts",
                json={"properties": props},
                headers=self.headers,
            )
            return response.json() if response.status_code in (200, 201) else {"error": response.text}

    async def log_activity(self, deal_id: str, activity_type: str, note: str) -> dict:
        """Log a call/email activity on a deal."""
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{self.BASE_URL}/crm/v3/objects/notes",
                json={
                    "properties": {
                        "hs_note_body": note,
                        "hs_timestamp": "now",
                    },
                    "associations": [{
                        "to": {"id": deal_id},
                        "types": [{"associationCategory": "HUBSPOT_DEFINED", "associationTypeId": 214}],
                    }],
                },
                headers=self.headers,
            )
            return response.json() if response.status_code in (200, 201) else {"error": response.text}

    async def get_contact(self, email: str) -> dict:
        """Lookup a contact by email."""
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{self.BASE_URL}/crm/v3/objects/contacts/search",
                json={
                    "filterGroups": [{"filters": [{"propertyName": "email", "operator": "EQ", "value": email}]}],
                    "properties": ["email", "firstname", "lastname", "company", "jobtitle"],
                    "limit": 1,
                },
                headers=self.headers,
            )
            data = response.json() if response.status_code == 200 else {}
            results = data.get("results", [])
            return results[0] if results else {}
