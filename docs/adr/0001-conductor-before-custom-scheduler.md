# ADR 0001: Spike Conductor before implementing a custom XP scheduler

- **Status:** Proposed — integration PoC not yet executed against Conductor.
- **Date:** 2026-11-04
- **Related:** #7, #8, #9, #10, #11, #13, #14

## Context

XP Swarm requires an explicit graph controller with typed node results, parallel review, deterministic transitions, human gates, run observability and resumable execution. Claude Agent SDK, GitHub Copilot SDK and Codex CLI should provide their established coding tool-loops, not be reimplemented. The chosen model/auth path must separately support user subscriptions or an enterprise/BYOK gateway. A portable image should run locally and (subject to the cloud runtime contract) on AWS Bedrock AgentCore Runtime.

## Proposed decision

Reuse **Microsoft Conductor** as the graph engine, with an XP-specific policy/result adapter. Start with a Conductor-native, entirely simulated script-worker graph. Do **not** develop the earlier Node.js DAG scheduler before a genuine Conductor end-to-end spike records a critical blocker. This is **proposed**, not an approved implementation or proof of Conductor runtime correctness.

## Evidence and remaining risks

Code review of Conductor commit `f794e008830cc182ffee4717ca8bea7763c12cf3` found native YAML steps, routing, parallel groups, human gates, typed script output, event logging, checkpoint/resume, Copilot SDK provider, experimental Claude Agent SDK provider and `conductor mcp serve` with detached workflow runs. Conductor has no native Codex CLI provider in the reviewed provider schema; an initially bounded `codex exec` adapter may suffice. Conductor does not automatically call its complete cross-reference validator on `run`; XP must preflight explicitly and independently enforce GitHub policy gates. Checkpoints do not guarantee exactly-once PR/merge effects. Docker is a useful execution boundary but does not itself restrict network/secret privileges without explicit configuration.

## Decision gate

Before making this ADR accepted or closing #9, run the checked-in fixture with a pinned Conductor build and record (a) `validate` output, (b) parallel start/end events and join, (c) approval/rejection behavior, (d) stop/resume and stale-checkpoint handling, (e) MCP run after launcher exit, and (f) node-output mismatch rejection. Add evidence links to #9. If any **essential** invariant fails, document the exact limitation, a workaround attempt, and whether a custom engine is justified.

No auth, production GitHub mutation, Docker image, or paid agent run is authorized by this ADR.
