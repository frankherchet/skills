const { test } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const HOOK = path.join(__dirname, '..', 'plugins', 'memento', 'hooks', 'memento-start.js');

const HOSTS = {
  claude: { CLAUDE_PLUGIN_ROOT: '/tmp/plugin' },
  codex: { CLAUDE_PLUGIN_ROOT: '/tmp/plugin', PLUGIN_ROOT: '/tmp/plugin', PLUGIN_DATA: '/tmp/data' },
  copilot: { PLUGIN_ROOT: '/tmp/plugin', COPILOT_PLUGIN_DATA: '/tmp/data' },
};

function tmpProject() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'memento-'));
  fs.mkdirSync(path.join(dir, '.git'));
  return dir;
}

function run(host, { cwd, input = '' }) {
  const env = { PATH: process.env.PATH, ...HOSTS[host] };
  const res = spawnSync(process.execPath, [HOOK], { cwd, env, input, encoding: 'utf8' });
  assert.strictEqual(res.status, 0, res.stderr);
  return res.stdout ? JSON.parse(res.stdout) : null;
}

function contextOf(host, out) {
  return host === 'copilot' ? out.additionalContext : out.hookSpecificOutput.additionalContext;
}

for (const host of Object.keys(HOSTS)) {
  test(`${host}: no .memento → activation note`, () => {
    const out = run(host, { cwd: tmpProject() });
    if (host === 'copilot') assert.ok(!out.hookSpecificOutput);
    else assert.strictEqual(out.hookSpecificOutput.hookEventName, 'SessionStart');
    assert.match(contextOf(host, out), /no memos yet/);
  });

  test(`${host}: INDEX.md is injected, found from subdirectory via payload cwd`, () => {
    const dir = tmpProject();
    fs.mkdirSync(path.join(dir, '.memento'));
    fs.writeFileSync(path.join(dir, '.memento', 'INDEX.md'), '- [Foo](foo.md) — gotcha — bar baz\n');
    const sub = path.join(dir, 'src', 'deep');
    fs.mkdirSync(sub, { recursive: true });
    const out = run(host, { cwd: os.tmpdir(), input: JSON.stringify({ cwd: sub }) });
    assert.match(contextOf(host, out), /\[Foo\]\(foo\.md\) — gotcha — bar baz/);
  });
}

test('large index is truncated', () => {
  const dir = tmpProject();
  fs.mkdirSync(path.join(dir, '.memento'));
  const lines = Array.from({ length: 500 }, (_, i) => `- [Memo ${i}](m${i}.md) — context — ${'x'.repeat(40)}`);
  fs.writeFileSync(path.join(dir, '.memento', 'INDEX.md'), lines.join('\n'));
  const ctx = contextOf('claude', run('claude', { cwd: dir }));
  assert.match(ctx, /index truncated/);
  assert.ok(!ctx.includes('Memo 499'));
  assert.ok(Buffer.byteLength(ctx) < 10 * 1024);
});

test('garbage stdin and missing dirs never fail', () => {
  const out = run('claude', { cwd: tmpProject(), input: '{not json' });
  assert.ok(out);
  const res = spawnSync(process.execPath, [HOOK], {
    env: { PATH: process.env.PATH, CLAUDE_PROJECT_DIR: '/does/not/exist' },
    input: '', encoding: 'utf8',
  });
  assert.strictEqual(res.status, 0);
});
