# AGENTS.md

This repo is Frank Herchet's collection of agent skills, plugins and agents. It is a single marketplace that installs into **Claude Code**, **OpenAI Codex CLI** and **GitHub Copilot CLI**, and its skills can also be installed via `npx skills`.

## Layout

```
.claude-plugin/marketplace.json    # Claude Code marketplace (Copilot and npx skills read it as a fallback)
.agents/plugins/marketplace.json   # Codex marketplace
.github/plugin/marketplace.json    # Copilot marketplace
plugins/<name>/
  .claude-plugin/plugin.json       # Claude manifest (hooks/hooks.json is picked up by default)
  .codex-plugin/plugin.json        # Codex manifest ("skills", "hooks" paths)
  .github/plugin/plugin.json       # Copilot manifest (points at hooks/copilot-hooks.json)
  skills/<skill>/SKILL.md          # skills are shared by all tools
  hooks/hooks.json                 # Claude + Codex hooks (${CLAUDE_PLUGIN_ROOT})
  hooks/copilot-hooks.json         # Copilot hooks (version 1, ${PLUGIN_ROOT})
  agents/                          # subagent definitions (Claude format), when a plugin has any
tests/                             # node:test, run with `npm test`
```

## Adding a plugin

1. Create `plugins/<name>/` with all three manifests. Copy them from `plugins/memento/` and keep `name`, `version` and `description` identical across the three.
2. Register the plugin in **all three** marketplace files.
3. Skills go in `plugins/<name>/skills/<skill>/SKILL.md` and need `name` and `description` frontmatter. The description decides when the skill triggers, so state clearly what it does and when to use it.
4. Hooks:
   - Write hook logic once as a dependency-free Node script.
   - Detect the host by environment: `COPILOT_PLUGIN_DATA` means Copilot, which expects `{"additionalContext": …}`. Otherwise it is Claude or Codex, which expect `{"hookSpecificOutput": {"hookEventName": …, "additionalContext": …}}`.
   - Hooks must never fail a session: catch everything and exit 0.
5. Add tests under `tests/` that simulate each host's environment. Run `npm test`.
6. Bump `version` in all three manifests when behavior changes.

## Conventions

- Skill and plugin content is written in English.
- Keep SKILL.md focused and put details in `references/`.
- No runtime dependencies in hooks. Plain Node only, which all three hosts can run.
