#!/usr/bin/env node
// Sync package.json version into all plugin manifests, including nested fields.
// The npm version hook runs this before the version commit is created.
//
// Design note: use targeted regex replacement instead of JSON.parse + stringify
// so existing formatting (indentation, inline arrays, whitespace) is preserved.
// Each supported field path has its own regex.
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

// TARGETS mirrors upstream .version-bump.json shape: path + field path.
// Top-level fields use "version"; nested fields use dot-paths such as
// "plugins.0.version".
const TARGETS = [
  { path: '.claude-plugin/plugin.json',      field: 'version' },
  { path: '.cursor-plugin/plugin.json',      field: 'version' },
  { path: '.codex-plugin/plugin.json',       field: 'version' },
  { path: '.claude-plugin/marketplace.json', field: 'plugins.0.version' },
  { path: 'gemini-extension.json',           field: 'version' },
];

function buildPattern(field) {
  if (field === 'version') {
    return /("version"\s*:\s*")[^"]+(")/;
  }
  if (field === 'plugins.0.version') {
    // Anchor inside the first object under "plugins": [ { ... version
    return /("plugins"\s*:\s*\[\s*\{[\s\S]*?"version"\s*:\s*")[^"]+(")/;
  }
  throw new Error(`Unsupported field path: ${field}`);
}

function readField(json, field) {
  if (field === 'version') return json.version;
  if (field === 'plugins.0.version') return json.plugins?.[0]?.version;
  throw new Error(`Unsupported field path: ${field}`);
}

let touched = 0;
for (const { path: rel, field } of TARGETS) {
  const fullPath = resolve(root, rel);
  const text = readFileSync(fullPath, 'utf8');
  const json = JSON.parse(text);
  const current = readField(json, field);
  if (current === pkg.version) continue;

  const pattern = buildPattern(field);
  const updated = text.replace(pattern, `$1${pkg.version}$2`);
  if (updated === text) {
    throw new Error(`Could not locate field ${field} in ${rel}`);
  }
  writeFileSync(fullPath, updated, 'utf8');
  console.log(`  ${rel} (${field}): ${current} -> ${pkg.version}`);
  touched++;
}
if (touched === 0) console.log(`  plugin manifests already at ${pkg.version}`);
