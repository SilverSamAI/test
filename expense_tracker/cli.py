"""
CLI entry point for the autonomous Center expense tracker.

Usage:
  python -m expense_tracker run        # process once
  python -m expense_tracker watch      # run on a schedule (default 15 min)
  python -m expense_tracker status     # show recent expenses
  python -m expense_tracker submit ID  # manually submit one expense
"""

import os
import sys
import time
import json

import click
import schedule
from dotenv import load_dotenv
from rich.console import Console
from rich.table import Table
from rich import print as rprint

load_dotenv()

console = Console()


def _make_processor():
    from .processor import ExpenseProcessor
    auto_submit = os.getenv("AUTO_SUBMIT", "false").lower() == "true"
    return ExpenseProcessor(auto_submit=auto_submit)


# ── CLI group ──────────────────────────────────────────────────────────────────

@click.group()
def cli():
    """Autonomous Center expense tracker powered by Claude AI."""
    pass


# ── run: process once ──────────────────────────────────────────────────────────

@cli.command()
@click.option("--auto-submit", is_flag=True, default=None,
              help="Override AUTO_SUBMIT env var and submit all processed expenses.")
def run(auto_submit):
    """Fetch, categorize, and (optionally) submit all pending expenses once."""
    from .processor import ExpenseProcessor
    processor = ExpenseProcessor(auto_submit=auto_submit if auto_submit is not None else None)
    console.rule("[bold blue]Center Autonomous Expense Run[/bold blue]")
    results = processor.run_once(console=console)
    _print_summary(results)


# ── watch: run on a schedule ───────────────────────────────────────────────────

@cli.command()
@click.option("--interval", default=None, type=int,
              help="Poll interval in minutes (default: POLL_INTERVAL_MINUTES env var or 15).")
@click.option("--auto-submit", is_flag=True, default=None,
              help="Submit all processed expenses automatically.")
def watch(interval, auto_submit):
    """Continuously watch for new expenses and process them on a schedule."""
    from .processor import ExpenseProcessor
    poll_minutes = interval or int(os.getenv("POLL_INTERVAL_MINUTES", "15"))
    processor = ExpenseProcessor(auto_submit=auto_submit if auto_submit is not None else None)

    def job():
        console.rule(f"[bold blue]Center Expense Run[/bold blue]")
        try:
            results = processor.run_once(console=console)
            _print_summary(results)
        except Exception as e:
            console.print(f"[red]Run failed: {e}[/red]")

    console.print(f"[green]Watching for expenses every {poll_minutes} minute(s). Press Ctrl+C to stop.[/green]")
    job()  # run immediately on start
    schedule.every(poll_minutes).minutes.do(job)

    try:
        while True:
            schedule.run_pending()
            time.sleep(30)
    except KeyboardInterrupt:
        console.print("\n[yellow]Stopped.[/yellow]")


# ── status: show expense list ──────────────────────────────────────────────────

@cli.command()
@click.option("--limit", default=20, show_default=True, help="Number of expenses to show.")
@click.option("--status", default=None, help="Filter by expense status (e.g. pending, approved).")
def status(limit, status):
    """Show recent expenses from Center."""
    from .center_client import CenterClient
    client = CenterClient()
    try:
        expenses = client.list_expenses(status=status, limit=limit)
    except Exception as e:
        console.print(f"[red]Failed to fetch expenses: {e}[/red]")
        sys.exit(1)

    table = Table(title="Center Expenses", show_lines=True)
    table.add_column("ID", style="dim", max_width=12)
    table.add_column("Merchant")
    table.add_column("Amount", justify="right")
    table.add_column("Date")
    table.add_column("Category")
    table.add_column("GL Code")
    table.add_column("Status")

    for e in expenses:
        table.add_row(
            e.id[:12],
            e.merchant_name,
            f"{e.currency} {e.amount:.2f}",
            e.date,
            e.category or "—",
            e.gl_code or "—",
            e.status,
        )

    console.print(table)


# ── submit: manually submit one expense ────────────────────────────────────────

@cli.command()
@click.argument("expense_id")
def submit(expense_id):
    """Manually submit a single expense for approval."""
    from .center_client import CenterClient
    client = CenterClient()
    try:
        expense = client.submit_expense(expense_id)
        console.print(f"[green]Submitted expense {expense.id} ({expense.merchant_name}). Status: {expense.status}[/green]")
    except Exception as e:
        console.print(f"[red]Failed to submit expense {expense_id}: {e}[/red]")
        sys.exit(1)


# ── categorize: AI-categorize a single expense ─────────────────────────────────

@cli.command()
@click.argument("expense_id")
@click.option("--apply/--dry-run", default=False, help="Apply changes to Center (default: dry-run).")
def categorize(expense_id, apply):
    """AI-categorize a single expense and show (or apply) the result."""
    from .center_client import CenterClient
    from .processor import ExpenseProcessor
    client = CenterClient()
    processor = ExpenseProcessor()

    try:
        expense = client.get_expense(expense_id)
    except Exception as e:
        console.print(f"[red]Could not fetch expense: {e}[/red]")
        sys.exit(1)

    result = processor._categorize_expense(expense)

    console.print(f"\n[bold]Expense:[/bold] {expense.merchant_name} {expense.currency} {expense.amount:.2f} ({expense.date})")
    console.print(f"[bold]Category:[/bold] {result.category}")
    console.print(f"[bold]GL Code:[/bold]  {result.gl_code}")
    console.print(f"[bold]Notes:[/bold]    {result.notes}")
    console.print(f"[bold]Confidence:[/bold] {result.confidence}")
    console.print(f"[bold]Reasoning:[/bold] {result.reasoning}")

    if apply:
        client.update_expense(expense_id, category=result.category, gl_code=result.gl_code, notes=result.notes)
        console.print(f"\n[green]Applied to Center.[/green]")
    else:
        console.print(f"\n[yellow]Dry-run mode. Use --apply to save changes.[/yellow]")


# ── helpers ────────────────────────────────────────────────────────────────────

def _print_summary(results: dict):
    console.print(f"\n[bold]Summary[/bold]")
    console.print(f"  Processed : {results['processed']}")
    console.print(f"  Submitted : {results['submitted']}")
    console.print(f"  Errors    : {results['errors']}")

    if results["details"]:
        table = Table(show_lines=True)
        table.add_column("Merchant")
        table.add_column("Amount", justify="right")
        table.add_column("Category")
        table.add_column("GL")
        table.add_column("Conf.")
        table.add_column("Submitted")
        for d in results["details"]:
            table.add_row(
                d["merchant"],
                f"{d['amount']:.2f}",
                d["category"],
                d["gl_code"],
                d["confidence"],
                "✓" if d["submitted"] else "—",
            )
        console.print(table)
