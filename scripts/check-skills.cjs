'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const ODL = path.join(ROOT, 'odl');
const SNAKE = /[a-z0-9]+_[a-z0-9_]+/;

function fail(message) {
  console.error(`check-skills: ${message}`);
  process.exit(1);
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(abs));
    } else if (entry.isFile()) {
      out.push(abs);
    }
  }
  return out;
}

function parseFrontmatter(raw) {
  if (!raw.startsWith('---')) {
    return {};
  }
  const end = raw.indexOf('\n---', 3);
  if (end < 0) {
    return {};
  }
  const block = raw.slice(3, end).trim();
  const out = {};
  let key = null;
  let folded = [];
  const flush = () => {
    if (key) {
      out[key] = folded.join(' ').replace(/\s+/g, ' ').trim();
    }
    key = null;
    folded = [];
  };
  for (const line of block.split(/\r?\n/)) {
    const foldedStart = /^([A-Za-z0-9_-]+):\s*[>|]-?\s*$/.exec(line);
    if (foldedStart) {
      flush();
      key = foldedStart[1];
      continue;
    }
    const simple = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (simple && !line.startsWith(' ')) {
      flush();
      out[simple[1]] = simple[2].trim();
      continue;
    }
    if (key && /^\s+/.test(line)) {
      folded.push(line.trim());
    }
  }
  flush();
  return out;
}

function main() {
  if (!fs.existsSync(ODL)) {
    fail('odl/ directory missing');
  }

  const files = walk(ODL);
  const skillFiles = files.filter((f) => path.basename(f) === 'SKILL.md');
  if (skillFiles.length === 0) {
    fail('no odl/**/SKILL.md files found');
  }

  for (const abs of files) {
    const rel = path.relative(ODL, abs).replace(/\\/g, '/');
    const base = path.basename(abs);
    if (base !== 'SKILL.md' && SNAKE.test(base)) {
      fail(`snake_case filename under odl/: ${rel}`);
    }
  }

  for (const abs of skillFiles) {
    const dirName = path.basename(path.dirname(abs));
    const raw = fs.readFileSync(abs, 'utf8');
    const fm = parseFrontmatter(raw);
    if (fm.name !== dirName) {
      fail(`${path.relative(ROOT, abs)}: frontmatter name "${fm.name ?? ''}" must equal dirname "${dirName}"`);
    }
    if (!fm.description) {
      fail(`${path.relative(ROOT, abs)}: missing description`);
    }

    const linkRe = /\[[^\]]*\]\(([^)]+)\)/g;
    let match;
    while ((match = linkRe.exec(raw)) !== null) {
      const href = match[1].split('#')[0].split('?')[0];
      if (!href || href.startsWith('http') || href.startsWith('mailto:')) {
        continue;
      }
      if (href.startsWith('docs/')) {
        continue;
      }
      const target = path.resolve(path.dirname(abs), href);
      if (!fs.existsSync(target)) {
        fail(`${path.relative(ROOT, abs)}: broken relative link ${href}`);
      }
    }
  }

  console.log(`check-skills: OK (${skillFiles.length} skills)`);
}

main();
