"""
Center API client for expense management.
API docs: https://developer.getcenter.com/docs/getting-started
"""

import os
import time
import requests
from typing import Optional
from dataclasses import dataclass, field


@dataclass
class Expense:
    id: str
    merchant_name: str
    amount: float
    currency: str
    date: str
    status: str
    category: Optional[str] = None
    gl_code: Optional[str] = None
    notes: Optional[str] = None
    receipt_ids: list = field(default_factory=list)
    raw: dict = field(default_factory=dict)


@dataclass
class Receipt:
    id: str
    url: Optional[str] = None
    expense_id: Optional[str] = None
    raw: dict = field(default_factory=dict)


class CenterAPIError(Exception):
    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        super().__init__(f"Center API error {status_code}: {message}")


class CenterClient:
    def __init__(
        self,
        api_key: Optional[str] = None,
        api_version: Optional[str] = None,
        base_url: Optional[str] = None,
    ):
        self.api_key = api_key or os.environ["CENTER_API_KEY"]
        self.api_version = api_version or os.getenv("CENTER_API_VERSION", "2024-01-01")
        self.base_url = (base_url or os.getenv("CENTER_BASE_URL", "https://api.getcenter.com")).rstrip("/")
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {self.api_key}",
            "Center-Version": self.api_version,
            "Content-Type": "application/json",
            "Accept": "application/json",
        })

    def _request(self, method: str, path: str, **kwargs) -> dict:
        url = f"{self.base_url}{path}"
        resp = self.session.request(method, url, **kwargs)
        if not resp.ok:
            try:
                detail = resp.json().get("message", resp.text)
            except Exception:
                detail = resp.text
            raise CenterAPIError(resp.status_code, detail)
        return resp.json() if resp.content else {}

    # ── Expenses ──────────────────────────────────────────────────────────────

    def list_expenses(self, status: Optional[str] = None, limit: int = 100) -> list[Expense]:
        params = {"limit": limit}
        if status:
            params["status"] = status
        data = self._request("GET", "/expenses/", params=params)
        expenses = []
        for item in data.get("data", data if isinstance(data, list) else []):
            expenses.append(self._parse_expense(item))
        return expenses

    def get_expense(self, expense_id: str) -> Expense:
        data = self._request("GET", f"/expenses/{expense_id}")
        return self._parse_expense(data)

    def update_expense(
        self,
        expense_id: str,
        category: Optional[str] = None,
        gl_code: Optional[str] = None,
        notes: Optional[str] = None,
    ) -> Expense:
        payload: dict = {}
        if category is not None:
            payload["category"] = category
        if gl_code is not None:
            payload["gl_code"] = gl_code
        if notes is not None:
            payload["notes"] = notes
        data = self._request("PATCH", f"/expenses/{expense_id}", json=payload)
        return self._parse_expense(data)

    def submit_expense(self, expense_id: str) -> Expense:
        """Submit an expense for approval."""
        data = self._request("POST", f"/expenses/{expense_id}/submit")
        return self._parse_expense(data)

    def create_expense(
        self,
        merchant_name: str,
        amount: float,
        currency: str,
        date: str,
        category: Optional[str] = None,
        notes: Optional[str] = None,
    ) -> Expense:
        payload = {
            "merchant_name": merchant_name,
            "amount": amount,
            "currency": currency,
            "date": date,
        }
        if category:
            payload["category"] = category
        if notes:
            payload["notes"] = notes
        data = self._request("POST", "/expenses/", json=payload)
        return self._parse_expense(data)

    # ── Receipts ──────────────────────────────────────────────────────────────

    def list_receipts(self, limit: int = 100) -> list[Receipt]:
        data = self._request("GET", "/receipts/", params={"limit": limit})
        receipts = []
        for item in data.get("data", data if isinstance(data, list) else []):
            receipts.append(self._parse_receipt(item))
        return receipts

    def attach_receipt(self, expense_id: str, receipt_id: str) -> dict:
        return self._request("POST", f"/expenses/{expense_id}/receipts", json={"receipt_id": receipt_id})

    def upload_receipt(self, file_path: str) -> Receipt:
        """Upload a receipt image and return the created receipt object."""
        with open(file_path, "rb") as f:
            files = {"file": f}
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Center-Version": self.api_version,
            }
            resp = requests.post(f"{self.base_url}/receipts/", headers=headers, files=files)
        if not resp.ok:
            raise CenterAPIError(resp.status_code, resp.text)
        return self._parse_receipt(resp.json())

    # ── Cards ─────────────────────────────────────────────────────────────────

    def list_cards(self) -> list[dict]:
        data = self._request("GET", "/cards/")
        return data.get("data", data if isinstance(data, list) else [])

    # ── Policies ──────────────────────────────────────────────────────────────

    def get_policy_rule(self, rule_id: str) -> dict:
        return self._request("GET", f"/policies/rules/{rule_id}")

    # ── Helpers ───────────────────────────────────────────────────────────────

    @staticmethod
    def _parse_expense(item: dict) -> Expense:
        return Expense(
            id=item.get("id", ""),
            merchant_name=item.get("merchant_name", item.get("merchant", {}).get("name", "Unknown")),
            amount=float(item.get("amount", 0)),
            currency=item.get("currency", "USD"),
            date=item.get("date", item.get("transaction_date", "")),
            status=item.get("status", ""),
            category=item.get("category"),
            gl_code=item.get("gl_code"),
            notes=item.get("notes"),
            receipt_ids=item.get("receipt_ids", []),
            raw=item,
        )

    @staticmethod
    def _parse_receipt(item: dict) -> Receipt:
        return Receipt(
            id=item.get("id", ""),
            url=item.get("url"),
            expense_id=item.get("expense_id"),
            raw=item,
        )
