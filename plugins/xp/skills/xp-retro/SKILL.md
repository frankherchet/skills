---
name: xp-retro
description: Run a retrospective after a milestone, epic or bugfix has shipped. Gathers evidence from issues, PRs, commits and the session, works out what went well, what went badly and what to improve, then turns the improvements into concrete changes. Project learnings become memento memos or issues; problems with the xp-* skills themselves become issues in frankherchet/skills. Use when the user says "retro", "retrospective", "lessons learned", "what can we improve", or when xp-ship suggests it after a release.
---

# xp-retro

Every shipped piece of work makes the next one easier, including the workflow and these skills.

## 1. Collect evidence

Base the retro on facts, not impressions. For the scope (a milestone, an epic or a single bug):
- Issues: `gh issue list --milestone "<title>" --state all --json number,title,labels,createdAt,closedAt,comments`
- PRs: review rounds, requested changes, and the time from opening to merge (`gh pr list --state merged --search "milestone:\"<title>\""`)
- `needs-human` episodes: what blocked work and for how long
- Reopened issues, bugs found after the merge, scope changes during implementation
- The five-whys comments on bug issues (from `xp-bugfix`) and the process changes proposed there
- The test suite: flaky or slow tests, and criteria that were hard to test
- This session and earlier ones: corrections the user had to make and steps that had to be repeated

## 2. Discuss

In interview mode, show the evidence and ask the user for their view first. In autopilot mode, draft the findings yourself and mark them as a draft.

Sort the findings into three buckets: **went well**, **went badly**, **improve**. Every finding names its evidence (an issue, a PR or a concrete event). Look for causes, not culprits: was the Definition of Ready too weak, was the refinement too shallow, was a skill instruction missing or wrong?

## 3. Turn improvements into changes

Every item in "improve" gets an owner and a home, or it is dropped:

| kind of improvement | where it goes |
|---|---|
| project rule (DoR, DoD, labels, gates) | propose an edit to `## XP Workflow` in AGENTS.md (the user approves) |
| project knowledge for future sessions | a memento memo in `.memento/` (see the memento skill) |
| concrete work in the project | a new issue (`xp-issues`) |
| a problem with an xp-* skill itself | an issue in `frankherchet/skills`, see below |

For skill problems, create an issue in the skills repo. Confirm with the user before you file it, because it is a different repository:
```bash
gh issue create --repo frankherchet/skills --title "xp-<skill>: <problem>" --label "retro" \
  --body "<what happened, evidence, suggested change to SKILL.md>"
```
If the `retro` label does not exist there, leave out `--label`.

## 4. Record

Write the three lists and links to the follow-ups you created, in under 20 lines. Put them where the scope lives: as a comment on the epic or bug issue, or for a milestone appended to its description (`gh api -X PATCH repos/{owner}/{repo}/milestones/<number> -f description="…"`).

Limit the follow-ups to the three that matter most. A retro that produces ten action items produces none.
