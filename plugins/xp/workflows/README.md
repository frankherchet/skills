# XP Swarm — Conductor integration spike (offline fixture)

This directory is an **experiment**, not a production XP workflow. Its first goal is to check whether [Microsoft Conductor](https://github.com/microsoft/conductor) can orchestrate our contracts without writing another scheduler. **No LLM, API key, Copilot subscription, GitHub mutation or AWS account is needed** for the *fixture worker code*. The Conductor CLI itself is still an external runtime dependency.

## What is included

- `offline-review.yaml`: actual **Conductor-style YAML**, not the proposed XP `nodes:/needs:` DSL. A script preflight fans out to two script reviewers, joins their structured JSON outputs, and asks a human for approval. Failure routes to an explicit failed termination. The declared `copilot` runtime is only a schema default; **there are no agent/SDK steps**.
- `scripts/offline-node.mjs`: dependency-free, deterministic fake workers. STDOUT is one JSON object; failure diagnostics go to STDERR. Preflight checks ID/SHA format; join rejects missing, malformed or mismatched review identities. **All evidence is synthetic and must never authorize a real PR/merge.**
- `tests/xp-swarm-offline.test.js`: offline local tests (`npm test`) exercise contract/failure behavior without launching Conductor.

## Reproducible manual spike (Conductor required)

Install a **pinned, reviewed Conductor commit** in a disposable virtual environment (do not install into the consuming project's dependency tree), then from this repository's root:

```bash
npm test
conductor validate plugins/xp/workflows/offline-review.yaml
conductor run plugins/xp/workflows/offline-review.yaml --web \
  --input issue_id="42" \
  --input input_sha="1111111111111111111111111111111111111111"
```

At the human gate, manually approve or reject. Conductor must **not** decide the gate on its own. To exercise a failed review (the human gate should not be reached):

```bash
conductor run plugins/xp/workflows/offline-review.yaml \
  --input issue_id="42" \
  --input input_sha="1111111111111111111111111111111111111111" \
  --input fail_review="review-impact"
```

To inspect the existing MCP interface separately:

```bash
conductor mcp serve --workflow-dir plugins/xp/workflows \
  --allow 'xp-swarm-*' --max-wait-seconds 0
```

MCP is **stdio**: configure a real MCP host to launch this command. Do not expect it to expose an HTTP endpoint. The dashboard started by `--web` binds to loopback; its Docker/browser ingress needs a separate secured solution.

## Status / limitations

- **Verified locally:** YAML parses as YAML; the Node.js fake-worker outputs and adversarial join cases run in isolation. This repository has no Conductor installation or networked model credentials in the review environment.
- **Not yet verified:** `conductor validate`, parallel dispatch, checkpoint/resume, dashboard, MCP launch from two harnesses, correct provider-free execution, authenticated Docker/AgentCore deployments, or SDK/CLI BYOK behavior. **Do not mark #9's Conductor spike complete without executing these checks.**
- `input_sha` is a synthetic 40-hex fixture token; it is *not* checked against Git. Production XP contracts require independently verified Git SHA, tests, CI and durable side-effect receipts. No worker is sandboxed merely by writing `script` or choosing a `working_dir`.

## Conductor references

Syntax was adapted from `microsoft/conductor` examples `parallel-validation.yaml`, `script-typed-output.yaml`, and the documented `human_gate` / `terminate` step types. Source-review reference commit: `f794e008830cc182ffee4717ca8bea7763c12cf3`. See [issue #9](https://github.com/frankherchet/skills/issues/9) for the integration ADR decision gate.
