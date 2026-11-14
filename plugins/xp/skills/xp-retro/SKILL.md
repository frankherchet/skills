---
name: xp-retro
description: Look back after shipped work. Collects evidence, names what went well and badly, and turns at most three improvements into rules, memos or issues. Use for "retro", "lessons learned", "what can we improve", or after a milestone, epic, run or bugfix shipped.
metadata:
  version: "0.4.0"
  source: frankherchet/skills
---

# xp-retro

Each shipped piece of work should make the next one easier, including the workflow and these skills.

**Loop:** setup → issues → refine → implement | bugfix → ship → **retro**

## Before you start

1. Follow `## XP Workflow` in `AGENTS.md`. Most hosts have loaded the file already; read it only if the section is not in your context. If the section does not exist, run `xp-setup` first.
2. Settle the scope: a milestone, an epic, a single bug or a whole run, as named by the user, the `xp-ship` hand-over or `xp-run`. Ask only if none of them names one.
3. Use the default mode from AGENTS.md unless the user asks for another.

## 1. Collect evidence

Facts, not impressions:
- Issues: `gh issue list --milestone "<title>" --state all --json number,title,labels,createdAt,closedAt,comments`
- PRs: review rounds, requested changes, time from opening to merge (`gh pr list --state merged --search "milestone:\"<title>\""`)
- Questions under the decision label: what waited, and for how long
- Reopened issues, bugs found after the merge, scope changes during the work
- Process gaps proposed by `xp-bugfix` in its issue comments
- Tests: flaky or slow ones, criteria that were hard to test
- Sessions: corrections the user had to make, steps that had to be repeated

## 2. Sort

In interview mode, show the evidence and ask for the user's view first. In autopilot mode, draft the findings and mark them as a draft.

Three lists: **went well**, **went badly**, **improve**. Every finding points to its evidence (issue, PR or event). Look for causes in the process, not for people to blame: was the Definition of Ready too weak, the refinement too shallow, a skill instruction missing or wrong?

## 3. Turn improvements into changes

Keep the three improvements that matter most; drop the rest. Each one gets a home:

| improvement | home |
|---|---|
| project rule (Ready, Done, labels, gates) | an edit to `## XP Workflow` in AGENTS.md, approved by the user |
| knowledge for future sessions | a memo in `.memento/` (memento skill) |
| work in the project | a new issue (`xp-issues`) |
| a weakness of an xp-* skill | an issue in `frankherchet/skills` |

An issue in the skills repo goes to another repository, so confirm it with the user first:
```bash
gh issue create --repo frankherchet/skills --title "xp-<skill>: <problem>" --label "retro" \
  --body "<what happened, evidence, proposed change to SKILL.md>"
```
Leave out `--label` if the label does not exist there.

In autopilot mode, AGENTS.md edits and skills-repo issues are not applied. Put them into the record (step 4) as proposals, each with the exact change, and list them under "Waiting on a human" in the hand-over; memos and project issues are created right away.

## 4. Record

Write the three lists and links to the changes in under 20 lines, where the scope lives: a comment on the epic or bug issue, or for a milestone appended to its description (`gh api -X PATCH repos/{owner}/{repo}/milestones/<number> -f description="…"`). A run is looked at as a whole: one record, on the epic or milestone the run worked on, or without one on the last issue it closed.

## Hand-over

End with the hand-over from `## XP Workflow` in AGENTS.md. **Next:** `xp-issues` for the next issue or milestone.
