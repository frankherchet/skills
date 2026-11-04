const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { join } = require('node:path');
const { readFileSync } = require('node:fs');

const script = join(__dirname, '..', 'plugins/xp/workflows/scripts/offline-node.mjs');
const workflow = join(__dirname, '..', 'plugins/xp/workflows/offline-review.yaml');
const sha = '1'.repeat(40); // Synthetic fixture fingerprint, not a real Git SHA.

function step(nodeId, { issue = '42', revision = sha, failReview = 'none', stdin } = {}) {
  const call = spawnSync(process.execPath, [script, nodeId, issue, revision, failReview], {
    encoding: 'utf8', input: stdin === undefined ? undefined : JSON.stringify(stdin), timeout: 5000,
  });
  return { ...call, result: call.stdout.trim() ? JSON.parse(call.stdout) : undefined };
}

function reviewers(failReview = 'none') {
  return Object.fromEntries(['review-traceability', 'review-impact'].map((name) => {
    const response = step(name, { failReview });
    assert.equal(response.status, 0);
    return [name, response.result];
  }));
}

test('fixture preflight emits a typed, identity-bound result', () => {
  const out = step('preflight');
  assert.equal(out.status, 0);
  assert.deepEqual([out.result.node_id, out.result.issue_id, out.result.input_sha, out.result.status],
    ['preflight', '42', sha, 'passed']);
  assert.equal(out.result.evidence.kind, 'offline-fixture');
});

test('two independent fake reviews join only when both pass', () => {
  const out = step('join', { stdin: reviewers() });
  assert.equal(out.status, 0);
  assert.equal(out.result.status, 'passed');
  assert.deepEqual(out.result.evidence.checked_nodes, ['review-traceability', 'review-impact']);
});

test('a failed review blocks the deterministic join', () => {
  const out = step('join', { stdin: reviewers('review-impact') });
  assert.equal(out.status, 0);
  assert.equal(out.result.status, 'failed');
});

test('wrong issue, SHA, node ID, or missing evidence fails closed', () => {
  const mutations = [
    (o) => { o['review-impact'].issue_id = '99'; },
    (o) => { o['review-impact'].input_sha = '2'.repeat(40); },
    (o) => { o['review-impact'].node_id = 'preflight'; },
    (o) => { delete o['review-impact'].evidence; },
    (o) => { delete o['review-impact']; },
    (o) => { o['review-impact'].status = 'completed'; },
  ];
  for (const mutate of mutations) {
    const outputs = reviewers();
    mutate(outputs);
    const out = step('join', { stdin: outputs });
    assert.equal(out.status, 2);
    assert.equal(out.stdout, ''); // No success-shaped JSON emitted on bad input.
    assert.match(out.stderr, /offline fixture rejected/);
  }
});

test('invalid identity, SHA, node and failure modes are rejected', () => {
  for (const [nodeId, opts] of [
    ['preflight', {issue: 'hello'}],
    ['preflight', {revision: 'not-a-sha'}],
    ['unknown', {}],
    ['preflight', {failReview: 'run-shell'}],
  ]) {
    const out = step(nodeId, opts);
    assert.equal(out.status, 2);
    assert.equal(out.stdout, '');
  }
});

test('Conductor fixture includes an explicit human gate and only script workers', () => {
  const text = readFileSync(workflow, 'utf8');
  assert.match(text, /entry_point: preflight/);
  assert.match(text, /name: parallel_reviews/);
  assert.match(text, /name: verify_join/);
  assert.match(text, /name: approval_gate\n    type: human_gate/);
  assert.match(text, /status: failed/);
  assert.doesNotMatch(text, /\b(type: agent|api_key:|base_url:)\b/);
  // Structural assertions are not a substitute for `conductor validate`.
});
