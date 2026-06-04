#!/usr/bin/env bash
# 品質監査スクリプト —— 4 種類のチェックで drift を防ぐ
#
# 1. 静的検証: JSON parse / SKILL.md frontmatter / symlink / hook 実行権限
# 2. Installer 機能: 18 種類の tool install / uninstall / idempotency
# 3. Upstream alignment: hooks 3 files + brainstorm scripts 3 files + 14 translated skill structure
# 4. Cross references: README → docs/ links + skill references + bootstrap injection path
#
# 使い方:
#   bash scripts/audit.sh                 # 全チェック。FAIL > 0 なら exit 1
#   bash scripts/audit.sh --quick         # installer 機能テストをスキップ
#   bash scripts/audit.sh --no-upstream   # upstream alignment をスキップ（CI で upstream remote がない場合）
#
# CI は PR + push to main で実行し、drift を検出したら止める。

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

QUICK=0
NO_UPSTREAM=0
for arg in "$@"; do
  case "$arg" in
    --quick) QUICK=1 ;;
    --no-upstream) NO_UPSTREAM=1 ;;
  esac
done

PASS=0; FAIL=0; WARN=0
declare -a FAILURES=()
declare -a WARNINGS=()
INSTALLER="$ROOT/bin/superpowers-ja.js"
declare -a TMP_PATHS=()

ok()   { PASS=$((PASS+1)); }
bad()  { FAIL=$((FAIL+1)); FAILURES+=("$1"); echo "  ❌ $1"; }
warn() { WARN=$((WARN+1)); WARNINGS+=("$1"); echo "  ⚠️  $1"; }
hdr()  { echo ""; echo "=== $1 ==="; }
new_tmpdir() { local p; p=$(mktemp -d); TMP_PATHS+=("$p"); echo "$p"; }
new_tmpfile() { local p; p=$(mktemp); TMP_PATHS+=("$p"); echo "$p"; }
cleanup_tmp_paths() {
  local p
  for p in "${TMP_PATHS[@]}"; do
    rm -rf "$p"
  done
}
trap cleanup_tmp_paths EXIT

# upstream remote を確認する（CI では fetch が必要）
ensure_upstream() {
  if [ "$NO_UPSTREAM" = "1" ]; then return 1; fi
  if ! git ls-remote --exit-code upstream HEAD >/dev/null 2>&1; then
    if git remote get-url upstream >/dev/null 2>&1; then
      git fetch upstream main --depth=50 --quiet 2>/dev/null || return 1
    else
      git remote add upstream https://github.com/obra/superpowers.git 2>/dev/null
      git fetch upstream main --depth=50 --quiet 2>/dev/null || return 1
    fi
  fi
  return 0
}

#==============================================================================
hdr "Category 1: 静的検証"
#==============================================================================

# 1a. JSON parse
while IFS= read -r f; do
  if node -e "JSON.parse(require('fs').readFileSync('$f','utf8'))" 2>/dev/null; then
    ok
  else
    bad "JSON parse failure: $f"
  fi
done < <(find . -name "*.json" \
            -not -path "./node_modules/*" \
            -not -path "./.git/*" \
            -not -path "./tests/*/node_modules/*")

