# Autonomous Center Expense Tracker

Automatically fetches, categorizes, attaches receipts, and submits your corporate expenses in [Center](https://getcenter.com) using Claude AI.

## What it does

1. **Fetches** all pending / uncategorized expenses from the Center API
2. **Categorizes** each expense (travel, meals, software, office, other) using Claude AI based on merchant name and amount
3. **Assigns GL codes** from a configurable mapping
4. **Attaches unmatched receipts** to expenses that have none
5. **Submits for approval** (optional, off by default)
6. Can run **once** or on a **recurring schedule** (cron-friendly)

## Setup

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:

| Variable | Description |
|---|---|
| `CENTER_API_KEY` | Your Center API key (from developer.getcenter.com) |
| `CENTER_API_VERSION` | API version date (e.g. `2024-01-01`) |
| `CENTER_ENVIRONMENT` | `sandbox` or `production` |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `AUTO_SUBMIT` | `true` to auto-submit for approval, `false` to categorize only |
| `POLL_INTERVAL_MINUTES` | How often to run in watch mode (default 15) |
| `GL_CODE_MAP` | Comma-separated `category:code` pairs |

### 3. Get a Center API key

Contact your Center admin or email the Center platform team to request an API key. You can use the **sandbox environment** for testing.

## Usage

### Process expenses once

```bash
python -m expense_tracker run
```

### Run continuously (every 15 min by default)

```bash
python -m expense_tracker watch
```

### Run every 5 minutes and auto-submit

```bash
python -m expense_tracker watch --interval 5 --auto-submit
```

### View your current expenses

```bash
python -m expense_tracker status
python -m expense_tracker status --status pending --limit 50
```

### Categorize a single expense (dry-run)

```bash
python -m expense_tracker categorize <EXPENSE_ID>
```

### Categorize and apply changes

```bash
python -m expense_tracker categorize <EXPENSE_ID> --apply
```

### Manually submit one expense

```bash
python -m expense_tracker submit <EXPENSE_ID>
```

## Run on a schedule (cron)

Add to your crontab to run every 30 minutes:

```
*/30 * * * * cd /path/to/repo && python -m expense_tracker run >> /var/log/expense_tracker.log 2>&1
```

## GL Code configuration

Edit `GL_CODE_MAP` in `.env` to match your chart of accounts:

```
GL_CODE_MAP=travel:6010,meals:6020,software:6030,office:6040,other:6099
```

## Architecture

```
expense_tracker/
├── __init__.py
├── __main__.py          # python -m expense_tracker entry point
├── cli.py               # Click CLI commands
├── center_client.py     # Center REST API wrapper
└── processor.py         # Autonomous processing logic + Claude AI
```

## How categorization works

For each pending expense, the processor sends the merchant name, amount, date, and your GL code map to Claude. Claude returns a JSON object with the chosen category, GL code, a short business justification note, and a confidence level. High-confidence results are applied immediately; all results are logged.
