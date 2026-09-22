---
name: memento
description: Keep short project memos in .memento/ so knowledge survives across agent sessions. Use at the start of a session in a project that has a .memento/ directory, whenever the user says "remember", "merk dir", "note this", or "for next time", and proactively whenever you make a decision, hit a gotcha, leave work unfinished, or learn a project preference that a future session would need and that is not already in AGENTS.md, CLAUDE.md, README, code, or git history.
---

# memento

Like Leonard in *Memento*, you start every session with no memory of the last one. `.memento/` holds your Polaroids: short notes you left for your future self in this project. Read them, trust them only after checking, and keep them current.

## At session start

1. If `.memento/INDEX.md` exists, read it. A session-start hook may already have injected it; don't read it twice.
2. Open individual memo files only when they are relevant to the current task.
3. Before acting on a memo, verify what it claims. A file, function, flag or decision it names may have changed since it was written. When a memo is wrong, fix or delete it.

## When to write a memo

Write one **without being asked** as soon as you learn something that:

- a future session in this project would need, **and**
- is not obvious from the code, and
- is not already recorded in AGENTS.md, CLAUDE.md, README, docs, code comments or git history.

Typical cases:

| type         | example                                                           |
|--------------|-------------------------------------------------------------------|
| `decision`   | "We use X instead of Y because Z" (approach chosen with the user) |
| `gotcha`     | A trap you fell into: flaky test, odd env requirement, hidden coupling |
| `context`    | Background the user explained that is not written down anywhere  |
| `todo`       | Unfinished work and concrete next steps when a session ends mid-task |
| `preference` | How the user wants things done *in this project*                  |
| `reference`  | Pointer to an external resource: ticket, dashboard, doc URL       |

When the user says "remember this", write the memo right away.

## When NOT to write a memo

- It is already in AGENTS.md, CLAUDE.md, README, code or git history. Link to it instead of copying it.
- It only matters for the current session.
- It contains secrets, tokens, credentials or personal data. **`.memento/` is committed to git.**
- It restates something generic that any competent agent already knows.

## How to write a memo

1. **Check for an existing memo first.** Scan `INDEX.md`. If a memo already covers the topic, update it (and its `updated` date) rather than creating a duplicate.
2. Create `.memento/<kebab-case-slug>.md`:

   ```markdown
   ---
   title: Short human title
   type: decision | gotcha | context | todo | preference | reference
   created: 2026-09-23
   updated: 2026-09-23
   ---

   The fact, in one to a few sentences.

   **Why:** the reason or the incident behind it.
   **How to apply:** what a future session should do differently because of it.
   ```

   Always use absolute dates. Turn "yesterday" or "next week" into real dates.
3. Add or update one line in `.memento/INDEX.md`:

   ```markdown
   - [Short human title](kebab-case-slug.md) — decision — one-line hook
   ```

   Keep the index to one line per memo. Put no content there, because the index is what gets loaded at every session start.
4. Delete memos that are resolved or obsolete, such as a finished `todo`, and remove their index lines.

See [references/format.md](references/format.md) for the full format and examples.

## First memo in a project: leave a pointer

When you create `.memento/` for the first time in a project, also make sure agents without the session hook find it:

- If `AGENTS.md` does not contain the line below, append it. Create `AGENTS.md` if it does not exist.
- If a `CLAUDE.md` exists and does not import `@AGENTS.md`, append the same line there too.

```markdown
Project memos live in .memento/ — read .memento/INDEX.md at session start (memento skill).
```

Add the pointer only. Never copy memo contents into AGENTS.md or CLAUDE.md.

## Style

- One fact per memo. Short beats complete.
- Write for a reader who has no context: name files, commands and reasons explicitly.
- Before ending a session in which a task is left unfinished, write or update a `todo` memo with the concrete next step.
