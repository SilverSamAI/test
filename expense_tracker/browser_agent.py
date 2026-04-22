"""
Vision-based autonomous browser agent for Center expense management.

Uses Playwright to control a real Chromium browser and Claude's vision API
to understand the UI from screenshots — no Center API key required, just
your regular Center login credentials.

Flow:
  login → navigate to expenses → screenshot each expense → Claude decides
  what to fill in → agent types/clicks → submits → repeat
"""

import os
import base64
import json
import time
from pathlib import Path
from typing import Optional

import anthropic
from playwright.sync_api import sync_playwright, Page, Browser

CENTER_URL = "https://app.getcenter.com"


# ── Vision helpers ─────────────────────────────────────────────────────────────

def screenshot_b64(page: Page) -> str:
    """Capture current page as base64 PNG for Claude vision."""
    data = page.screenshot(type="png")
    return base64.standard_b64encode(data).decode()


def ask_claude_vision(client: anthropic.Anthropic, b64_image: str, question: str) -> str:
    """Send a screenshot to Claude and get a text answer."""
    msg = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/png",
                        "data": b64_image,
                    },
                },
                {"type": "text", "text": question},
            ],
        }],
    )
    return msg.content[0].text.strip()


def ask_claude_for_action(client: anthropic.Anthropic, b64_image: str, context: str) -> dict:
    """
    Given a screenshot and context, ask Claude what browser action to take next.
    Returns a dict like:
      {"action": "click", "selector": "...", "description": "..."}
      {"action": "type",  "selector": "...", "text": "...", "description": "..."}
      {"action": "select","selector": "...", "value": "...", "description": "..."}
      {"action": "wait",  "ms": 1000, "description": "..."}
      {"action": "done",  "description": "..."}
    """
    prompt = f"""You are controlling a browser to file expenses in the Center corporate expense management app.

Current context:
{context}

Look at the screenshot and decide the SINGLE next action to take.
Respond with ONLY a JSON object (no markdown fences) with these fields:
- action: one of "click", "type", "select", "scroll", "wait", "done"
- selector: CSS selector or text selector (for click/type/select actions)
- text: text to type (for type action)
- value: option value (for select action)
- ms: milliseconds to wait (for wait action)
- description: one short sentence describing what you're doing and why

Use text selectors like 'text=Save' or 'text=Submit' when CSS selectors aren't obvious.
If the task is complete, return {{"action": "done", "description": "All expenses processed."}}.
If you need to wait for a page to load, return {{"action": "wait", "ms": 2000, "description": "Waiting for page load."}}.
"""
    msg = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=512,
        messages=[{
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {"type": "base64", "media_type": "image/png", "data": b64_image},
                },
                {"type": "text", "text": prompt},
            ],
        }],
    )
    raw = msg.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()
    return json.loads(raw)


# ── Browser action executor ────────────────────────────────────────────────────

def execute_action(page: Page, action: dict, log) -> bool:
    """Execute a Claude-decided browser action. Returns False if done."""
    kind = action.get("action")
    desc = action.get("description", "")
    log(f"    [{kind}] {desc}")

    if kind == "done":
        return False

    if kind == "wait":
        page.wait_for_timeout(action.get("ms", 1000))

    elif kind == "click":
        sel = action["selector"]
        try:
            page.click(sel, timeout=5000)
        except Exception:
            # Try by text if selector fails
            page.get_by_text(sel).first.click()

    elif kind == "type":
        sel = action["selector"]
        text = action.get("text", "")
        try:
            page.fill(sel, text, timeout=5000)
        except Exception:
            page.get_by_label(sel).fill(text)

    elif kind == "select":
        sel = action["selector"]
        val = action.get("value", "")
        page.select_option(sel, val)

    elif kind == "scroll":
        page.evaluate("window.scrollBy(0, 400)")

    page.wait_for_timeout(800)  # small pause after each action
    return True


# ── Login flow ─────────────────────────────────────────────────────────────────

