#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync } from 'fs';
import { dirname, join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const upstreamRef = process.argv[2] || 'upstream/main';

function gitShow(path) {
  try {
    return execFileSync('git', ['show', `${upstreamRef}:${path}`], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return null;
  }
}

function listLocalSkills() {
  const skillsDir = resolve(root, 'skills');
  return readdirSync(skillsDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && existsSync(join(skillsDir, entry.name, 'SKILL.md')))
    .map(entry => entry.name)
    .sort();
}

function headings(text) {
  return text
    .split('\n')
    .filter(line => /^#{1,4} /.test(line))
    .map(line => line.trim());
}

function listFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(full));
    } else if (entry.isFile()) {
      files.push(full);
    }
  }
  return files.sort();
}

function upstreamFilesForSkill(skill) {
  const tree = (() => {
    try {
      return execFileSync('git', ['ls-tree', '-r', '--name-only', upstreamRef, `skills/${skill}`], {
        cwd: root,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
    } catch {
      return '';
    }
  })();
  return tree.split('\n').filter(Boolean).sort();
}

const rows = [];

for (const skill of listLocalSkills()) {
  const localSkillPath = `skills/${skill}/SKILL.md`;
  const upstreamSkill = gitShow(localSkillPath);
  if (!upstreamSkill) {
    rows.push({ skill, status: 'local-only', upstreamHeadings: 0, localHeadings: headings(readFileSync(resolve(root, localSkillPath), 'utf8')).length, missingFiles: 0, extraFiles: 0 });
    continue;
  }

  const localSkill = readFileSync(resolve(root, localSkillPath), 'utf8');
  const upstreamHeadingCount = headings(upstreamSkill).length;
  const localHeadingCount = headings(localSkill).length;

  const upstreamFiles = new Set(upstreamFilesForSkill(skill).map(path => relative(`skills/${skill}`, path).replace(/^\.\.\//, '')));
  const localFiles = new Set(listFiles(resolve(root, 'skills', skill)).map(path => relative(resolve(root, 'skills', skill), path)));
  const missingFiles = [...upstreamFiles].filter(path => !localFiles.has(path)).length;
  const extraFiles = [...localFiles].filter(path => !upstreamFiles.has(path)).length;

  rows.push({
    skill,
    status: 'tracked',
    upstreamHeadings: upstreamHeadingCount,
    localHeadings: localHeadingCount,
    headingDelta: localHeadingCount - upstreamHeadingCount,
    missingFiles,
    extraFiles,
  });
}

console.log('| Skill | Status | Upstream H | Local H | Delta | Missing upstream files | Local extra files |');
console.log('| --- | --- | ---: | ---: | ---: | ---: | ---: |');
for (const row of rows) {
  console.log([
    `| \`${row.skill}\``,
    row.status,
    row.upstreamHeadings,
    row.localHeadings,
    row.headingDelta ?? '',
    row.missingFiles,
    row.extraFiles,
  ].join(' | ') + ' |');
}

const tracked = rows.filter(row => row.status === 'tracked');
const changed = tracked.filter(row => row.headingDelta !== 0 || row.missingFiles > 0);

if (changed.length > 0) {
  console.log('');
  console.log(`Detected ${changed.length} skill(s) with structural drift. Review whether each is intentional Japanese adaptation or upstream follow-up work.`);
}