# 1b. SKILL.md frontmatter 完整性
for f in skills/*/SKILL.md; do
  if ! head -1 "$f" | grep -q '^---$'; then
    bad "No frontmatter: $f"
    continue
  fi
  fm=$(sed -n '/^---$/,/^---$/p' "$f" | head -20)
  for field in name description; do
    if ! echo "$fm" | grep -q "^${field}:"; then
      bad "Missing frontmatter field '$field': $f"
    fi
  done
  ok
done

# 1c. Symlink 解析
while IFS= read -r l; do
  if [ -e "$l" ]; then ok; else bad "Broken symlink: $l"; fi
done < <(find . -type l -not -path "./node_modules/*" -not -path "./.git/*")

# 1d. Hook 脚本可执行权限
for f in hooks/session-start hooks/run-hook.cmd; do
  if [ -x "$f" ]; then ok; else bad "Not executable: $f"; fi
done

# 1e. CLI support commands
if node "$INSTALLER" --list-tools | grep -q "Claude Code" && node "$INSTALLER" --list-tools | grep -q "Claw Code"; then
  ok
else
  bad "CLI --list-tools output does not include expected installer targets"
fi

#==============================================================================
if [ "$QUICK" != "1" ]; then
hdr "Category 2: Installer 機能テスト（18 tools）"
#==============================================================================

declare -a TOOLS=(claude cursor codex kiro deerflow trae antigravity vscode openclaw windsurf gemini aider opencode qwen hermes claw copilot qoder)

for tool in "${TOOLS[@]}"; do
  TMP=$(new_tmpdir)
  pushd "$TMP" >/dev/null

  if ! node "$INSTALLER" --tool "$tool" >/dev/null 2>&1; then
    bad "Installer: $tool install failed"
    popd >/dev/null
    continue
  fi

  # Idempotency: installing twice must not fail.
  if ! node "$INSTALLER" --tool "$tool" >/dev/null 2>&1; then
    bad "Installer: $tool second install failed (idempotency regression)"
    popd >/dev/null
    continue
  fi

  if ! node "$INSTALLER" --uninstall >/dev/null 2>&1; then
    bad "Installer: $tool uninstall failed"
  else
    ok
  fi

  popd >/dev/null
done

else
echo ""
echo "[--quick: installer 機能テストをスキップ]"
fi

#==============================================================================
hdr "Category 3: Upstream alignment"
#==============================================================================

if ! ensure_upstream; then
  warn "upstream にアクセスできないため alignment check をスキップしました（CI では network を確認してください）"
else
  # 3a. Hooks 3 files + cursor manifest.
  for f in hooks/session-start hooks/hooks.json hooks/run-hook.cmd hooks/hooks-cursor.json; do
    d=$(diff <(git show upstream/main:$f 2>/dev/null) "$f" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$d" = "0" ]; then ok; else bad "Hooks drift: $f ($d lines)"; fi
  done

  # 3b. Brainstorm scripts 3 files.
  for f in skills/brainstorming/scripts/server.cjs \
           skills/brainstorming/scripts/start-server.sh \
           skills/brainstorming/scripts/stop-server.sh; do
    d=$(diff <(git show upstream/main:$f 2>/dev/null) "$f" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$d" = "0" ]; then ok; else bad "Brainstorm script drift: $(basename $f) ($d lines)"; fi
  done

  # 3c. Heading structure for 14 translated skills (H1-H4 count).
  declare -a SKILLS=(brainstorming dispatching-parallel-agents executing-plans \
    finishing-a-development-branch receiving-code-review requesting-code-review \
    subagent-driven-development systematic-debugging test-driven-development \
    using-git-worktrees using-superpowers verification-before-completion \
    writing-plans writing-skills)

  # 日本語化に伴う節分け / 日本現場向け追記を許容する skill。
  # macOS default bash 3.2 does not support associative arrays, so use a case helper.
  skill_drift_allowance() {
    case "$1" in
      # 日本 SI 向け「実行報告」section（完了 task / 検証 / 差分 / 次処理）を追加
      executing-plans) echo 8 ;;
      *) echo 3 ;;
    esac
  }

  for s in "${SKILLS[@]}"; do
    up=$(git show upstream/main:skills/$s/SKILL.md 2>/dev/null | grep -cE '^#{1,4} ' || echo 0)
    our=$(grep -cE '^#{1,4} ' "skills/$s/SKILL.md" 2>/dev/null || echo 0)
    diff=$((up - our))
    abs=${diff#-}
    # デフォルトは 3、skill 個別に override 可能
    allowance=$(skill_drift_allowance "$s")
    if [ "$abs" -le "$allowance" ]; then
      ok
    else
      warn "Skill structure drift: ${s} (upstream H=${up}, ours H=${our}) -- upstream v5.1.0 follow-up or intentional expansion may be needed"
    fi
  done

  # 3d. requesting-code-review/code-reviewer.md structure (v5.1.0 self-contained).
  up=$(git show upstream/main:skills/requesting-code-review/code-reviewer.md 2>/dev/null | grep -cE '^#{1,3} ' || echo 0)
  our=$(grep -cE '^#{1,3} ' skills/requesting-code-review/code-reviewer.md)
  diff=$((up - our))
  abs=${diff#-}
  if [ "$abs" -le "2" ]; then
    ok
  else
    bad "code-reviewer.md structure drift (upstream v5.1.0 self-contained, H=${up}; ours H=${our})"
  fi

  # 3e. Summary report for all local skills, including local-only Japanese additions.
  if node scripts/check-upstream-skill-drift.js upstream/main >/tmp/superpowers-ja-skill-drift.md 2>/dev/null; then
    ok
  else
    warn "Skill drift summary could not be generated"
  fi
fi

#==============================================================================
hdr "Category 4: Cross-reference integrity"
#==============================================================================

# 4a. README → docs/ 链接
BROKEN=0
while IFS= read -r link; do
  link=${link#(}; link=${link%)}
  if [ -f "$link" ]; then ok; else
    bad "Broken README link: $link"
    BROKEN=$((BROKEN+1))
  fi
done < <(grep -oE '\(docs/README\.[a-z-]+\.md\)' README.md)

# 4b. Skill 间引用（superpowers:xxx）
while IFS= read -r line; do
  skill_file=$(echo "$line" | cut -d: -f1)
  refs=$(echo "$line" | grep -oE '\bsuperpowers:[a-z-]+\b' | sort -u)
  for ref in $refs; do
    name=${ref#superpowers:}
    if [ -d "skills/$name" ]; then ok; else
      src=$(basename $(dirname "$skill_file"))
      bad "Broken skill reference: $src references missing skills/$name"
    fi
  done
done < <(grep -rln 'superpowers:' skills/*/SKILL.md 2>/dev/null | \
         xargs -I{} grep -H 'superpowers:' {} 2>/dev/null)

