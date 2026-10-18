---
name: xp-issues
description: Plan and steer work with GitHub Issues in the issue-driven XP workflow. Creates milestones, epics, features, bugs and spikes, triages new issues (type, status, priority, duplicates), reports status, and picks the next ticket and routes it to xp-refine, xp-implement or xp-bugfix. Use when the user wants to plan a milestone or epic, file a bug or feature, triage the backlog, asks "what's next", "status of the milestone", or wants to start the feature or bugfix loop.
---

# xp-issues

GitHub Issues are the project plan. This skill keeps them tidy and decides what happens next.

## Before you start

Read the `## XP Workflow` section in `AGENTS.md`. Labels, human gates, Definition of Ready and the requirements file are defined there. If the section is missing, stop and run `xp-setup` first.

Use `gh` for every GitHub operation. If it is unavailable, use the host's GitHub MCP tools.

## Create

- **Milestone:** `gh api repos/{owner}/{repo}/milestones -f title="<title>" -f description="<goal>" [-f due_on=<ISO date>]`. The description states the goal in one or two sentences.
- **Epic:** an issue with `type:epic`, `status:triage` and a `prio:*` label, assigned to one milestone. The body holds the goal, scope and out-of-scope items.
- **Feature, bug, spike:** an issue with its `type:*`, `status:triage` and a `prio:*` label. Attach it to its epic as a native sub-issue:
  ```bash
  child_id=$(gh api repos/{owner}/{repo}/issues/<child> --jq .id)
  gh api repos/{owner}/{repo}/issues/<epic>/sub_issues -F sub_issue_id=$child_id
  ```
  If sub-issues are unavailable, add `- [ ] #<child>` to the epic body.
- **Bug body:** steps to reproduce, expected behavior, actual behavior, environment, and logs if any.
- Before creating anything, search for duplicates: `gh issue list --state all --search "<keywords>"`. If you find one, link to it instead of creating a new issue.

Breaking a milestone or epic down into issues is fine here. Detailed acceptance criteria belong in `xp-refine`.

## Triage

For every issue with `status:triage`, or without any `type:*`/`status:*`/`prio:*` label:
1. Close it as a duplicate (with a link) or as invalid (with a reason), or keep it.
2. Set exactly one `type:*` and one `prio:*`. Use `prio:p0` only for production breakage or data loss.
3. Attach it to an epic and milestone if one fits.
4. Move it to `status:refining`. Move a well-described bug straight to `status:ready` if it already meets the Definition of Ready.

## Status

Report per milestone: the open and closed counts, the issues per `status:*`, everything labeled `needs-human` (with its open question), and stale `status:in-progress` issues with no activity for more than 7 days.
```bash
gh issue list --milestone "<title>" --state all --json number,title,state,labels,updatedAt
```

## Next: choose and route

0. **Stop the line.** First check the default branch: `gh run list --branch <default> --limit 1` (or run the test command from AGENTS.md on it). If it is red, nothing else is next. Make sure a `type:bug` + `prio:p0` issue exists for it, and route that issue to `xp-bugfix`.
1. List candidates: `gh issue list --label status:ready --json number,title,labels,milestone`. Exclude issues labeled `needs-human`.
2. Pick by `prio:*` first, then by the earliest milestone, then by the lowest number. Bugs win ties.
3. Route the pick:
   - `type:bug` → `xp-bugfix`
   - `type:feature` → `xp-implement`
   - `type:spike` → `xp-refine` (spike mode)
   - `type:epic` → do not implement it; pick its first ready child instead
4. Before handing over, set `status:in-progress` and assign the issue: `gh issue edit <n> --add-label status:in-progress --remove-label status:ready --add-assignee @me`.

If nothing is ready, say so and suggest refining the highest-priority `status:refining` issue with `xp-refine`.

## Human gates

Follow the gates in AGENTS.md. In particular, moving an epic to `status:ready` and closing a milestone need a human. To ask, add `needs-human`, write the question as an issue comment, and continue with another ticket.
