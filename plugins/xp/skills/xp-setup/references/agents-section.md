# Template: `## XP Workflow` section for the target project's AGENTS.md

Copy everything between the markers into the project's AGENTS.md. Replace `<…>` placeholders with the interview answers. Keep the headings unchanged, because the xp-* skills look them up by name.

<!-- xp:begin -->
## XP Workflow

This project uses the issue-driven XP workflow (xp-* skills). GitHub Issues are the single plan. The skills follow the rules in this section; change the rules here, not in the skills.

### The loop
```
xp-setup → xp-issues → xp-refine → xp-implement ─┐
              ↑                    xp-bugfix ────┴→ xp-ship → xp-retro
              └──────────────── next issue ─────────────────────┘
```
- `xp-setup`: once per project; writes this section.
- `xp-issues`: plans milestones, epics and issues, triages, and picks the next issue.
- `xp-refine`: makes an issue ready: interests, failure conditions, criteria.
- `xp-implement`: builds a feature test-first, one criterion at a time.
- `xp-bugfix`: reproduces a bug with a test, fixes the cause, finds the process gap.
- `xp-ship`: checks, opens the PR, closes issues, writes release notes.
- `xp-retro`: learns from shipped work and improves project rules and skills.

### Terms
| term | meaning |
|---|---|
| issue | any GitHub issue: epic, feature, bug or spike |
| milestone | a release or timebox; a native GitHub milestone, not an issue |
| goal level | how big a goal is: **epic goal** (needs several work sessions), **feature goal** (one actor gets one useful result in one go), **step** (part of a feature goal, no issue of its own) |
| requirement | an entry `REQ-NNN` in the requirements file: what the system must do |
| criterion | a testable acceptance criterion `REQ-NNN.N` of a requirement |
| interest | what a stakeholder needs protected or satisfied by a feature |
| failure condition | something that can go wrong in a feature, with a defined outcome |
| human gate | a decision only a human may make (see below) |
| default branch | the branch PRs merge into |

### Modes
- **Interview:** the user is present. Ask one question at a time and propose an answer with each one.
- **Autopilot:** the work runs unattended. Decide what you can from code, docs and issue history; everything else becomes a `needs-human` question. Autopilot never passes a human gate.

Use interview mode unless the user asks for autopilot.

### Hand-over
Every xp-* skill ends with a hand-over in this form:
- **Result:** what changed, with links (issues, files, PR)
- **Waiting on a human:** open human gates and `needs-human` questions, or "nothing"
- **Next:** the next skill and issue, for example `xp-ship #12`

### Repository
- Remote: `<owner/repo>`
- Default branch: `<main>`
- GitHub access: `gh` CLI; if it is unavailable, use the host's GitHub MCP tools.
- Build and test: `<test command>` (target: under 10 minutes). CI: `<workflow file or "none">`.
- **Fix the default branch first:** while it is red, repairing it is the only next issue.

### Issues
- Every epic belongs to exactly one milestone. Its children are native sub-issues; fallback: a task list in the epic body.
- Labels:

  | label | color | meaning |
  |---|---|---|
  | `type:epic` | `5319e7` | epic goal, groups features |
  | `type:feature` | `1d76db` | feature goal |
  | `type:bug` | `d73a4a` | wrong behavior |
  | `type:spike` | `fbca04` | timeboxed investigation that ends in an ADR |
  | `status:triage` | `ededed` | new, not yet sorted |
  | `status:refining` | `c5def5` | being refined |
  | `status:ready` | `0e8a16` | meets the Definition of Ready |
  | `status:in-progress` | `f9d0c4` | being built or fixed |
  | `status:review` | `bfdadc` | PR open |
  | `prio:p0` | `b60205` | drop everything |
  | `prio:p1` | `d93f0b` | next |
  | `prio:p2` | `fbca04` | soon |
  | `prio:p3` | `c2e0c6` | someday |
  | `needs-human` | `000000` | waiting for a human decision |

- An open issue has exactly one `type:*`, one `status:*` and one `prio:*` label.
- An issue that implements requirements has the line `Requirements: REQ-012.1, REQ-012.2` in its body.
- Commits and PRs name both: `Refs #12, REQ-012.1`.

### Human gates
Only a human may:
- move an epic to `status:ready`
- merge a PR
- close a milestone
- set a requirement to `obsolete`
<additional gates>

To ask for a decision: add `needs-human`, write the question as an issue comment, and continue with another issue.

### Definition of Ready
An issue may move to `status:ready` when:
- [ ] the goal is stated in one or two sentences and has the right goal level
- [ ] features: every criterion exists in `<docs/requirements.yaml>`, including the failure conditions; bugs: reproduction steps with expected and actual behavior
- [ ] it fits into one PR; if not, it is split
- [ ] dependencies are named and not blocking
- [ ] open questions are answered or a spike exists
<project-specific items>

### Definition of Done
An issue may be closed when:
- [ ] every criterion has at least one passing test that names its ID
- [ ] the full test suite passes: `<test command>`
- [ ] lint/format passes: `<lint command or "n/a">`
- [ ] the PR names the issue and criteria and is merged
- [ ] docs, `<docs/architecture.md>` and ADRs are updated where behavior or structure changed
<project-specific items>

### Requirements
- File: `<docs/requirements.yaml>`, validated by `<docs/requirements.schema.json>`.
- IDs: `REQ-NNN` for requirements, `REQ-NNN.N` for criteria. IDs are never reused; retired requirements are marked `obsolete`.
- The file says *what* is required, never *how far* it is: issues link to criteria with their `Requirements:` line, tests with the criterion ID in their name or in a comment next to them.

### Architecture
- Overview: `<docs/architecture.md>`
- Decisions: `docs/adr/NNNN-kebab-title.md`
<!-- xp:end -->
