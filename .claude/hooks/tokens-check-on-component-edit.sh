#!/usr/bin/env bash
# Матчер PostToolUse сравнивается с ИМЕНЕМ инструмента, поэтому фильтр по пути — здесь.
# exit 2 = Claude видит stderr; exit 0 = тихо. Хук не должен мешать работе.
set -uo pipefail
payload=$(cat)
file=$(printf '%s' "$payload" | jq -r '.tool_input.file_path // empty' 2>/dev/null || true)
case "$file" in *"/src/components/"*) ;; *) exit 0 ;; esac
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
out=$(npm run --silent tokens:check 2>&1) || true
if printf '%s' "$out" | grep -qE '[1-9][0-9]* errors?'; then
  printf 'tokens:check после правки %s\n%s\n' "$file" "$out" >&2; exit 2
fi
exit 0
