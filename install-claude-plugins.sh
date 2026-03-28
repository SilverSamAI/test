#!/usr/bin/env bash
# Claude Code Plugin Installation Script
# Installs the recommended plugin stack: Superpowers, GSD, Claude Mem, UI/UX Pro Max
# Run this inside a Claude Code environment with Node.js >= 20 installed.

set -e

echo "=== Claude Code Plugin Installer ==="
echo ""

# Group 1: Plugin Marketplace installs
echo "[1/4] Installing Superpowers..."
claude plugin marketplace add obra/superpowers-marketplace
claude plugin install superpowers@superpowers-marketplace

echo "[2/4] Installing GSD (Get Shit Done) via npx..."
npx get-shit-done-cc --claude --global

echo "[3/4] Installing Claude Mem..."
claude plugin marketplace add thedotmack/claude-mem
claude plugin install claude-mem

echo "[4/4] Installing UI/UX Pro Max..."
claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill

echo ""
echo "=== Done! Restart Claude Code to activate all plugins. ==="
echo ""
echo "Installed:"
claude plugin list
