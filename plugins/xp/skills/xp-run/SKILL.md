---
name: xp-run
description: Run the xp loop unattended with a human only at the start and at the end. One kickoff batch for an epic or milestone, then issue after issue is built, reviewed and merged by workers with fresh context, then one run report. Use for "run the milestone", "kick off this epic", "autopilot", "work through the backlog".
metadata:
  version: "0.4.0"
  source: frankherchet/skills
---

# xp-run

Drive the loop so that a human is needed twice: to approve the kickoff and to answer the run report.

**Loop:** kickoff → ( next issue → build → review → merge )… → run report

## Before you start

1. Follow `## XP Workflow` in `AGENTS.md`. Most hosts have loaded the file already; read it only if the section is not in your context. If the section does not exist, run `xp-setup` first.
2. This skill works in autopilot mode. Its only question to the user is the kickoff packet.
3. Pick up answers: "Parked issues" in `xp-issues`.
4. Settle the scope: the epic or milestone the user named, otherwise every `status:ready` issue. If the scope has an epic that is not `status:ready`, start with the kickoff; otherwise go to the run.

## Workers

The run itself stays small: it starts a worker for every piece of real work and keeps only the worker's reply. A worker is a subagent with its own, fresh context. Start it with the host's subagent tool and this prompt, nothing more:

> <task> for <issue, PR or scope> of this repository. Mode: autopilot. Never ask; park instead. Reply with <reply> and nothing else.

| worker | task | reply |
|---|---|---|
| kickoff | Prepare the kickoff as described in "1. Kickoff", steps 1 to 4, of the skill `xp-run` | the packet in the format of step 5, including each question and proposed answer |
| answers | Apply these answers as described in "Approval", steps 1 and 2, of the skill `xp-run`: <answers> | the hand-over |
| build | Use the skill `xp-implement` (or `xp-bugfix`), then `xp-ship` up to and including "2. Pull request"; do not review or merge | the hand-over |
| fix | Fix these review findings on the PR's branch test-first, repeat "1. Check" of the skill `xp-ship` and push: <findings> | the hand-over |
| review | Review the PR as described in "3. Review" of the skill `xp-ship`; you did not write this code | `APPROVE` or the findings |
| refine | Use the skill `xp-refine` | the hand-over |

- Workers run one after another: they share the working tree and the requirement IDs.
- If a worker cannot load a skill by name, give it the path of the SKILL.md; the xp skills sit next to this one (`../<skill>/SKILL.md`).
- If the host has no subagents, do the same work inline in the same order and say so in the run report.

## 1. Kickoff

One batch of work, then one batch of questions. Nothing is asked before every step is done for the whole scope.

1. **Plan.** With `xp-issues`, make sure the milestone and its epics exist. With `xp-refine` ("Refine an epic or milestone"), draw the goal map and create the missing feature issues.
2. **Branch:** `git fetch origin && git switch -c kickoff-<short-slug> origin/<default>`.
3. **Refine every child** with `xp-refine`, in priority order. Criteria go into the requirements file as `draft`. Answer open technical questions with a spike now; its ADR stays `proposed`. Collect every question only a human can answer, each with a proposed answer.
4. **Kickoff PR:** commit (`Kickoff: <scope title>`), push, and open a draft PR: `gh pr create --draft --base <default> --title "Kickoff: <scope title>" --body "<one line per epic>"`. Its diff is what the human approves.
5. **Kickoff packet:** post it as a comment on each epic and park the epic:
   ```markdown
   <!-- xp:kickoff -->
   ## Kickoff: <epic title>
   **Goal:** who wants what, and why
   **In scope:** one line per feature: #<n> <title> (REQ-NNN.1 to REQ-NNN.N)
   **Out of scope:** …
   **Criteria and ADRs:** PR #<pr>
   **Decided without you:** one line per assumption that changes what gets built
   **Questions:** numbered, each with a proposed answer, or "none"
   **To approve:** answer the questions; "ok" accepts every proposal
   ```
6. Show all packets in one message and end the turn with it. This is the one planned stop of a run. In headless mode stop here.

### Approval

A reply from the user or a trusted account that answers the questions approves the kickoff, unless it says otherwise.

1. Apply the answers to the criteria and ADRs on the kickoff branch. Only if an answer raises new questions, send one more packet with just those.
2. Set the kickoff's requirements and ADRs to `accepted`, commit and push.
3. Mark the PR ready (`gh pr ready <pr>`). Check the applicable tests, lint, scope, requirement ID collisions and changed documents; criteria describe future work, so their implementation tests are not required on this PR. Have an independent review worker check the PR against the approved kickoff packet, address findings as in "3. Review" of `xp-ship`, then merge as in "4. Merge" of `xp-ship`. If a check or protected path parks the PR, leave the epic parked and do not start its children.
4. Move every child that meets the Definition of Ready to `status:ready`, leave the others in `status:refining` with the missing points as a comment, move the epic to `status:ready` and remove its decision label. Then go on with the run.

## 2. Run

Repeat until no issue in scope can move without a human:

1. **Next issue:** "Next issue" in `xp-issues`, restricted to the selected scope except for a red default branch, which must be fixed first. It checks the default branch, resumes unfinished work, and picks and claims the next ready issue. If it names an issue to refine instead, give that to a refine worker and repeat this step.
2. **Build:** a build worker. A resumed issue with an open PR skips this step. If the worker parks the issue, skip review and merge, log it and continue.
3. **Review:** a review worker. Findings go to a fix worker and then to a new review worker, at most twice; after that park the issue.
4. **Merge:** "4. Merge" and "5. After the merge" of `xp-ship`, done here, not in a worker.
5. **Log** one line: `#<n> <title> — merged PR #<pr>` or `#<n> <title> — parked: <reason>`.

A parked issue never stops the run; take the next one. One exception: if the fix for a red default branch is parked, end the run, because nothing may be built on a red default branch.

## 3. Run report

Run `xp-retro` once for the whole run after the last issue, including when issues remain parked. Then end with one report, which is also the hand-over:

```markdown
## Run report
**Result:** <n> merged, <n> parked
- #12 Login link — merged PR #31
**Waiting on a human:** answer by number; "ok" accepts every proposal
1. #14 <question> — proposed: <answer>
2. #15 PR #33 touches `.github/` — proposed: merge
3. #20 kickoff — proposed: approve (PR #34)
4. Milestone "v1" is complete, release notes below — proposed: close it
5. Retro: <exact change to AGENTS.md> — proposed: apply
**Next:** `xp-run` after your answers, or "nothing"
```

Every numbered item is also on GitHub, as a parked comment or in the retro record, so it can be answered there. When the user answers in the session, apply the answers ("Parked issues" in `xp-issues`) and go on with the run.
