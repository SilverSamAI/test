#!/usr/bin/env bash
# Claude Code Memory System Setup
# Installs: persistent memory layer, multimodal media-memory (ChromaDB + Gemini),
# and research-scout skill. Schedules nightly consolidation and research runs.
#
# Requirements: Node.js >= 20, Python >= 3.11, pip3
# Optional:     GEMINI_API_KEY env var for Gemini Embedding 2 (falls back to built-in embedder)

set -euo pipefail
CLAUDE_DIR="${HOME}/.claude"

echo "=== Claude Code Memory System Setup ==="
echo ""

# --- 1. Python dependencies ---
echo "[1/6] Installing Python dependencies (chromadb, google-generativeai)..."
pip3 install --quiet chromadb google-generativeai

# --- 2. Memory directory ---
echo "[2/6] Creating memory files..."
mkdir -p "${CLAUDE_DIR}/memory"

for f in recent-memory long-term-memory project-memory; do
  dest="${CLAUDE_DIR}/memory/${f}.md"
  [ -f "$dest" ] && echo "  skip: ${f}.md already exists" && continue
  touch "$dest"
  echo "  created: ${f}.md"
done

# --- 3. media-memory backend ---
echo "[3/6] Setting up media-memory backend..."
mkdir -p "${CLAUDE_DIR}/media-memory"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Copy Python scripts from repo (if they exist alongside this script)
for script in ingest.py search.py; do
  src="${SCRIPT_DIR}/media-memory/${script}"
  dest="${CLAUDE_DIR}/media-memory/${script}"
  if [ -f "$src" ]; then
    cp "$src" "$dest"
    echo "  copied: ${script}"
  else
    echo "  warning: ${script} not found at ${src} — fetch from ~/.claude/media-memory/ manually"
  fi
done

# --- 4. Skills ---
echo "[4/6] Installing skills..."
for skill in consolidate-memory media-memory research-scout; do
  mkdir -p "${CLAUDE_DIR}/skills/${skill}"
  echo "  skill: ${skill} (directory created)"
done
echo "  Note: copy SKILL.md files from repo into each skill directory if not already present"

# --- 5. CLAUDE.md ---
echo "[5/6] CLAUDE.md..."
if [ ! -f "${CLAUDE_DIR}/CLAUDE.md" ]; then
  echo "  warning: ${CLAUDE_DIR}/CLAUDE.md not found — copy from repo or create manually"
else
  echo "  ok: CLAUDE.md exists"
fi

# --- 6. Cron schedule ---
echo "[6/6] Installing cron schedule..."
CRON_FILE="/etc/cron.d/claude-memory"
if [ -w /etc/cron.d ]; then
  cat > "$CRON_FILE" <<'CRON'
SHELL=/bin/bash
PATH=/opt/node22/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
# research-scout 3x nightly
0 0,8,16 * * * root /root/.claude/hooks/run-skill.sh research-scout
# consolidate-memory nightly
0 2 * * *    root /root/.claude/hooks/run-skill.sh consolidate-memory
# weekly memory promotion (Sunday)
0 3 * * 0    root /root/.claude/hooks/run-skill.sh consolidate-memory
CRON
  chmod 644 "$CRON_FILE"
  echo "  installed: ${CRON_FILE}"
else
  # fallback: user crontab
  (crontab -l 2>/dev/null || true; cat <<'CRON'
# Claude Code memory system
0 0,8,16 * * * /root/.claude/hooks/run-skill.sh research-scout
0 2 * * *    /root/.claude/hooks/run-skill.sh consolidate-memory
0 3 * * 0    /root/.claude/hooks/run-skill.sh consolidate-memory
CRON
) | crontab -
  echo "  installed: user crontab"
fi

echo ""
echo "=== Done! ==="
echo ""
echo "Skills available:"
echo "  /consolidate-memory  — extract decisions from last 24hr sessions into memory files"
echo "  /media-memory        — ingest or search media assets"
echo "  /research-scout      — hunt for new info that updates existing knowledge"
echo ""
echo "To activate Gemini Embedding 2, add to your shell profile:"
echo "  export GEMINI_API_KEY=your_key_here"
echo ""
echo "Restart Claude Code for CLAUDE.md to take effect."
