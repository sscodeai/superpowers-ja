#!/usr/bin/env node

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, copyFileSync, lstatSync, realpathSync, rmSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

// Manual recursive copy keeps behavior consistent across Node versions and OSes.
// Avoid cpSync: Windows + npx cache paths with junctions were unstable on Node 16.7-18.
function copyDirSync(src, dest) {
  // Resolve junctions/symlinks so Windows npx cache paths do not appear empty.
  let realSrc = src;
  try { realSrc = realpathSync(src); } catch {}

  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(realSrc, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '.DS_Store') continue;
    const srcPath = join(realSrc, entry.name);
    const destPath = join(dest, entry.name);
    let stat;
    try { stat = lstatSync(srcPath); } catch { continue; }
    if (stat.isSymbolicLink()) {
      // Dereference and copy according to the real entry type.
      try {
        const real = realpathSync(srcPath);
        const realStat = lstatSync(real);
        if (realStat.isDirectory()) copyDirSync(real, destPath);
        else copyFileSync(real, destPath);
      } catch {}
    } else if (stat.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else if (stat.isFile()) {
      copyFileSync(srcPath, destPath);
    }
  }
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG = JSON.parse(readFileSync(resolve(__dirname, '..', 'package.json'), 'utf8'));
const SKILLS_SRC = resolve(__dirname, '..', 'skills');
const PROJECT_DIR = process.cwd();

// Legacy agent filenames: --uninstall removes leftovers from older user installs.
// Upstream v5.1.0 moved agents/code-reviewer.md into the requesting-code-review
// skill and removed agents/, but old installs may still have the file.
const LEGACY_AGENT_FILENAMES = ['code-reviewer.md'];

const TARGETS = [
  { name: 'Claude Code',   dir: '.claude/skills',           detect: '.claude' },
  { name: 'Cursor',        dir: '.cursor/skills',           detect: ['.cursor', '.cursorrules'] },
  { name: 'Codex CLI',     dir: '.codex/skills',            detect: '.codex' },
  { name: 'Kiro',          dir: '.kiro/steering',            detect: '.kiro' },
  { name: 'DeerFlow',      dir: 'skills/custom',             detect: 'deer_flow' },
  { name: 'Trae',          dir: '.trae/skills',              detect: '.trae' },
  { name: 'Antigravity',   dir: '.antigravity/skills',       detect: '.antigravity' },
  { name: 'VS Code',       dir: '.github/superpowers',       detect: '.github/copilot-instructions.md' },
  { name: 'OpenClaw',      dir: 'skills',                     detect: '.openclaw' },
  { name: 'Windsurf',      dir: '.windsurf/skills',          detect: '.windsurf' },
  { name: 'Gemini CLI',    dir: '.gemini/skills',            detect: 'GEMINI.md' },
  { name: 'Aider',         dir: '.aider/skills',             detect: '.aider' },
  { name: 'OpenCode',      dir: '.opencode/skills',          detect: '.opencode' },
  { name: 'Qwen Code',     dir: '.qwen/skills',             detect: '.qwen' },
  { name: 'Hermes Agent',  dir: '.hermes/skills',            detect: ['.hermes', 'HERMES.md', '.hermes.md'] },
  { name: 'Claw Code',     dir: '.claw/skills',              detect: ['.claw', 'CLAW.md'] },
];

function countDirs(dir) {
  if (!existsSync(dir)) return 0;
  return readdirSync(dir, { withFileTypes: true }).filter(e => e.isDirectory()).length;
}

function scanSkillEntries(skillsDir) {
  const entries = [];
  if (!existsSync(skillsDir)) return entries;
  for (const entry of readdirSync(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillFile = resolve(skillsDir, entry.name, 'SKILL.md');
    if (!existsSync(skillFile)) continue;
    const content = readFileSync(skillFile, 'utf8');
    const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!fmMatch) continue;
    const nameMatch = fmMatch[1].match(/^name:\s*(.+)$/m);
    const descMatch = fmMatch[1].match(/^description:\s*["']?(.+?)["']?\s*$/m);
    if (nameMatch) {
      entries.push({
        name: nameMatch[1].trim(),
        desc: descMatch ? descMatch[1].trim() : '',
      });
    }
  }
  return entries;
}

// Section sentinels: v1.2.1+ wraps appended bootstrap content in HTML comments
// so uninstall can remove it precisely without guessing from heading levels.
const SENTINEL_BEGIN = '<!-- superpowers-ja:begin (do not edit between these markers) -->';
const SENTINEL_END = '<!-- superpowers-ja:end -->';

function wrapWithSentinel(body) {
  return `${SENTINEL_BEGIN}\n${body.replace(/\n+$/, '')}\n${SENTINEL_END}\n`;
}

function buildBootstrapContent({ title = 'Superpowers-JA 日本語・日本 IT 開発版', skillsPath, skillEntries, toolNotes = '', useClaudeSkillTool = false }) {
  const skillList = skillEntries.map(s => `- **${s.name}**: ${s.desc}`).join('\n');
  const usage = useClaudeSkillTool
    ? 'タスクが skill に該当する場合は、`Skill` tool で対応する skill を読み込み、その手順に従ってください。`Read` tool で SKILL.md を直接読むのではなく、必ず skill として読み込んでください。'
    : `タスクが skill に該当する場合は、\`${skillsPath}<skill-name>/SKILL.md\` を読み込み、その手順に従ってください。`;

  return `# ${title}

superpowers-ja skill フレームワーク（${skillEntries.length} skills）を読み込んでいます。

## 基本ルール

1. **タスクを受けたら、該当する skill がないか先に確認する** — 1% でも可能性があれば確認する
2. **設計を実装より先に行う** — 機能追加や仕様変更では、まず brainstorming skill で要求と制約を整理する
3. **テストを実装より先に考える** — 可能な限り TDD で進める
4. **完了宣言より先に検証する** — 完了、修正済み、テスト済みと述べる前に検証コマンドを実行し、結果を確認する

## 利用可能な Skills

Skills は \`${skillsPath}\` 配下にあります。各 skill には独立した \`SKILL.md\` があります。

${skillList}
${toolNotes ? `\n${toolNotes}\n` : ''}
## 使い方

${usage}

1% でも該当しそうな skill があれば、実装や回答の前に確認してください。
`;
}

function generateTraeBootstrapRule(projectDir) {
  const rulesDir = resolve(projectDir, '.trae', 'rules');
  mkdirSync(rulesDir, { recursive: true });

  const skillEntries = scanSkillEntries(SKILLS_SRC);
  const skillTable = skillEntries.map(s => `| ${s.name} | ${s.desc} |`).join('\n');
  const rule = `---
alwaysApply: true
---

# Superpowers-JA 日本語・日本 IT 開発版

superpowers-ja skill フレームワーク（${skillEntries.length} skills）を読み込んでいます。

## 基本ルール

1. **タスクを受けたら、該当する skill がないか先に確認する** — 1% でも可能性があれば確認する
2. **設計を実装より先に行う** — 機能追加や仕様変更では、まず brainstorming skill で要求と制約を整理する
3. **テストを実装より先に考える** — 可能な限り TDD で進める
4. **完了宣言より先に検証する** — 完了、修正済み、テスト済みと述べる前に検証コマンドを実行し、結果を確認する

## 利用可能な Skills

Skills は \`.trae/skills/\` 配下にあります。各 skill には独立した \`SKILL.md\` があります。

| Skill | Trigger |
|-------|---------|
${skillTable}

## 使い方

タスクが skill に該当する場合は、対応する \`.trae/skills/<skill-name>/SKILL.md\` を読み込み、その手順に従ってください。
`;

  const rulePath = resolve(rulesDir, 'superpowers-ja.md');
  writeFileSync(rulePath, rule, 'utf8');
  console.log(`  ✅ Trae: bootstrap rule -> ${rulePath}`);
}

function generateKiroBootstrap(projectDir) {
  const skillEntries = scanSkillEntries(SKILLS_SRC);
  const content = buildBootstrapContent({
    title: 'Superpowers-JA 日本語・日本 IT 開発版',
    skillsPath: '.kiro/steering/',
    skillEntries,
  });
  const rule = `---
description: superpowers-ja skills framework をロードする
alwaysApply: true
---

${content}`;

  const rulePath = resolve(projectDir, '.kiro', 'steering', 'superpowers-ja.md');
  writeFileSync(rulePath, rule, 'utf8');
  console.log(`  ✅ Kiro: bootstrap steering -> ${rulePath}`);
}

function generateAntigravityBootstrap(projectDir) {
  const skillEntries = scanSkillEntries(SKILLS_SRC);
  const content = buildBootstrapContent({ skillsPath: '.antigravity/skills/', skillEntries });

  // Write .antigravity/rules.md without touching existing GEMINI.md / AGENTS.md.
  const rulePath = resolve(projectDir, '.antigravity', 'rules.md');
  writeFileSync(rulePath, content, 'utf8');
  console.log(`  ✅ Antigravity: bootstrap rule -> ${rulePath}`);
}

function generateAiderBootstrap(projectDir) {
  const skillEntries = scanSkillEntries(SKILLS_SRC);
  const content = buildBootstrapContent({
    title: 'Superpowers-JA 日本 IT 開発ワークフロー',
    skillsPath: '.aider/skills/',
    skillEntries,
  });

  // Write CONVENTIONS.md, which Aider loads natively.
  // Append to existing files instead of overwriting them.
  const convPath = resolve(projectDir, 'CONVENTIONS.md');
  if (existsSync(convPath)) {
    const existing = readFileSync(convPath, 'utf8');
    if (!existing.includes('superpowers-ja')) {
      writeFileSync(convPath, existing.replace(/\s+$/, '') + '\n\n' + wrapWithSentinel(content), 'utf8');
      console.log(`  ✅ Aider: skills 参照を追記 -> ${convPath}`);
    } else {
      console.log(`  ✅ Aider: CONVENTIONS.md superpowers-ja 参照は既に存在します`);
    }
  } else {
    writeFileSync(convPath, wrapWithSentinel(content), 'utf8');
    console.log(`  ✅ Aider: bootstrap -> ${convPath}`);
  }
}

function generateGeminiBootstrap(projectDir) {
  const skillEntries = scanSkillEntries(SKILLS_SRC);
  const content = buildBootstrapContent({ skillsPath: '.gemini/skills/', skillEntries });

  // Write GEMINI.md, appending if the file already exists.
  const geminiPath = resolve(projectDir, 'GEMINI.md');
  if (existsSync(geminiPath)) {
    const existing = readFileSync(geminiPath, 'utf8');
    if (!existing.includes('superpowers-ja')) {
      writeFileSync(geminiPath, existing.replace(/\s+$/, '') + '\n\n' + wrapWithSentinel(content), 'utf8');
      console.log(`  ✅ Gemini CLI: skills 参照を追記 -> ${geminiPath}`);
    } else {
      console.log(`  ✅ Gemini CLI: GEMINI.md superpowers-ja 参照は既に存在します`);
    }
  } else {
    writeFileSync(geminiPath, wrapWithSentinel(content), 'utf8');
    console.log(`  ✅ Gemini CLI: bootstrap -> ${geminiPath}`);
  }
}

function generateHermesBootstrap(projectDir) {
  const skillEntries = scanSkillEntries(SKILLS_SRC);
  const toolNotes = `## Tool Mapping

skills が参照する Claude Code tool は、Hermes Agent では次の tool に読み替えてください:
- \`Read\` → \`read_file\`
- \`Write\` → \`write_file\`
- \`Edit\` → \`patch\`
- \`Bash\` → \`terminal\`
- \`Grep\` / \`Glob\` → \`search_files\`
- \`Skill\` → \`skill_view\`
- \`Task\`（sub-agent） → \`delegate_task\`
- \`WebSearch\` → \`web_search\`
- \`WebFetch\` → \`web_extract\`
- \`TodoWrite\` → \`todo\``;
  const content = buildBootstrapContent({
    skillsPath: '.hermes/skills/',
    skillEntries,
    toolNotes,
  });

  // Write HERMES.md, appending if the file already exists.
  const hermesPath = resolve(projectDir, 'HERMES.md');
  if (existsSync(hermesPath)) {
    const existing = readFileSync(hermesPath, 'utf8');
    if (!existing.includes('superpowers-ja')) {
      writeFileSync(hermesPath, existing.replace(/\s+$/, '') + '\n\n' + wrapWithSentinel(content), 'utf8');
      console.log(`  ✅ Hermes Agent: skills 参照を追記 -> ${hermesPath}`);
    } else {
      console.log(`  ✅ Hermes Agent: HERMES.md superpowers-ja 参照は既に存在します`);
    }
  } else {
    writeFileSync(hermesPath, wrapWithSentinel(content), 'utf8');
    console.log(`  ✅ Hermes Agent: bootstrap -> ${hermesPath}`);
  }
}

function generateClaudeCodeBootstrap(projectDir) {
  const skillEntries = scanSkillEntries(SKILLS_SRC);
  const content = buildBootstrapContent({
    skillsPath: '.claude/skills/',
    skillEntries,
    useClaudeSkillTool: true,
  });

  const mdPath = resolve(projectDir, 'CLAUDE.md');
  if (existsSync(mdPath)) {
    const existing = readFileSync(mdPath, 'utf8');
    if (!existing.includes('superpowers-ja')) {
      writeFileSync(mdPath, existing.replace(/\s+$/, '') + '\n\n' + wrapWithSentinel(content), 'utf8');
      console.log(`  ✅ Claude Code: skills 参照を追記 -> ${mdPath}`);
    } else {
      console.log(`  ✅ Claude Code: CLAUDE.md superpowers-ja 参照は既に存在します`);
    }
  } else {
    writeFileSync(mdPath, wrapWithSentinel(content), 'utf8');
    console.log(`  ✅ Claude Code: bootstrap -> ${mdPath}`);
  }
}

// Tool aliases from user input to TARGETS.name.
const TOOL_ALIASES = {
  'claude':       'Claude Code',
  'claude-code':  'Claude Code',
  'claudecode':   'Claude Code',
  'copilot':      'Claude Code',
  'copilot-cli':  'Claude Code',
  'cursor':       'Cursor',
  'codex':        'Codex CLI',
  'kiro':         'Kiro',
  'deerflow':     'DeerFlow',
  'trae':         'Trae',
  'antigravity':  'Antigravity',
  'vscode':       'VS Code',
  'vs-code':      'VS Code',
  'openclaw':     'OpenClaw',
  'windsurf':     'Windsurf',
  'gemini':       'Gemini CLI',
  'gemini-cli':   'Gemini CLI',
  'aider':        'Aider',
  'opencode':     'OpenCode',
  'qwen':         'Qwen Code',
  'qwen-code':    'Qwen Code',
  'hermes':       'Hermes Agent',
  'hermes-agent': 'Hermes Agent',
  'claw':         'Claw Code',
  'claw-code':    'Claw Code',
  'clawcode':     'Claw Code',
};

function showHelp() {
  console.log(`
  superpowers-ja v${PKG.version} — Superpowers 日本語・日本 IT 開発版

  Usage:
    npx superpowers-ja                   AI coding tool を自動検出してインストール
    npx superpowers-ja --tool cursor     tool を明示してインストール
    npx superpowers-ja --list-tools      対応 tool と install 先を表示
    npx superpowers-ja --uninstall       現在のディレクトリからアンインストール
    npx superpowers-ja --force           ホームディレクトリへのインストールを許可（非推奨）
    npx superpowers-ja --help            ヘルプを表示
    npx superpowers-ja --version         バージョンを表示

  Supported tool names:
    ${Object.keys(TOOL_ALIASES).join(', ')}

  Notes:
    現在のプロジェクトで使われている AI coding tool を検出し、
    ${countDirs(SKILLS_SRC)} skills を対応ディレクトリへコピーします。
    自動検出できない場合は --tool を指定してください:
      npx superpowers-ja --tool cursor
      npx superpowers-ja --tool claude

    誤ってホームディレクトリへ入れた場合:
      cd ~ && npx superpowers-ja --uninstall

  Project: https://github.com/sscodeai/superpowers-ja
`);
}

function aliasesForTarget(targetName) {
  return Object.entries(TOOL_ALIASES)
    .filter(([, name]) => name === targetName)
    .map(([alias]) => alias)
    .join(', ');
}

function formatDetect(detect) {
  return (Array.isArray(detect) ? detect : [detect]).join(', ');
}

function listTools() {
  console.log(`\n  superpowers-ja v${PKG.version} — 対応 tool 一覧\n`);
  console.log(`  Skills: ${countDirs(SKILLS_SRC)}`);
  console.log('  Install is project-local. Run from the project directory, not from ~/.');
  console.log('');
  console.log('  Tool                 Alias                         Install path              Auto-detect');
  console.log('  -------------------  ----------------------------  ------------------------  ------------------------------');
  for (const target of TARGETS) {
    const name = target.name.padEnd(19);
    const aliases = aliasesForTarget(target.name).padEnd(28);
    const dir = target.dir.padEnd(24);
    console.log(`  ${name}  ${aliases}  ${dir}  ${formatDetect(target.detect)}`);
  }
  console.log('');
  console.log('  Example: npx superpowers-ja --tool claude');
  console.log('');
}

function installForTarget(target) {
  const dest = resolve(PROJECT_DIR, target.dir);
  const srcCount = countDirs(SKILLS_SRC);
  mkdirSync(dest, { recursive: true });
  copyDirSync(SKILLS_SRC, dest);
  const totalAfter = countDirs(dest);
  if (srcCount > 0 && totalAfter === 0) {
    throw new Error(
      `Failed to copy skills: source ${SKILLS_SRC} has ${srcCount} skills, but target ${dest} is empty.` +
      `\n  This is usually caused by npx cache or path permission issues. Try:\n` +
      `    1. npm cache clean --force && npx superpowers-ja\n` +
      `    2. npm i -g superpowers-ja && superpowers-ja\n` +
      `    3. Clone manually and copy skills: https://github.com/sscodeai/superpowers-ja`
    );
  }
  console.log(`  ✅ ${target.name}: ${srcCount} skills -> ${dest}`);

  if (target.name === 'Trae') {
    generateTraeBootstrapRule(PROJECT_DIR);
  }

  if (target.name === 'Kiro') {
    generateKiroBootstrap(PROJECT_DIR);
  }

  if (target.name === 'Antigravity') {
    generateAntigravityBootstrap(PROJECT_DIR);
  }

  if (target.name === 'Aider') {
    generateAiderBootstrap(PROJECT_DIR);
  }

  if (target.name === 'Gemini CLI') {
    generateGeminiBootstrap(PROJECT_DIR);
  }

  if (target.name === 'Hermes Agent') {
    generateHermesBootstrap(PROJECT_DIR);
  }

  if (target.name === 'Claude Code') {
    generateClaudeCodeBootstrap(PROJECT_DIR);
  }
}

function isHomeDir(p) {
  const home = homedir();
  if (!home) return false;
  try {
    return realpathSync(p) === realpathSync(home);
  } catch { return resolve(p) === resolve(home); }
}

// Bootstrap files removed or cleaned during uninstall.
const BOOTSTRAP_DELETE = [
  '.trae/rules/superpowers-ja.md',
  '.kiro/steering/superpowers-ja.md',
  '.antigravity/rules.md',
];
const BOOTSTRAP_CLEAN_SECTION = [
  'CLAUDE.md',
  'GEMINI.md',
  'HERMES.md',
  'CONVENTIONS.md',
];
const BOOTSTRAP_SECTION_MARKERS = [
  '# Superpowers-JA 日本語・日本 IT 開発版',
  '# Superpowers-JA 日本 IT 開発ワークフロー',
];

// Older bootstrap sections may not have sentinels. These tail hints let
// uninstall find the section end without touching user-authored content.
const FALLBACK_TAIL_HINTS = [
  '実装や回答の前に確認してください。',
  'その手順に従ってください。',
];

function writeOrDelete(filePath, head, tail) {
  const headTrim = head.replace(/\s+$/, '');
  const tailTrim = tail.replace(/^\s+/, '');
  let body = headTrim;
  if (headTrim && tailTrim) body += '\n\n' + tailTrim;
  else body += tailTrim;
  body = body.replace(/\s+$/, '');
  if (body.length === 0) {
    rmSync(filePath);
  } else {
    writeFileSync(filePath, body + '\n', 'utf8');
  }
}

function cleanBootstrapSection(filePath) {
  if (!existsSync(filePath)) return false;
  const content = readFileSync(filePath, 'utf8');

  // 1. Sentinel mode.
  const sBegin = content.indexOf(SENTINEL_BEGIN);
  if (sBegin !== -1) {
    const sEnd = content.indexOf(SENTINEL_END, sBegin + SENTINEL_BEGIN.length);
    if (sEnd !== -1) {
      writeOrDelete(filePath, content.slice(0, sBegin), content.slice(sEnd + SENTINEL_END.length));
      return true;
    }
  }

  // 2. Fallback marker mode.
  let idx = -1;
  for (const marker of BOOTSTRAP_SECTION_MARKERS) {
    const i = content.indexOf(marker);
    if (i !== -1 && (idx === -1 || i < idx)) idx = i;
  }
  if (idx === -1) return false;

  let end = -1;
  const nextHeading = content.indexOf('\n# ', idx + 1);
  if (nextHeading !== -1) end = nextHeading + 1;

  // 3. Tail-hint fallback.
  if (end === -1) {
    for (const hint of FALLBACK_TAIL_HINTS) {
      const i = content.lastIndexOf(hint);
      if (i > idx) {
        const nl = content.indexOf('\n', i + hint.length);
        const after = nl !== -1 ? nl + 1 : content.length;
        if (after > end) end = after;
      }
    }
  }

  if (end === -1) {
    console.warn(`  ⚠️  ${filePath}: could not safely identify the end of the superpowers-ja section; skipped to avoid data loss.`);
    console.warn(`     Please remove the section starting with "${BOOTSTRAP_SECTION_MARKERS[0]}" manually.`);
    return false;
  }

  writeOrDelete(filePath, content.slice(0, idx), content.slice(end));
  return true;
}

function uninstallForTarget(target, srcSkillNames) {
  const dest = resolve(PROJECT_DIR, target.dir);
  if (!existsSync(dest)) return 0;
  let removed = 0;
  for (const entry of readdirSync(dest, { withFileTypes: true })) {
    if (entry.isDirectory() && srcSkillNames.has(entry.name)) {
      rmSync(resolve(dest, entry.name), { recursive: true, force: true });
      removed++;
    }
  }
  // Remove the target directory if it is empty except for .DS_Store.
  try {
    if (existsSync(dest)) {
      const left = readdirSync(dest).filter(n => n !== '.DS_Store');
      if (left.length === 0) rmSync(dest, { recursive: true, force: true });
    }
  } catch {}
  return removed;
}

function uninstall() {
  console.log(`\n  superpowers-ja v${PKG.version} — アンインストール\n`);
  console.log(`  Target project: ${PROJECT_DIR}\n`);

  if (!existsSync(SKILLS_SRC)) {
    console.error('  ❌ Error: skills source directory was not found, so uninstall cannot identify installed skills.');
    process.exit(1);
  }

  const srcSkillNames = new Set(
    readdirSync(SKILLS_SRC, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => e.name)
  );

  let totalSkills = 0;
  for (const target of TARGETS) {
    const removed = uninstallForTarget(target, srcSkillNames);
    if (removed > 0) {
      console.log(`  ✅ ${target.name}: removed ${removed} skills <- ${resolve(PROJECT_DIR, target.dir)}`);
      totalSkills += removed;
    }
  }

  // Remove legacy .claude/agents files installed by older versions.
  // v1.3.0 followed upstream v5.1.0 and removed the source agents/ directory,
  // but --uninstall should still clean old installed copies.
  const agentsDest = resolve(PROJECT_DIR, '.claude', 'agents');
  if (existsSync(agentsDest)) {
    let agentsRemoved = 0;
    for (const entry of readdirSync(agentsDest)) {
      if (LEGACY_AGENT_FILENAMES.includes(entry)) {
        rmSync(resolve(agentsDest, entry), { recursive: true, force: true });
        agentsRemoved++;
      }
    }
    if (agentsRemoved > 0) console.log(`  ✅ Claude Code agents: removed ${agentsRemoved} legacy files -> ${agentsDest}`);
    try {
      const left = readdirSync(agentsDest).filter(n => n !== '.DS_Store');
      if (left.length === 0) rmSync(agentsDest, { recursive: true, force: true });
    } catch {}
  }

  let bootstrapsRemoved = 0;
  for (const rel of BOOTSTRAP_DELETE) {
    const full = resolve(PROJECT_DIR, rel);
    if (existsSync(full)) {
      rmSync(full);
      console.log(`  ✅ removed bootstrap: ${full}`);
      bootstrapsRemoved++;
    }
  }
  for (const rel of BOOTSTRAP_CLEAN_SECTION) {
    const full = resolve(PROJECT_DIR, rel);
    if (cleanBootstrapSection(full)) {
      console.log(`  ✅ cleaned bootstrap: ${full}`);
      bootstrapsRemoved++;
    }
  }

  if (totalSkills === 0 && bootstrapsRemoved === 0) {
    console.log('  ⚠️  No superpowers-ja installation was found in the current directory.');
  } else {
    console.log(`\n  Uninstall complete. Removed ${totalSkills} skill directories and ${bootstrapsRemoved} bootstrap files.\n`);
  }
}

function install(forceToolName, force) {
 try {
  console.log(`\n  superpowers-ja v${PKG.version} — Superpowers 日本語・日本 IT 開発版\n`);

  if (!existsSync(SKILLS_SRC)) {
    console.error('  ❌ Error: skills source directory was not found. Please reinstall superpowers-ja.');
    process.exit(1);
  }

  if (!force && isHomeDir(PROJECT_DIR)) {
    console.error(
`  ⚠️  現在のディレクトリはホームディレクトリです: ${PROJECT_DIR}

  superpowers-ja は ~/ ではなく、具体的なプロジェクトディレクトリにインストールしてください。
  ホームにインストールすると skills と bootstrap ファイル（CLAUDE.md / HERMES.md など）が home に書き込まれ、全プロジェクトに影響します。

  先にプロジェクトへ移動してください:
    cd /path/to/your/project
    npx superpowers-ja

  どうしてもホームへ入れる場合（非推奨）は --force を付けてください:
    npx superpowers-ja --force

  誤ってホームに入れた場合は --uninstall で削除できます:
    npx superpowers-ja --uninstall
`);
    process.exit(1);
  }

  console.log(`  Source: ${countDirs(SKILLS_SRC)} skills`);
  console.log(`  Target project: ${PROJECT_DIR}\n`);

  // Explicit --tool install.
  if (forceToolName) {
    const target = TARGETS.find(t => t.name === forceToolName);
    if (!target) {
      console.error(`  ❌ Unknown tool: ${forceToolName}`);
      process.exit(1);
    }
    installForTarget(target);
    console.log('\n  インストール完了。AI coding tool を再起動すると有効になります。\n');
    return;
  }

  // Auto-detect tools.
  let installed = 0;

  for (const target of TARGETS) {
    const detects = Array.isArray(target.detect) ? target.detect : [target.detect];
    const found = detects.some(d => existsSync(resolve(PROJECT_DIR, d)));
    if (found) {
      installForTarget(target);
      installed++;
    }
  }

  if (installed === 0) {
    console.log('  ⚠️  既知の AI coding tool を検出できませんでした。\n');
    console.log('  Cursor などを使っている場合は --tool で指定してください:');
    console.log('    npx superpowers-ja --tool cursor');
    console.log('    npx superpowers-ja --tool claude\n');
    console.log('  デフォルトで .claude/skills/ にインストールします（Claude Code 互換）。\n');

    const dest = resolve(PROJECT_DIR, '.claude', 'skills');
    mkdirSync(dest, { recursive: true });
    copyDirSync(SKILLS_SRC, dest);
    console.log(`  ✅ Default install: ${countDirs(dest)} skills -> ${dest}`);

    generateClaudeCodeBootstrap(PROJECT_DIR);
  }

  console.log('\n  インストール完了。AI coding tool を再起動すると有効になります。\n');
 } catch (err) {
    console.error(`  ❌ Install failed: ${err.message}`);
    process.exit(1);
 }
}

const args = process.argv.slice(2);
const helpIdx = args.findIndex(a => a === '--help' || a === '-h');
const versionIdx = args.findIndex(a => a === '--version' || a === '-v');
const listToolsIdx = args.findIndex(a => a === '--list-tools' || a === '--tools');
const toolIdx = args.findIndex(a => a === '--tool' || a === '-t');
const uninstallIdx = args.findIndex(a => a === '--uninstall' || a === '-u');
const forceIdx = args.findIndex(a => a === '--force' || a === '-f');
const force = forceIdx !== -1;

if (helpIdx !== -1) {
  showHelp();
} else if (versionIdx !== -1) {
  console.log(PKG.version);
} else if (listToolsIdx !== -1) {
  listTools();
} else if (uninstallIdx !== -1) {
  uninstall();
} else if (toolIdx !== -1) {
  const toolArg = args[toolIdx + 1];
  if (!toolArg) {
    console.error('  ❌ --tool requires a tool name, for example: --tool cursor\n');
    showHelp();
    process.exit(1);
  }
  const toolName = TOOL_ALIASES[toolArg.toLowerCase()];
  if (!toolName) {
    console.error(`  ❌ Unknown tool: ${toolArg}`);
    console.error(`  Supported tools: ${Object.keys(TOOL_ALIASES).join(', ')}\n`);
    process.exit(1);
  }
  install(toolName, force);
} else if (args.length > 0 && args[0].startsWith('-') && forceIdx === -1) {
  console.warn(`  Unknown option: ${args[0]}\n`);
  showHelp();
  process.exit(1);
} else {
  install(undefined, force);
}
