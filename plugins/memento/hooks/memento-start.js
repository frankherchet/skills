#!/usr/bin/env node
// memento: SessionStart hook for Claude Code, Codex and Copilot.
// Injects .memento/INDEX.md (or a short "memento is active" note) into the
// session context. Never fails the session: any error exits 0 silently.

const fs = require('fs');
const path = require('path');

const MAX_LINES = 150;
// Codex caps additionalContext at ~2,500 tokens by default; stay well below.
const MAX_BYTES = 6 * 1024;

const isCopilot = Boolean(process.env.COPILOT_PLUGIN_DATA) ||
  /[\\/]\.vscode[\\/].*agent-plugins/i.test(process.env.CLAUDE_PLUGIN_ROOT || '');

function readPayload() {
  if (process.stdin.isTTY) return {};
  try {
    const raw = fs.readFileSync(0, 'utf8').trim();
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function startDir(payload) {
  return process.env.CLAUDE_PROJECT_DIR || payload.cwd || process.cwd();
}

// Walk up from `dir` to the git root (inclusive). Returns the first directory
// holding .memento/INDEX.md, otherwise the git root (or `dir` outside git).
function findProjectRoot(dir) {
  let current = path.resolve(dir);
  while (true) {
    if (fs.existsSync(path.join(current, '.memento', 'INDEX.md'))) return current;
    if (fs.existsSync(path.join(current, '.git'))) return current;
    const parent = path.dirname(current);
    if (parent === current) return path.resolve(dir);
    current = parent;
  }
}

function truncate(text) {
  let lines = text.split('\n');
  let cut = false;
  if (lines.length > MAX_LINES) {
    lines = lines.slice(0, MAX_LINES);
    cut = true;
  }
  let out = lines.join('\n');
  if (Buffer.byteLength(out, 'utf8') > MAX_BYTES) {
    out = Buffer.from(out, 'utf8').subarray(0, MAX_BYTES).toString('utf8');
    out = out.slice(0, out.lastIndexOf('\n'));
    cut = true;
  }
  if (cut) out += '\n… (index truncated — read .memento/INDEX.md for the rest)';
  return out;
}

function buildContext(root) {
  const indexPath = path.join(root, '.memento', 'INDEX.md');
  if (!fs.existsSync(indexPath)) {
    return [
      'MEMENTO is active in this project (memento skill). There are no memos yet.',
      'When you learn something that a future session must know and that is not already in AGENTS.md, CLAUDE.md, README, code or git history,',
      'create a memo under .memento/ as described in the memento skill. Load that skill before writing your first memo.',
      'Write a memo as soon as you learn something, not at the end: compaction and session end give you no chance to.',
    ].join('\n');
  }
  const index = fs.readFileSync(indexPath, 'utf8').trim();
  return [
    'MEMENTO is active in this project (memento skill). Memos from earlier sessions live in .memento/.',
    'Index of .memento/INDEX.md (open a memo file when it is relevant to the task):',
    '',
    truncate(index),
    '',
    'Memos are clues, not truth: verify files, functions and flags they name before acting on them.',
    'Record new cross-session knowledge as memos; update or delete memos that turn out stale or wrong.',
    'Write a memo as soon as you learn something, not at the end: compaction and session end give you no chance to.',
    'Load the memento skill before writing or editing memos.',
  ].join('\n');
}

function emit(context) {
  if (isCopilot) {
    process.stdout.write(JSON.stringify({ additionalContext: context }));
    return;
  }
  // Claude Code and Codex share this shape.
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: context },
  }));
}

try {
  const payload = readPayload();
  emit(buildContext(findProjectRoot(startDir(payload))));
} catch (e) {
  // Never block a session over memos.
}
process.exit(0);