# 4c. .claude/skills/using-superpowers/SKILL.md must exist after install (hook dependency).
TMP=$(new_tmpdir)
pushd "$TMP" >/dev/null
if node "$INSTALLER" --tool claude >/dev/null 2>&1; then
  if [ -f "$TMP/.claude/skills/using-superpowers/SKILL.md" ]; then
    ok
  else
    bad "Missing .claude/skills/using-superpowers/SKILL.md after install (hook dependency)"
  fi
fi
popd >/dev/null

# 4d. Manual install docs should copy skill contents, not create nested skills/skills.
NESTED_SKILLS_REPORT=$(new_tmpfile)
if grep -RInE 'cp -r superpowers-ja/skills[[:space:]]+[^*]' docs/*.md >"$NESTED_SKILLS_REPORT" 2>/dev/null; then
  while IFS= read -r line; do
    bad "Manual install command may create nested skills directory: $line"
  done < "$NESTED_SKILLS_REPORT"
else
  ok
fi

#==============================================================================
echo ""
echo "=========================================="
echo "📊 Audit results"
echo "=========================================="
echo "✅ PASS: $PASS"
echo "⚠️  WARN: $WARN"
echo "❌ FAIL: $FAIL"

if [ "$WARN" -gt 0 ]; then
  echo ""
  echo "Warnings（non-blocking）:"
  for w in "${WARNINGS[@]}"; do echo "  ⚠️  $w"; done
fi

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "Failures（must fix）:"
  for f in "${FAILURES[@]}"; do echo "  ❌ $f"; done
  echo ""
  echo "❌ Audit failed: $FAIL P0 issue(s). See README 「品質監査」 for what each category means."
  exit 1
fi

echo ""
echo "✅ Audit passed"
exit 0
