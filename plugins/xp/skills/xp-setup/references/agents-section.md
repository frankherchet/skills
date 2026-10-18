# Template: `## XP Workflow` section for the target project's AGENTS.md

Copy everything between the markers into the project's AGENTS.md. Replace `<…>` placeholders with the interview answers. Keep the section headings unchanged, because the other xp-* skills look them up by name.

<!-- xp:begin -->
## XP Workflow

This project uses the issue-driven XP workflow (xp-* skills). GitHub Issues are the single planner. The skills read the rules below. Change them here, not in the skills.

### Repository
- Remote: `<owner/repo>`
- Default branch: `<main>`
- GitHub access: `gh` CLI; if it is unavailable, use the host's GitHub MCP tools.

### Issues
- Milestone: a release or timebox (native GitHub milestone). Every epic belongs to exactly one milestone.
- Epic: issue labeled `type:epic`. Its children are native sub-issues. Fallback: a task list in the epic body.
- Labels:

  | label | color | meaning |
  |---|---|---|
  | `type:epic` | `5319e7` | groups features |
  | `type:feature` | `1d76db` | user-visible capability |
  | `type:bug` | `d73a4a` | wrong behavior |
  | `type:spike` | `fbca04` | timeboxed investigation, result is an ADR or a decision |
  | `status:triage` | `ededed` | new, not yet sorted |
  | `status:refining` | `c5def5` | being refined |
  | `status:ready` | `0e8a16` | meets the Definition of Ready |
  | `status:in-progress` | `f9d0c4` | being implemented |
  | `status:review` | `bfdadc` | PR open |
  | `prio:p0` | `b60205` | drop everything |
  | `prio:p1` | `d93f0b` | next |
  | `prio:p2` | `fbca04` | soon |
  | `prio:p3` | `c2e0c6` | someday |
  | `needs-human` | `000000` | blocked on a human decision |

- An issue has exactly one `type:*`, one `status:*` (until closed) and one `prio:*` label.
- An issue body that implements requirements contains the line `Requirements: REQ-012.1, REQ-012.2`.
- Commits and PRs reference both: `Refs #12, REQ-012.1`.

### Human gates
Agents stop and wait for a human at these points, even in autopilot:
- moving an epic to `status:ready`
- merging a PR
- closing a milestone
- setting a requirement to `obsolete`
<additional gates>

To wait, an agent adds `needs-human`, writes the open question as an issue comment and continues with another ticket.

### Definition of Ready
An issue may move to `status:ready` when:
- [ ] the goal is stated in one or two sentences
- [ ] acceptance criteria exist as requirement IDs in `<docs/requirements.yaml>` (features) or as reproduction steps with expected and actual behavior (bugs)
- [ ] it fits into one PR; if not, it is split
- [ ] dependencies are named and not blocking
- [ ] open questions are answered or a spike exists
<project-specific items>

### Definition of Done
An issue may be closed when:
- [ ] every acceptance criterion has at least one test that names its ID and passes
- [ ] the full test suite passes: `<test command>`
- [ ] lint/format passes: `<lint command or "n/a">`
- [ ] the PR references the issue and requirement IDs and is merged
- [ ] docs, `<docs/architecture.md>` and ADRs are updated where behavior or structure changed
<project-specific items>

### Requirements
- File: `<docs/requirements.yaml>`, validated by `<docs/requirements.schema.json>`.
- IDs: `REQ-NNN` for requirements, `REQ-NNN.N` for acceptance criteria. Never reuse an ID; mark it `obsolete` instead.
- The file says *what* is required. Progress is derived, never stored there: issues via their `Requirements:` line, tests via the criterion ID in the test name or a comment next to it.

### Architecture
- Overview: `<docs/architecture.md>`
- Decisions: `docs/adr/NNNN-kebab-title.md`
<!-- xp:end -->
