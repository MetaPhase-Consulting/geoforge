# ChallengeCI

The pipeline: what it proves, and whether it can be bypassed.

## Covers

Workflow hardening, evidence gates, security scanning, and the release controls
that make a merge into a protected branch mean something.

## The requirement

SP 800-53 Rev. 5 control families, principally Configuration Management (CM),
System and Information Integrity (SI), and Risk Assessment (RA). An assessor
asks how change is controlled and how flaws are found; a pipeline that gates on
both answers the question with artifacts instead of assertions.

## Gates and reports

A gate blocks a merge. A report informs one. Both are useful and they are not
interchangeable, so which is which is a decision rather than an accident of
configuration.

The gates worth having cover: that the code compiles, conforms and behaves; that
the artifact can actually be produced; that the system works end to end; that
every rendered route passes accessibility; that no dependency carries a high or
critical advisory; and that no verified secret reached the history.

Which of those block, and which report, is declared in `profile.yml` so the
answer is written down rather than inferred from workflow files.

## Hardening

- Workflow permissions are least privilege, declared per workflow rather than
  inherited.
- Actions are pinned, and raised on a schedule.
- Deploy credentials come from short-lived federated identity rather than a
  long-lived key held in the repository or in secrets.
- The pipeline runs on pull requests from forks without secrets in scope.

## In this repository

**The most consequential finding in this file, and worth stating plainly
first: `ci.yml`'s push trigger listens for `branches: [main, develop]`, but
this repository's actual default and working branch is `dev` — confirmed
against the full remote branch list; no `develop` branch exists or has
ever existed.** Every push to `dev` — which is where day-to-day development
happens — triggers no CI run at all. CI only fires on a direct push to
`main`, or a `pull_request` targeting `main`. In practice, that means the
real, blocking gates below (lint, build, test, security audit) only ever
run once a PR is opened against `main` — not on the branch most commits
actually land on first. This is a configuration bug, not a design choice;
nothing in this repository explains it as intentional.

Once CI does run, the `test` job is genuinely solid: lint, build, tests,
and `npm audit --audit-level=high`, all with no `continue-on-error`,
across Node 18.x and 20.x — a real, blocking security gate matching the
strongest sibling repos in this suite. The `deploy` job (gated on `test`
passing, and on being on `main`) deploys to Netlify via
`nwtgck/actions-netlify@v2.0` using `NETLIFY_AUTH_TOKEN`/`NETLIFY_SITE_ID`
as long-lived GitHub Actions secrets — see ChallengeCD for why that's
worth naming as a real, if lower-severity, deviation from this tool's
"short-lived federated identity" hardening principle.

`dependency-hygiene.yml` is genuinely more automated than most sibling
repos' equivalent: weekly, it runs a real audit report, applies
`npm audit fix` (best-effort, `|| true`), and opens an actual PR with the
lockfile changes via `peter-evans/create-pull-request` — a real automated
remediation loop, not just a report. It correctly declares an explicit
`permissions: contents: write, pull-requests: write` block, since it needs
both. `ci.yml`'s two jobs declare no `permissions:` block at all, relying
on the repository default instead.

Actions across both workflows are pinned to major-version tags (`@v4`,
`@v7`, `@v2.0`), not commit SHAs, and nothing raises them on a schedule
(dependency-hygiene.yml audits npm packages, not GitHub Actions versions).

## Evidence

Each run uploads its reports, and they are retained long enough to be asked for.
Coverage is surfaced on the change itself rather than only in a log.

No artifact is uploaded by either workflow. Everything that runs is
visible only in the raw Actions log, and — per the branch-trigger bug
above — a meaningful share of actual development activity never produces
a run at all.

## Review checklist

- Does a new job have wider permissions than it needs?
- Is a new action pinned?
- Did a required check get renamed? The name is what branch protection matches,
  so renaming one silently stops it gating.
- Does a job that cannot fail still report, so a required check is satisfied
  rather than left pending forever?
- Does the gate list in `profile.yml` still match what the pipeline runs?
- **This repository-specific, and the fix this file most wants made:**
  change `ci.yml`'s push trigger from `develop` to `dev` (and confirm the
  `pull_request` trigger's target branch matches actual practice too). This
  is a one-line fix that closes the largest gap in this repository's CI
  posture — everything else already works well once it actually runs.