def login(page: Page, client: anthropic.Anthropic, email: str, password: str, log):
    log("Opening Center login page...")
    page.goto(f"{CENTER_URL}/login", wait_until="domcontentloaded")
    page.wait_for_timeout(2000)

    # Fill email
    try:
        page.fill('input[type="email"]', email, timeout=5000)
    except Exception:
        page.fill('input[name="email"]', email)

    # Fill password
    try:
        page.fill('input[type="password"]', password, timeout=5000)
    except Exception:
        page.fill('input[name="password"]', password)

    page.wait_for_timeout(500)

    # Click sign in — try common selectors, fall back to vision
    try:
        page.click('button[type="submit"]', timeout=3000)
    except Exception:
        img = screenshot_b64(page)
        action = ask_claude_for_action(client, img, "I just filled the login form. Click the sign-in button.")
        execute_action(page, action, log)

    page.wait_for_timeout(3000)
    log("Logged in.")


# ── Expense processing via vision agent ────────────────────────────────────────

def process_expenses_via_browser(
    page: Page,
    client: anthropic.Anthropic,
    log,
    auto_submit: bool = False,
    max_expenses: int = 20,
):
    """Navigate to expenses and use a vision loop to process each one."""
    log("Navigating to expenses...")
    page.goto(f"{CENTER_URL}/expenses", wait_until="domcontentloaded")
    page.wait_for_timeout(2000)

    processed = 0

    for i in range(max_expenses):
        img = screenshot_b64(page)

        # Ask Claude what it sees and which expense to process next
        overview = ask_claude_vision(
            client,
            img,
            """Look at this Center expense management page.
List any pending or uncategorized expenses you can see (merchant, amount, date).
If there are no more expenses to process, say "DONE".
Otherwise describe the first expense that needs attention in one sentence."""
        )
        log(f"  Vision: {overview}")

        if "DONE" in overview.upper() or "no more" in overview.lower() or "no expenses" in overview.lower():
            log("No more expenses to process.")
            break

        # Determine the context for the action agent
        submit_instruction = "After categorizing, also click Submit for approval." if auto_submit else "Do NOT submit — just categorize and save."
        context = f"""
I am on the Center expenses page. I need to open and categorize the next pending expense.
{overview}
Instructions:
- Click on the first uncategorized/pending expense to open it
- Fill in: category (travel/meals/software/office/other), GL code, and a brief business note
- Save the changes
- {submit_instruction}
- Return to the expenses list when done
"""
        # Run the action loop for this expense
        step = 0
        while step < 25:  # max steps per expense
            img = screenshot_b64(page)
            action = ask_claude_for_action(client, img, context)
            should_continue = execute_action(page, action, log)
            if not should_continue:
                break
            step += 1

        processed += 1
        log(f"  Expense {i+1} processed ({step} steps).")
        page.wait_for_timeout(1000)

        # Navigate back to expense list if needed
        current_url = page.url
        if "/expenses/" in current_url and current_url != f"{CENTER_URL}/expenses":
            page.goto(f"{CENTER_URL}/expenses", wait_until="domcontentloaded")
            page.wait_for_timeout(1500)

    return processed


# ── Main entry point ───────────────────────────────────────────────────────────

def run_browser_agent(
    email: str,
    password: str,
    anthropic_api_key: Optional[str] = None,
    auto_submit: bool = False,
    headless: bool = True,
    max_expenses: int = 20,
    log=print,
):
    """
    Launch a browser, log into Center, and autonomously process expenses
    using Claude vision to understand the UI.
    """
    ai = anthropic.Anthropic(api_key=anthropic_api_key or os.environ["ANTHROPIC_API_KEY"])

    with sync_playwright() as pw:
        browser: Browser = pw.chromium.launch(
            headless=headless,
            args=["--no-sandbox", "--disable-dev-shm-usage"],
        )
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        try:
            login(page, ai, email, password, log)

            # Verify login succeeded
            img = screenshot_b64(page)
            login_check = ask_claude_vision(ai, img, "Did the login succeed? Reply YES or NO and one sentence why.")
            log(f"Login check: {login_check}")
            if "NO" in login_check.upper():
                log("Login failed — check credentials.")
                return {"success": False, "processed": 0}

            count = process_expenses_via_browser(page, ai, log, auto_submit=auto_submit, max_expenses=max_expenses)
            log(f"\nDone. Processed {count} expense(s).")
            return {"success": True, "processed": count}

        finally:
            context.close()
            browser.close()
