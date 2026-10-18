---
name: xp-retro
description: Look back after a milestone, epic or bugfix has shipped. Collects evidence from issues, PRs, commits and sessions, sorts it into what went well, what went badly and what to improve, and turns at most three improvements into real changes, such as AGENTS.md rules, memento memos, project issues or issues against the xp-* skills in frankherchet/skills. Use when the user says "retro", "retrospective", "lessons learned", "what can we improve", or when xp-ship suggests it. Last skill of the xp loop; hands over to xp-issues.
metadata:
  version: "0.2.0"
  source: frankherchet/skills
---

# xp-retro

Each shipped piece of work should make the next one easier, including the workflow and these skills.

**Loop:** setup → issues → refine → implement | bugfix → ship → **retro**

## Before you start

1. Read `## XP Workflow` in `AGENTS.md`. If it is missing, run `xp-setup` first.
2. Settle the scope with the user: a milestone, an epic or a single bug.
3. Pick the mode from AGENTS.md: interview unless the user asked for autopilot.

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

## 4. Record

Write the three lists and links to the changes in under 20 lines, where the scope lives: a comment on the epic or bug issue, or for a milestone appended to its description (`gh api -X PATCH repos/{owner}/{repo}/milestones/<number> -f description="…"`).

## Hand-over

End with the hand-over from `## XP Workflow` in AGENTS.md. **Next:** `xp-issues` for the next issue or milestone.
