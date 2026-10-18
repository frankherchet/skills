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
xp-setup → xp-issues → xp-refine → xp-implement ─┐
              ↑                    xp-bugfix ────┴→ xp-ship → xp-retro
              └──────────────── next issue ─────────────────────┘
```

| Skill | Job |
|---|---|
| `xp-setup` | Once per project: writes the `## XP Workflow` section into AGENTS.md (loop, terms, modes, hand-over, labels, Definition of Ready and Done, human gates), creates labels, adds the requirements file and its schema |
| `xp-issues` | Plans milestones, epics and issues at the right goal level, triages, reports status, picks the next issue (a red default branch always comes first) |
| `xp-refine` | Makes an issue ready: interests, failure conditions, then criteria; goal maps for epics; spikes that end in an ADR |
| `xp-implement` | Builds a feature test-first: an acceptance test per criterion, small red-green-refactor steps inside, reuse before new code |
| `xp-bugfix` | Reproduces a bug with a test, fixes the cause, looks for the same mistake elsewhere, names the process gap |
| `xp-ship` | Checks tests, traceability, scope, the code around the diff, simplicity, ID collisions and Done; opens the PR; closes issues; writes release notes |
| `xp-retro` | Evidence-based look back; up to three improvements become AGENTS.md rules, memos, issues, or issues against these skills |

Every skill reads the same `## XP Workflow` section, uses the same terms, and ends with the same hand-over (result, waiting on a human, next skill), so the loop can be followed from issue to issue.

Requirements live in `docs/requirements.yaml` (JSON Schema validated), so scripts can read them. Progress is never stored there: issues link criteria with a `Requirements:` line, and tests name the criterion ID.

## Development

```bash
npm test
```

See [AGENTS.md](AGENTS.md) for repo conventions.

## Acknowledgements

The xp plugin is written from scratch. Some of its ideas were inspired by:

- Kent Beck, Cynthia Andres: *Extreme Programming Explained* (fixing the default branch first, test-first work, tracing bugs back to the process)
- Alistair Cockburn: *Writing Effective Use Cases* (stakeholder interests, failure conditions before solutions, goal levels)
- [ponytail](https://github.com/DietrichGebert/ponytail) by Dietrich Gebert (reuse before new code, reviewing the code around a diff)

## License

[MIT](LICENSE)
