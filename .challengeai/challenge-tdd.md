# ChallengeTDD

The tests: what they prove, and what a green run actually means.

## Covers

Test traceability to capabilities, coverage of the paths that matter, and
release readiness.

## The requirement

SP 800-53 Rev. 5 System and Services Acquisition (SA-11, developer testing) and
System and Information Integrity (SI-2, flaw remediation). An assessor asks how
the team knows the system works, and expects an answer with artifacts.

## Breadth, then depth

Breadth across every kind of test comes first, so no category is missing: logic
in isolation, rendered behaviour, accessibility per route, real queries against
a real migrated database, route behaviour including failure cases, and the whole
system end to end at more than one viewport.

Depth follows risk. The paths where a defect changes what a user is shown, or
lets someone reach data they should not, earn the most.

## What a test should assert

A test that passes against a deliberately broken implementation is worse than no
test, because it reports confidence it has not earned. When adding a regression
test, break the fix on purpose and confirm the test fails.

A test asserting an implementation detail rather than a behaviour will break on
a harmless refactor and be deleted by whoever it inconveniences, which costs the
coverage it was written for.

## Traceability

A capability with no test named against it is either untested or untraceable,
and both are findings. The traceability record maps each capability to its
implementation and its test, which is what an assessor asks for.

## In this repository

Five test files, 829 lines total, and `TESTING.md` is a real, accurate
guide to them — worth noting explicitly given how unreliable this
repository's other documentation turned out to be (see ChallengeATO):
every claim in `TESTING.md` was checked directly against the code and
held up, including the exact test file list and the
`GEOFORGE_MOCK_ANALYSIS=1` deterministic-CLI-testing mechanism.

- `cli.test.ts` (308 lines) and `cli-unit.test.ts` (296 lines) — CLI
  contract and unit-level behavior, the largest share of this suite.
- `cli-integration.test.ts` (118 lines) — integration tests using a
  fixture-backed mock analysis mode (`tests/fixtures/analysisResult.json`),
  removing network dependency and keeping the suite deterministic — a
  real, deliberate design choice named as such in `TESTING.md`.
- `generator-security.test.ts` (45 lines) — small but targeted: newline
  injection prevention in `robots.txt`, XML escaping in `sitemap.xml` (see
  ChallengeAPI). The one place this repository's security claims and its
  actual test coverage agree.
- `generator.test.ts` (62 lines) — general generation-core behavior.

`TESTING.md` also names, explicitly, what's *not* tested and why:
deprecated CLI options (`--no-error-pages`, `--no-favicons`) and the
generated `404.html`/`500.html` files are intentionally excluded — an
honest scope statement rather than a silent gap.

What's missing: no rendered-UI or component test exists — nothing in
`tests/` touches `src/components/` or `src/pages/` directly. No
accessibility assertion exists (see ChallengeUI). Coverage is measured
(`vitest.config.ts` configures the v8 provider) but not gated — CI runs
`npm run test:run`, not `npm run test:coverage`, so a coverage percentage
is never surfaced automatically.

## Evidence

- Coverage reported on every change.
- End-to-end and accessibility reports retained as artifacts.
- The traceability record.

None of the three is produced automatically. `npm run test:coverage`
works locally and would produce a report; nothing runs or retains it in CI.

## Review checklist

- Does the new capability appear in the traceability record, naming its test?
- Would this test fail if the behaviour regressed? Confirm, do not assume.
- Does a database test run against a real schema rather than a mock?
- Is a test asserting an implementation detail that will break on a harmless
  refactor?
- **This repository-specific:** does `TESTING.md` get updated in the same
  PR as a new test file, the way it already accurately reflects the
  current five? That document has earned trust by staying accurate —
  worth protecting that rather than letting it drift the way `SECURITY.md`
  and `PRIVACY.md` already have (see ChallengeATO).
