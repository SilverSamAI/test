#!/usr/bin/env bash
# Install GitHub-sourced plugins, MCP servers, and Python upgrades
# Run inside a Claude Code session with Node.js >= 20 and Python >= 3.11.
set -euo pipefail

echo "=== GitHub Repo Enhancements for Claude Code ==="
echo ""

# --- Plugin Marketplaces ---
echo "[1/4] Adding plugin marketplaces..."
MARKETPLACES=(
  "anthropics/claude-plugins-official"  # 15k stars — official Anthropic plugins
  "alirezarezvani/claude-skills"         # 7.8k stars — 192+ skills
  "jeremylongshore/claude-code-plugins-plus-skills"  # 1.7k stars — 340 plugins
  "davepoon/buildwithclaude"             # 2.6k stars — skills/agents/commands hub
  "nyldn/claude-octopus"                 # 2.1k stars — multi-LLM orchestration
  "agent-sh/agentsys"                    # 668 stars  — 19 plugins, 47 agents
)

for mkt in "${MARKETPLACES[@]}"; do
  repo_name="${mkt##*/}"
  echo "  Adding $mkt..."
  claude plugin marketplace add "$mkt" 2>&1 | grep -E "Successfully|Failed|already" || true
done

# --- Plugins ---
echo ""
echo "[2/4] Installing plugins..."

# Memory & Research
claude plugin install episodic-memory@superpowers-marketplace   # persistent episodic memory
claude plugin install remember@claude-plugins-official           # continuous session memory
claude plugin install goodmem@claude-plugins-official            # GoodMem memory infra
claude plugin install autoresearch-agent@claude-code-skills      # automated research

# Research & Web
claude plugin install firecrawl@claude-plugins-official          # web scraping
claude plugin install superpowers-chrome@superpowers-marketplace # Chrome DevTools

# Dev Workflow
claude plugin install github@claude-plugins-official             # GitHub MCP
claude plugin install greptile@claude-plugins-official           # codebase semantic search
claude plugin install claude-md-management@claude-plugins-official  # CLAUDE.md tools
claude plugin install drift-detect@agentsys                       # plan vs code drift
claude plugin install learn@agentsys                              # research + learning guides
claude plugin install audit-project@agentsys                      # multi-agent code review
claude plugin install octo@nyldn-plugins                          # multi-LLM orchestration

echo ""
echo "[3/4] Installing MCP servers..."

# GitMCP — live docs for any GitHub repo (kills hallucinations)
claude mcp add --transport sse git-mcp https://gitmcp.io/docs -s user 2>&1 || true

# Vestige — cognitive memory with FSRS-6 spaced repetition
if ! command -v vestige-mcp &>/dev/null; then
  echo "  Installing Vestige binary..."
  OS="$(uname -s)"
  ARCH="$(uname -m)"
  if [[ "$OS" == "Linux" && "$ARCH" == "x86_64" ]]; then
    BINARY_URL="https://github.com/samvallad33/vestige/releases/download/v1.1.0/vestige-mcp-x86_64-unknown-linux-gnu.tar.gz"
    curl -sL "$BINARY_URL" | tar -xz -C /usr/local/bin/
    chmod +x /usr/local/bin/vestige-mcp
  else
    echo "  Falling back to npm install for Vestige..."
    npm install -g vestige-mcp-server 2>/dev/null || echo "  Manual install required: see github.com/samvallad33/vestige"
  fi
fi
claude mcp add vestige vestige-mcp -s user 2>&1 || true

echo ""
echo "[4/4] Upgrading Python dependencies..."
pip3 install --quiet --upgrade mem0ai lancedb

echo ""
echo "=== Done! Restart Claude Code to activate all plugins. ==="
echo ""
echo "New capabilities:"
echo "  Memory:   episodic-memory, remember, goodmem, vestige (FSRS-6 spaced repetition)"
echo "  Research: autoresearch-agent, firecrawl, superpowers-chrome"
echo "  Code:     github MCP, greptile, drift-detect, audit-project, learn"
echo "  Multi-LLM: octo (Gemini, Codex, Perplexity, Ollama + 4 more)"
echo "  GitMCP:   live docs for any GitHub repo via https://gitmcp.io/docs"
