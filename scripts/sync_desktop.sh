#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
# FinSmart — One-Time GitHub Push + Desktop Folder Sync
# ═══════════════════════════════════════════════════════════════════
# Run ONCE from your Mac Terminal:
#
#   bash ~/Documents/Claude/Projects/FinSmart/scripts/sync_desktop.sh
#
# PREREQUISITES — complete these two steps before running:
#
# 1. Create the GitHub repo (empty, no README):
#    → https://github.com/new
#    → Name: FinSmart  |  Owner: EsheshGupta
#    → Do NOT tick "Add a README file"
#    → Click "Create repository"
#
# 2. Generate a Personal Access Token:
#    → https://github.com/settings/tokens/new
#    → Note: "FinSmart"  |  Expiry: 90 days  |  Scope: repo (full)
#    → Copy the token — you'll be prompted for it below
# ═══════════════════════════════════════════════════════════════════
set -e

WORKSPACE_DIR="$HOME/Documents/Claude/Projects/FinSmart"
DESKTOP_DIR="$HOME/Desktop/AI Technology Workshop pre-read - 4-6 Dec/FInSmart"

# ── Get token ─────────────────────────────────────────────────────
if [ -n "$1" ]; then
  GITHUB_TOKEN="$1"
else
  echo ""
  echo "Paste your GitHub Personal Access Token (input hidden, press Enter):"
  read -rs GITHUB_TOKEN
  echo ""
fi
[ -z "$GITHUB_TOKEN" ] && { echo "Error: token required."; exit 1; }

REMOTE_URL="https://${GITHUB_TOKEN}@github.com/EsheshGupta/FinSmart.git"

echo "=== Step 1: Initialising git ==="
cd "$WORKSPACE_DIR"
git init
git config user.name  "Eshesh Gupta"
git config user.email "esheshgupta@fynd.team"
git branch -M main

echo "=== Step 2: Staging all 156 project files ==="
git add -A

echo "=== Step 3: Initial commit ==="
git commit -m "feat: initial FinSmart project scaffold

Full monorepo — mobile (React Native), 9 FastAPI microservices,
Kafka data pipeline, LLM+ML engine, K8s infra, architecture docs."

echo "=== Step 4: Push to GitHub ==="
git remote add origin "$REMOTE_URL"
git push -u origin main
echo "Pushed to https://github.com/EsheshGupta/FinSmart"

echo "=== Step 5: Sync to Desktop folder ==="
mkdir -p "$DESKTOP_DIR"
rsync -av --delete --exclude='.git' "$WORKSPACE_DIR/" "$DESKTOP_DIR/"
cd "$DESKTOP_DIR"
git init
git config user.name  "Eshesh Gupta"
git config user.email "esheshgupta@fynd.team"
git remote add origin "$REMOTE_URL"
git fetch origin
git reset --hard origin/main
git branch -M main
git branch --set-upstream-to=origin/main main

echo ""
echo "══════════════════════════════════════════════════════════════"
echo "  Done! Both folders now track GitHub."
echo ""
echo "  Workspace : $WORKSPACE_DIR"
echo "  Desktop   : $DESKTOP_DIR"
echo "  GitHub    : https://github.com/EsheshGupta/FinSmart"
echo ""
echo "  Work in either folder. Use 'git pull' / 'git push' normally."
echo "══════════════════════════════════════════════════════════════"
