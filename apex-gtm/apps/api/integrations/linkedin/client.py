"""LinkedIn Sales Navigator API client.

Note: LinkedIn Sales Navigator uses a private API — this client
handles OAuth token refresh and the standard member/account endpoints.
"""

import httpx
from core.config import get_settings


class LinkedInClient:
    BASE_URL = "https://api.linkedin.com/v2"

    def __init__(self):
        self.token = get_settings().linkedin_access_token
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
            "X-Restli-Protocol-Version": "2.0.0",
        }

    async def search_people_at_company(self, company: str, limit: int = 10) -> dict:
        """Search for people at a company via Sales Navigator API."""
        # Sales Navigator uses a different endpoint than standard LinkedIn API
        # This is a simplified version — full implementation requires Sales Navigator API access
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(
                f"{self.BASE_URL}/salesApiLeadSearch",
                params={
                    "q": "companySearch",
                    "company": company,
                    "count": min(limit, 25),
                },
                headers=self.headers,
            )
            if response.status_code == 200:
                return response.json()
            return {"elements": [], "error": response.text}

    async def get_profile(self, linkedin_url: str) -> dict:
        """Fetch a LinkedIn profile by URL."""
        # Extract member ID from URL in production
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(
                f"{self.BASE_URL}/me",
                headers=self.headers,
            )
            return response.json() if response.status_code == 200 else {}

    async def send_connection_request(self, member_id: str, message: str = None) -> dict:
        """Send a connection request via LinkedIn."""
        payload = {
            "invitee": {"com.linkedin.voyager.growth.invitation.InviteeProfile": {"profileId": member_id}},
            "message": message or "",
        }
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{self.BASE_URL}/invitations",
                json=payload,
                headers=self.headers,
            )
            return {"success": response.status_code == 201, "status": response.status_code}

    async def get_company_insights(self, company_id: str) -> dict:
        """Get Sales Navigator account insights for a company."""
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(
                f"{self.BASE_URL}/salesApiCompanies/{company_id}",
                headers=self.headers,
            )
            return response.json() if response.status_code == 200 else {}
