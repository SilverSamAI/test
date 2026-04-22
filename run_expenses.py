#!/usr/bin/env python3
"""
Run the autonomous Center expense browser agent.
Reads credentials from environment variables or prompts interactively.

Usage:
  CENTER_EMAIL=you@company.com CENTER_PASSWORD=secret ANTHROPIC_API_KEY=sk-... \
      python run_expenses.py

  Or just:
      python run_expenses.py   (will prompt for credentials)
"""

import os
import sys
from dotenv import load_dotenv

load_dotenv()

from expense_tracker.browser_agent import run_browser_agent


def main():
    email = os.getenv("CENTER_EMAIL") or input("Center email: ").strip()
    password = os.getenv("CENTER_PASSWORD") or input("Center password: ").strip()
    anthropic_key = os.getenv("ANTHROPIC_API_KEY") or input("Anthropic API key: ").strip()
    auto_submit_env = os.getenv("AUTO_SUBMIT", "false").lower() == "true"

    print("\n=== Autonomous Center Expense Agent ===")
    print(f"Account : {email}")
    print(f"Auto-submit: {auto_submit_env}")
    print("=======================================\n")

    result = run_browser_agent(
        email=email,
        password=password,
        anthropic_api_key=anthropic_key,
        auto_submit=auto_submit_env,
        headless=True,
        log=print,
    )

    if result["success"]:
        print(f"\n✓ Done — {result['processed']} expense(s) processed.")
    else:
        print("\n✗ Agent failed — check credentials and try again.")
        sys.exit(1)


if __name__ == "__main__":
    main()
