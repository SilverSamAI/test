"""
Autonomous expense processor: fetches pending expenses, categorizes them with
Claude AI, attaches unmatched receipts, and optionally submits for approval.
"""

import os
import json
from typing import Optional
from dataclasses import dataclass

import anthropic

from .center_client import CenterClient, Expense, CenterAPIError


# ── GL code config ────────────────────────────────────────────────────────────

def _load_gl_map() -> dict[str, str]:
    """Parse GL_CODE_MAP env var: 'travel:6010,meals:6020,...'"""
    raw = os.getenv("GL_CODE_MAP", "travel:6010,meals:6020,software:6030,office:6040,other:6099")
    gl_map = {}
    for pair in raw.split(","):
        pair = pair.strip()
        if ":" in pair:
            cat, code = pair.split(":", 1)
            gl_map[cat.strip().lower()] = code.strip()
    return gl_map


KNOWN_CATEGORIES = ["travel", "meals", "software", "office", "other"]


# ── Categorization result ─────────────────────────────────────────────────────

@dataclass
class CategorizationResult:
    expense_id: str
    merchant_name: str
    amount: float
    category: str
    gl_code: str
    notes: str
    confidence: str  # high | medium | low
    reasoning: str


# ── Processor ─────────────────────────────────────────────────────────────────

class ExpenseProcessor:
    def __init__(
        self,
        center_client: Optional[CenterClient] = None,
        anthropic_client: Optional[anthropic.Anthropic] = None,
        auto_submit: bool = False,
        gl_map: Optional[dict[str, str]] = None,
    ):
        self.center = center_client or CenterClient()
        self.ai = anthropic_client or anthropic.Anthropic()
        self.auto_submit = auto_submit or os.getenv("AUTO_SUBMIT", "false").lower() == "true"
        self.gl_map = gl_map or _load_gl_map()

    # ── Public entry point ────────────────────────────────────────────────────

    def run_once(self, console=None) -> dict:
        """
        Fetch pending expenses, categorize them, attach loose receipts,
        optionally submit. Returns a summary dict.
        """
        log = console.log if console else print

        log("[bold]Fetching pending expenses from Center...[/bold]" if console else "Fetching pending expenses from Center...")
        expenses = self._get_pending_expenses()
        log(f"Found {len(expenses)} expense(s) to process.")

        # Fetch unmatched receipts once so we can pair them up
        try:
            all_receipts = self.center.list_receipts()
            unmatched_receipts = [r for r in all_receipts if not r.expense_id]
        except CenterAPIError:
            unmatched_receipts = []

        results = {
            "processed": 0,
            "submitted": 0,
            "skipped": 0,
            "errors": 0,
            "details": [],
        }

        for expense in expenses:
            try:
                detail = self._process_expense(expense, unmatched_receipts, log, console)
                results["details"].append(detail)
                results["processed"] += 1
                if detail.get("submitted"):
                    results["submitted"] += 1
            except CenterAPIError as e:
                log(f"[red]API error on expense {expense.id}: {e}[/red]" if console else f"API error on {expense.id}: {e}")
                results["errors"] += 1
            except Exception as e:
                log(f"[red]Unexpected error on expense {expense.id}: {e}[/red]" if console else f"Error on {expense.id}: {e}")
                results["errors"] += 1

        return results

    # ── Core per-expense flow ─────────────────────────────────────────────────

    def _process_expense(self, expense: Expense, unmatched_receipts: list, log, console) -> dict:
        currency_str = f"{expense.currency} {expense.amount:.2f}"
        log(f"  Processing: {expense.merchant_name} {currency_str} ({expense.date})")

        # 1. Categorize with AI
        categorization = self._categorize_expense(expense)
        log(f"    → Category: {categorization.category} | GL: {categorization.gl_code} | Confidence: {categorization.confidence}")

        # 2. Update expense metadata in Center
        self.center.update_expense(
            expense.id,
            category=categorization.category,
            gl_code=categorization.gl_code,
            notes=categorization.notes,
        )

        # 3. Attach a loose receipt if one exists and expense has none
        receipt_attached = False
        if not expense.receipt_ids and unmatched_receipts:
            receipt = unmatched_receipts.pop(0)
            try:
                self.center.attach_receipt(expense.id, receipt.id)
                receipt_attached = True
                log(f"    → Attached receipt {receipt.id}")
            except CenterAPIError as e:
                log(f"    [yellow]Could not attach receipt: {e}[/yellow]" if console else f"    Could not attach receipt: {e}")

        # 4. Submit for approval if configured
        submitted = False
        if self.auto_submit:
            self.center.submit_expense(expense.id)
            submitted = True
            log(f"    → Submitted for approval")

        return {
            "expense_id": expense.id,
            "merchant": expense.merchant_name,
            "amount": expense.amount,
            "category": categorization.category,
            "gl_code": categorization.gl_code,
            "confidence": categorization.confidence,
            "receipt_attached": receipt_attached,
            "submitted": submitted,
            "notes": categorization.notes,
        }

    # ── AI categorization ─────────────────────────────────────────────────────

    def _categorize_expense(self, expense: Expense) -> CategorizationResult:
        categories_list = ", ".join(KNOWN_CATEGORIES)
        gl_map_str = json.dumps(self.gl_map, indent=2)

        prompt = f"""You are an autonomous corporate expense categorization assistant.

Given the expense details below, choose the best category and GL code from the provided mapping. Return ONLY a JSON object with these exact keys:
- category: one of [{categories_list}]
- gl_code: the matching GL code from the map
- notes: a short (≤ 15 words) business justification note
- confidence: "high", "medium", or "low"
- reasoning: one sentence explaining your choice

GL code map:
{gl_map_str}

Expense:
- Merchant: {expense.merchant_name}
- Amount: {expense.currency} {expense.amount:.2f}
- Date: {expense.date}
- Existing category: {expense.category or "none"}
- Existing notes: {expense.notes or "none"}

Respond with ONLY the JSON object, no markdown fences."""

        message = self.ai.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=256,
            system=(
                "You are a precise expense categorization engine. "
                "Always respond with valid JSON only."
            ),
            messages=[{"role": "user", "content": prompt}],
        )

        raw = message.content[0].text.strip()
        # Strip markdown fences if model adds them despite instructions
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()

        parsed = json.loads(raw)
        category = parsed.get("category", "other").lower()
        if category not in KNOWN_CATEGORIES:
            category = "other"
        gl_code = parsed.get("gl_code") or self.gl_map.get(category, self.gl_map.get("other", "6099"))

        return CategorizationResult(
            expense_id=expense.id,
            merchant_name=expense.merchant_name,
            amount=expense.amount,
            category=category,
            gl_code=gl_code,
            notes=parsed.get("notes", ""),
            confidence=parsed.get("confidence", "low"),
            reasoning=parsed.get("reasoning", ""),
        )

    # ── Helpers ───────────────────────────────────────────────────────────────

    def _get_pending_expenses(self) -> list[Expense]:
        """Return expenses that need processing (no category or pending status)."""
        try:
            # Try fetching by status first
            expenses = self.center.list_expenses(status="pending")
        except CenterAPIError:
            # Fall back to all expenses and filter client-side
            expenses = self.center.list_expenses()

        return [e for e in expenses if not e.category or e.status in ("pending", "open", "draft")]
