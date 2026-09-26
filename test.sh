#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#   UNIVERSAL BROWSER — Quick Test Script
#   Author: Shubham Maurya
# ═══════════════════════════════════════════════════════════════

echo "╔══════════════════════════════════════════════╗"
echo "║   🧪 Universal Browser — Test Suite          ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

PASS=0
FAIL=0
WARN=0

check() {
  local name="$1"
  local condition="$2"
  local result=$(eval "$condition")
  
  if [ -n "$result" ] && [ "$result" != "0" ]; then
    echo "✅ $name"
    PASS=$((PASS + 1))
  else
    echo "❌ $name"
    FAIL=$((FAIL + 1))
  fi
}

warn_check() {
  local name="$1"
  local condition="$2"
  local result=$(eval "$condition")
  
  if [ -n "$result" ] && [ "$result" != "0" ]; then
    echo "✅ $name"
    PASS=$((PASS + 1))
  else
    echo "⚠️  $name (optional)"
    WARN=$((WARN + 1))
  fi
}

echo "📁 FILE CHECKS"
echo "─────────────────────────────────────────────"

cd ~/universal-browser 2>/dev/null || { echo "❌ Folder not found!"; exit 1; }

check "package.json" "[ -f package.json ] && echo yes"
check "main.js" "[ -f main.js ] && echo yes"
check "preload.js" "[ -f preload.js ] && echo yes"
check "index.html" "[ -f index.html ] && echo yes"
check "renderer.js" "[ -f renderer.js ] && echo yes"
check "styles.css" "[ -f styles.css ] && echo yes"
check "ai.js" "[ -f ai.js ] && echo yes"
check "workspace.js" "[ -f workspace.js ] && echo yes"
check "tabs.js" "[ -f tabs.js ] && echo yes"
check "notes.js" "[ -f notes.js ] && echo yes"
check "backup.js" "[ -f backup.js ] && echo yes"
check "onboarding.js" "[ -f onboarding.js ] && echo yes"
check "performance.js" "[ -f performance.js ] && echo yes"
check "privacy.js" "[ -f privacy.js ] && echo yes"
check "extensions.js" "[ -f extensions.js ] && echo yes"

echo ""
echo "📦 NODE MODULES"
echo "─────────────────────────────────────────────"

check "electron installed" "[ -d node_modules/electron ] && echo yes"
check "openai installed" "[ -d node_modules/openai ] && echo yes"
check "dotenv installed" "[ -d node_modules/dotenv ] && echo yes"

echo ""
echo "🔐 ENVIRONMENT"
echo "─────────────────────────────────────────────"

warn_check ".env file exists" "[ -f .env ] && echo yes"
warn_check "OPENAI_API_KEY set" "[ -s .env ] && grep -q 'OPENAI_API_KEY' .env && echo yes"

echo ""
echo "📝 CODE SYNTAX"
echo "─────────────────────────────────────────────"

check "main.js syntax" "node -c main.js 2>/dev/null && echo yes"
check "preload.js syntax" "node -c preload.js 2>/dev/null && echo yes"
check "renderer.js syntax" "node -c renderer.js 2>/dev/null && echo yes"
check "ai.js syntax" "node -c ai.js 2>/dev/null && echo yes"
check "workspace.js syntax" "node -c workspace.js 2>/dev/null && echo yes"
check "tabs.js syntax" "node -c tabs.js 2>/dev/null && echo yes"
check "notes.js syntax" "node -c notes.js 2>/dev/null && echo yes"
check "backup.js syntax" "node -c backup.js 2>/dev/null && echo yes"
check "onboarding.js syntax" "node -c onboarding.js 2>/dev/null && echo yes"
check "performance.js syntax" "node -c performance.js 2>/dev/null && echo yes"
check "privacy.js syntax" "node -c privacy.js 2>/dev/null && echo yes"
check "extensions.js syntax" "node -c extensions.js 2>/dev/null && echo yes"

echo ""
echo "📄 HTML/SCRIPT CHECKS"
echo "─────────────────────────────────────────────"

check "index.html has renderer.js" "grep -q 'renderer.js' index.html && echo yes"
check "index.html has ai.js" "grep -q 'ai.js' index.html && echo yes"
check "index.html has workspace.js" "grep -q 'workspace.js' index.html && echo yes"
check "index.html has tabs.js" "grep -q 'tabs.js' index.html && echo yes"
check "index.html has notes.js" "grep -q 'notes.js' index.html && echo yes"
check "index.html has backup.js" "grep -q 'backup.js' index.html && echo yes"
check "index.html has onboarding.js" "grep -q 'onboarding.js' index.html && echo yes"
check "index.html has performance.js" "grep -q 'performance.js' index.html && echo yes"
check "index.html has privacy.js" "grep -q 'privacy.js' index.html && echo yes"
check "index.html has extensions.js" "grep -q 'extensions.js' index.html && echo yes"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   📊 TEST RESULTS                            ║"
echo "╠══════════════════════════════════════════════╣"
printf "║   ✅ Passed:   %-3s                           ║\n" "$PASS"
printf "║   ❌ Failed:   %-3s                           ║\n" "$FAIL"
printf "║   ⚠️  Warnings: %-3s                           ║\n" "$WARN"
echo "╚══════════════════════════════════════════════╝"
echo ""

if [ $FAIL -eq 0 ]; then
  echo "🎉 ALL TESTS PASSED!"
  echo ""
  echo "Ready to push to GitHub 🚀"
else
  echo "⚠️  $FAIL tests failed. Fix them first."
  echo ""
  echo "Run individual commands to see errors:"
  echo "  node -c <filename.js>"
fi

echo ""
