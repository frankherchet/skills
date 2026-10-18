# frank-skills

Personal skills, plugins and agents that work in **Claude Code**, **OpenAI Codex CLI** and **GitHub Copilot CLI**.

## Plugins

| Plugin | What it does |
|---|---|
| [memento](plugins/memento/skills/memento/SKILL.md) | Agents keep short project memos in `.memento/`. At the start of every new session they get the memo index and are reminded to write memos for anything worth remembering across sessions. |
| [xp](plugins/xp/skills/) | Issue-driven XP workflow: GitHub Issues as the planner, refinement to a Definition of Ready, TDD, bugfixing with a failing test first, shipping against a Definition of Done with requirements traceability, and retrospectives. |

## Install

### Claude Code

```
/plugin marketplace add frankherchet/skills
/plugin install memento@frank-skills
/plugin install xp@frank-skills
```

### Codex CLI

```bash
codex plugin marketplace add https://github.com/frankherchet/skills.git
```

Then enable `memento` and `xp` via `/plugins`. Codex only runs plugin hooks after you trust them: open `/hooks` once and approve the memento SessionStart hook.

### GitHub Copilot CLI

```bash
copilot plugin marketplace add frankherchet/skills
```

```bash
copilot plugin install memento@frank-skills
```

```bash
copilot plugin install xp@frank-skills
```

### Skills only (any agent, no hooks)

```bash
npx skills add frankherchet/skills
```

This installs just the skills, without session-start hooks. memento still works: when it writes its first memo, it adds a pointer line to the project's `AGENTS.md` so later sessions find `.memento/`.

## memento in short

```
.memento/
  INDEX.md             # one line per memo, injected at session start
  some-decision.md     # one memo per file: frontmatter + fact + Why + How to apply
```

- Memos are committed with the project, so never put secrets in them.
- Memos are clues, not truth. Agents verify them before acting on them and fix stale ones.

## xp in short

```
xp-setup ─▶ xp-issues ─▶ xp-refine ─▶ xp-implement ─┐
               ▲  (next)        ▲                    ├─▶ xp-ship ─▶ xp-retro
               │                └── spike / ADR       │
               └──────────────── xp-bugfix ───────────┘
```

| Skill | Job |
|---|---|
| `xp-setup` | Writes the `## XP Workflow` section to AGENTS.md (labels, DoR, DoD, human gates), creates GitHub labels, adds `docs/requirements.yaml` and its schema |
| `xp-issues` | Milestones, epics, issues and bugs, sized by goal level; triage; status; picks the next ready ticket and routes it (a red default branch always comes first) |
| `xp-refine` | Interview or autopilot refinement until the Definition of Ready holds: interests, failures first, then criteria; actor-goal lists for epics; spikes end in an ADR |
| `xp-implement` | Failing acceptance test first, then red-green-refactor inside it, per acceptance criterion; green is the simplest thing that could possibly work (reuse before new code), without cutting safety; tests carry the criterion ID (`REQ-012.1`) |
| `xp-bugfix` | Understand, reproduce with a failing test, fix the root cause, five whys up to the process gap |
| `xp-ship` | Definition of Done, traceability, review beyond the diff (callers of changed code), simplicity and requirement-ID collision checks, PR, closing issues, milestone release notes |
| `xp-retro` | Evidence-based retro; improvements become AGENTS.md edits, memento memos, issues, or issues against these skills |

Requirements live in `docs/requirements.yaml` (JSON Schema validated), so scripts can read them. Progress is never stored there: issues link requirements via a `Requirements:` line, and tests name the criterion ID.

## Development

```bash
npm test
```

See [AGENTS.md](AGENTS.md) for repo conventions.

## Acknowledgements

The xp plugin adapts ideas from, among others:

- Kent Beck, Cynthia Andres: *Extreme Programming Explained* (stop the line, test-first, root-cause analysis)
- Alistair Cockburn: *Writing Effective Use Cases* (stakeholder interests, failure-first extensions, goal levels)
- [ponytail](https://github.com/DietrichGebert/ponytail) by Dietrich Gebert (reuse before new code, reviewing beyond the diff)

## License

[MIT](LICENSE)
