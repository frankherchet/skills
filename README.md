# frank-skills

Personal skills, plugins and agents that work in **Claude Code**, **OpenAI Codex CLI** and **GitHub Copilot CLI**.

## Plugins

| Plugin | What it does |
|---|---|
| [memento](plugins/memento/skills/memento/SKILL.md) | Agents keep short project memos in `.memento/`. At the start of every new session they get the memo index and are reminded to write memos for anything worth remembering across sessions. |

## Install

### Claude Code

```
/plugin marketplace add frankherchet/skills
/plugin install memento@frank-skills
```

### Codex CLI

```bash
codex plugin marketplace add https://github.com/frankherchet/skills.git
```

Then enable `memento` via `/plugins`. Codex only runs plugin hooks after you trust them: open `/hooks` once and approve the memento SessionStart hook.

### GitHub Copilot CLI

```bash
copilot plugin marketplace add frankherchet/skills
```

```bash
copilot plugin install memento@frank-skills
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

## Development

```bash
npm test
```

See [AGENTS.md](AGENTS.md) for repo conventions.
