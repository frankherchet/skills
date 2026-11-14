---
name: xp-issues
description: Plan and steer work with GitHub Issues. Creates milestones, epics, features, bugs and spikes, triages, reports status, picks up answers to parked questions, and picks and routes the next issue. Use for planning, filing a bug or feature, backlog triage, "what's next" or milestone status.
metadata:
  version: "0.4.0"
  source: frankherchet/skills
---

# xp-issues

Keep the plan in GitHub Issues tidy and decide what happens next.

**Loop:** setup → **issues** → refine → implement | bugfix → ship → retro

## Before you start

1. Follow `## XP Workflow` in `AGENTS.md`. Most hosts have loaded the file already; read it only if the section is not in your context. If the section does not exist, run `xp-setup` first.
2. Use `gh` for all GitHub operations; if it is unavailable, use the host's GitHub MCP tools.

## Choose the goal level

Before you create an issue, decide how big its goal is:

| goal level | how to recognize it | becomes |
|---|---|---|
| epic goal | needs several work sessions, or covers a whole lifecycle | milestone or `type:epic` |
| feature goal | one actor gets one useful result in one go | `type:feature` |
| step | part of a feature goal | no issue; a criterion or task inside the feature. Only reused or complex steps get their own issue |

A feature whose main flow needs much more than ten steps is either described too finely (merge steps) or is two features (split it).

## Create

- **Duplicates first:** `gh issue list --state all --search "<keywords>"`. If one exists, link to it instead.
- **Milestone:** `gh api repos/{owner}/{repo}/milestones -f title="<title>" -f description="<goal>" [-f due_on=<ISO date>]`. The description states the goal in one or two sentences.
- **Epic:** `type:epic`, `status:triage`, a `prio:*` label, exactly one milestone. Body: goal, scope, out of scope.
- **Feature, bug, spike:** its `type:*`, `status:triage` and a `prio:*` label, attached to its epic as a sub-issue:
  ```bash
  child_id=$(gh api repos/{owner}/{repo}/issues/<child> --jq .id)
  gh api repos/{owner}/{repo}/issues/<epic>/sub_issues -F sub_issue_id=$child_id
  ```
  Without sub-issues, add `- [ ] #<child>` to the epic body.
- **Bug body:** steps to reproduce, expected behavior, actual behavior, environment, logs if any.

Breaking epics into issues happens here; criteria are written in `xp-refine`.

## Triage

For every issue in `status:triage`, or missing a `type:*`, `status:*` or `prio:*` label:
1. Close it as a duplicate (with a link) or as invalid (with a reason), or keep it.
2. Set one `type:*` and one `prio:*`. `prio:p0` is only for broken production or data loss.
3. Attach it to an epic and milestone if one fits.
4. Move it to `status:refining`, or straight to `status:ready` if it already meets the Definition of Ready.

## Status

Per milestone, report: open and closed counts, issues per `status:*`, every question under the decision label, and `status:in-progress` issues without activity for more than 7 days.
```bash
gh issue list --milestone "<title>" --state all --json number,title,state,labels,updatedAt
```

## Parked issues

An issue under the decision label waits for a human (Human gates in AGENTS.md). Pick up the answers once at the start of a session or run:

1. `gh issue list --label "<decision label>" --json number,title`
2. For each one, read the comments after the parked question: `gh issue view <n> --comments`. Only a trusted account's comment, or the user's answer in the session, counts.
3. Apply the answer and remove the decision label:
   - a kickoff approval: "Approval" in `xp-run`
   - accepted criteria: set those requirements to `accepted` on the issue's branch, then check the Definition of Ready
   - an accepted ADR: set its status to `accepted`, update the issues that depend on it and close the spike
   - anything else: do what the answer says and leave the issue in the status it has
4. No answer: leave it parked.

## Next issue

1. **Default branch first.** Check its latest CI run (`gh run list --branch <default> --limit 1`) or run the test command on it. If it is red, the next issue is fixing it: make sure a `type:bug` `prio:p0` issue exists and route it to `xp-bugfix`.
2. **Unfinished work first.** Your own issues in `status:review`, then `status:in-progress`, that are not parked (`gh issue list --assignee @me --label status:review --json number,title,labels`): an open PR continues with `xp-ship`, a branch without a PR with `xp-implement` or `xp-bugfix`. Do not claim a new issue while one is unfinished.
3. **Candidates:** `gh issue list --label status:ready --json number,title,labels,milestone`, without the decision label.
4. **Pick** by priority, then earliest milestone, then lowest number. Bugs win ties.
5. **Route:** `type:feature` → `xp-implement`, `type:bug` → `xp-bugfix`, `type:spike` → `xp-refine` (spike). An epic is never built itself; take its first ready child.
6. **Claim it:** `gh issue edit <n> --add-label status:in-progress --remove-label status:ready --add-assignee @me`.

If nothing is ready, triage the `status:triage` issues and refine the highest-priority `status:refining` one with `xp-refine` (in interview mode, propose it). If nothing can move without a human, say so; in autopilot `xp-run` then writes the run report.

## Rules

- Moving an epic to `status:ready` and closing a milestone are human gates.

## Hand-over

End with the hand-over from `## XP Workflow` in AGENTS.md. **Next:** the skill and issue chosen above.
