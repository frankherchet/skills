# memento format reference

## Layout

```
.memento/
  INDEX.md                     # one line per memo, loaded at session start
  api-rate-limit-retry.md      # one memo per file
  release-uses-changesets.md
```

Commit `.memento/` together with the change it relates to where possible.

## Frontmatter fields

| field     | required | notes                                                   |
|-----------|----------|---------------------------------------------------------|
| `title`   | yes      | Short human title; same text as the index link          |
| `type`    | yes      | `decision`, `gotcha`, `context`, `todo`, `preference`, `reference` |
| `created` | yes      | ISO date `YYYY-MM-DD`                                   |
| `updated` | yes      | ISO date; bump on every edit                            |

## INDEX.md

```markdown
# Memento index

- [Release uses changesets](release-uses-changesets.md) — decision — never bump versions by hand
- [API rate limit retry](api-rate-limit-retry.md) — gotcha — staging API 429s after 10 req/s
- [Finish CSV export](finish-csv-export.md) — todo — header row done, streaming missing
```

Keep each line under ~120 characters. The index is capped when injected, at about 150 lines or 8 KB. Merge or prune memos long before that.

## Examples

### decision

```markdown
---
title: Release uses changesets
type: decision
created: 2026-09-23
updated: 2026-09-23
---

Versions are bumped only via `npx changeset`; never edit `version` in package.json by hand.

**Why:** Two manual bumps collided in August and broke the npm publish.
**How to apply:** For any user-facing change, run `npx changeset` and commit the generated file.
```

### gotcha

```markdown
---
title: API rate limit retry
type: gotcha
created: 2026-09-23
updated: 2026-09-23
---

The staging API returns 429 above ~10 req/s; integration tests in `tests/api/` fail randomly without the retry wrapper in `src/http/retry.ts`.

**Why:** Staging runs on a throttled plan; production does not.
**How to apply:** Route new API calls in tests through `withRetry()`; don't raise test timeouts to "fix" flakes.
```

### todo

```markdown
---
title: Finish CSV export
type: todo
created: 2026-09-23
updated: 2026-09-23
---

`exportCsv()` in `src/export/csv.ts` writes the header row; row streaming is not implemented yet.

**Why:** Session ended mid-task.
**How to apply:** Next step: implement streaming with `csv-stringify` (already a dependency), then add a test in `tests/export.test.ts`. Delete this memo when done.
```
