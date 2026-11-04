#!/usr/bin/env node
// Deterministic, side-effect-free XP Swarm fixture. Never invokes a model or GitHub.
// STDOUT is a *single* JSON object for Conductor's typed script-step contract.
const [nodeId, issueId, inputSha, failReview = 'none'] = process.argv.slice(2);
const reviews = ['review-traceability', 'review-impact'];
const supported = ['preflight', ...reviews, 'join'];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function checkIdentity() {
  assert(supported.includes(nodeId), 'unsupported fixture node');
  assert(typeof issueId === 'string' && /^[1-9]\d*$/.test(issueId), 'invalid issue ID');
  assert(typeof inputSha === 'string' && /^[0-9a-f]{40}$/.test(inputSha), 'invalid input SHA');
  assert(['none', ...reviews].includes(failReview), 'invalid simulated failure');
}

function result(status, evidence) {
  return {node_id: nodeId, issue_id: issueId, input_sha: inputSha, status, evidence};
}

async function readStdin() {
  let text = '';
  for await (const chunk of process.stdin) {
    text += chunk;
    assert(text.length <= 65536, 'review input too large');
  }
  assert(text.trim(), 'missing review inputs');
  return JSON.parse(text);
}

async function run() {
  checkIdentity();
  if (nodeId === 'preflight') {
    return result('passed', {kind: 'offline-fixture', checks: ['synthetic-sha-format']});
  }
  if (reviews.includes(nodeId)) {
    const passed = failReview !== nodeId;
    return result(passed ? 'passed' : 'failed', {
      kind: 'offline-fixture',
      check: nodeId,
      note: 'SIMULATED, not real test or CI evidence',
    });
  }
  const outputs = await readStdin();
  assert(outputs && typeof outputs === 'object' && !Array.isArray(outputs), 'invalid join payload');
  for (const name of reviews) {
    const value = outputs[name];
    assert(value && typeof value === 'object' && !Array.isArray(value), `missing ${name}`);
    assert(value.node_id === name, `wrong node ID in ${name}`);
    assert(value.issue_id === issueId, `issue ID mismatch in ${name}`);
    assert(value.input_sha === inputSha, `SHA mismatch in ${name}`);
    assert(['passed', 'failed'].includes(value.status), `invalid status in ${name}`);
    assert(value.evidence && value.evidence.kind === 'offline-fixture', `missing fixture evidence in ${name}`);
  }
  const passed = reviews.every((name) => outputs[name].status === 'passed');
  return result(passed ? 'passed' : 'failed', {
    kind: 'fixture-join',
    checked_nodes: reviews,
    note: 'SIMULATED only; real XP policy verifies SHA/tests/CI independently',
  });
}

try {
  const output = await run();
  process.stdout.write(JSON.stringify(output) + '\n');
} catch (error) {
  // No success-shaped JSON on invalid identity, corrupted evidence, or failed parsing.
  process.stderr.write(`offline fixture rejected: ${error.message}\n`);
  process.exitCode = 2;
}
