# ChallengeAC

Agile artifacts: whether what was asked for can be traced to what was built.

## Covers

Acceptance criteria, requirement traceability, ambiguity in what was requested,
and audit readiness of the delivery record.

## The requirement

SP 800-53 Rev. 5 System and Services Acquisition (SA-3, system development life
cycle) and Configuration Management (CM-3, change control). An assessor asks how
the team knows it built what was asked for, and how a change was decided.

## Traceability without ceremony

The requirement is that a capability can be traced to its implementation and its
test. It is not that a particular artifact exists before work starts.

A traceability record written as the work lands describes the system, so it
survives an assessment as written. A backlog written ahead of the work describes
intent, which drifts from what shipped and has to be reconciled against reality
before an assessor can use it. Either can satisfy the requirement; only one is
accurate by construction.

Where the record claims a capability is complete, that claim is checkable. A
partial state written honestly, with a sentence on the shortfall, reads better in
assessment than a completion that an assessor disproves.

## Change control

An assessor asking how a change was controlled is asking for a durable record
that shows what changed, who approved it, and how it was verified. A pull
request carrying one concern, with review and conversation resolution required,
answers that. A pull request carrying several makes the record of why any one of
them landed ambiguous.

## In this repository

No formal traceability record exists — no requirements table, no linked
issue tracker mapping capability to implementation to test. Real structured
process discipline does exist: `.github/PULL_REQUEST_TEMPLATE.md` requires
a description, a change-type checkbox, a "Related Issues" section linking
the PR to an issue (`Fixes #`/`Closes #`/`Resolves #`), a changes-made
list, and a browser-compatibility + testing checklist; `.github/ISSUE_TEMPLATE.md`
structures bug reports and feature requests with reproduction steps and
environment details.

**One specific gap in that template, worth naming precisely** (the same gap
found in a sibling repo using the identical template): the PR template's
testing checklist asks for `npm run lint` and `npm run build` explicitly,
but not `npm run test:run` — even though the test suite is real, required
in CI, and (per `TESTING.md`) rebuilds the CLI before running. A
contributor could check every box in the template without ever having run
the actual test suite locally.

Whether one PR per concern, review approval, or conversation resolution is
actually enforced by GitHub branch protection isn't verified — see
`profile.yml`'s `gates` section. `CHANGELOG.md` exists and is a real,
dated record of releases, which is itself a form of traceability evidence
worth crediting.

## Evidence

- A traceability record mapping each capability to its implementation and test,
  with honest states rather than aspirational ones.
- Change history, one concern per change, with the verification recorded.
- Review approval and conversation resolution enforced rather than optional.

The PR/issue templates and `CHANGELOG.md` are real, structured evidence of
intent to trace changes; no formal capability-to-test mapping exists beyond
that.

## Review checklist

- Does the capability that just landed appear in the traceability record,
  naming its implementation and its test?
- Does the record claim completion for something only partly built?
- Does the change record say how it was verified?
- Is more than one concern bundled here, making the record of why it landed
  ambiguous?
- Was something ambiguous resolved by asking, or by guessing and documenting the
  guess?
- **This repository-specific:** does a change to `SECURITY.md`, `PRIVACY.md`,
  or `DEPLOYMENT.md` get checked against the actual code before merging?
  See ChallengeATO and ChallengeCD for the extensive drift already found in
  those three files — the kind of drift a one-line "does this claim match
  the code?" review step would have caught before it accumulated.
