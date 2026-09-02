# ChallengeSQL

The data layer: correctness, performance, and who can reach what.

## Covers

Schema design, query correctness and performance, migrations, and database-level
access control.

## The requirement

SP 800-53 Rev. 5 Access Control (AC), Audit and Accountability (AU), and System
and Communications Protection (SC-28, protection at rest). Where the data
concerns individuals, the Privacy Act and the PIA govern what may be stored and
for how long.

## Access

- **Reached through a server-side layer.** The browser holds no database
  credential and issues no query.
- **Least privilege by role.** The application connects as a role holding narrow
  per-table grants rather than as the owner, and something asserts those grants
  so a migration that widens access fails rather than passing silently.

  Build this early. A role added after the schema has grown means auditing every
  table to work out what the application actually needs.
- **Row-level security enabled and forced** on tables that carry it, so the
  owner cannot bypass the policy by accident.

## Migrations

Migrations are checksummed, and the runner records a hash of each file.

**An applied migration is never edited, comments included.** Changing one makes
the runner report a mismatch on every subsequent run, and the fix for a bad
migration is another migration.

## Performance

Queries that touch a growing table are checked against a plan rather than
against intuition. An index helps only when the planner chooses it, and a join,
a function on a column, or a mismatched type will each quietly defeat one.

## In this repository

There is no database of any kind — no SQL, no NoSQL, no persistence layer.
Confirmed by a repository-wide search: no database client library in
`package.json`, no connection string or ORM anywhere in the code.
Everything this system handles is transient and processed entirely
client-side or CLI-process-local:

- **The URL a user submits for analysis** and the resulting page content
  fetched from it (directly, or via the proxy fallback — see ChallengeEA,
  ChallengeAPI) exist only in memory for the duration of the analysis, in
  the browser tab or the CLI process. Nothing is written to disk except
  the generated output files the user explicitly requests, and the CLI's
  own file-system writes of those outputs.
- **`tests/fixtures/analysisResult.json`** is a static, committed test
  fixture (used with `GEOFORGE_MOCK_ANALYSIS=1` — see ChallengeTDD),
  carrying no real user data.

Every requirement in this tool file's "Access," "Migrations," and
"Performance" sections is structurally inapplicable, the same as for the
other backend-less repositories in this suite.

## Evidence

- The migration history is the schema history.
- The grants held by the application role, and whatever asserts them, are the
  access-control evidence.
- Database tests run against a real migrated database rather than a mock.

None of this applies. If persistence is ever added to this system (a saved
analysis history, for instance), this tool file's requirements become live
and need rewriting from an actual schema — not before.

## Review checklist

- Does this migration edit one that has already been applied?
- Does a new table need row-level security, and is it forced as well as enabled?
- Does the application role get the narrowest grant that works?
- Does a new query have a plan that uses the index it was written for?
- Does a new column hold personal information the PIA does not mention?
- **This repository-specific:** if persistence is ever added, does
  `profile.yml`'s `privacy_assessment_required: false` get revisited in
  the same change? The URLs users submit for analysis could plausibly
  include ones that reveal something about the submitter's own
  organization or intent — worth a real privacy check the moment any of
  that starts being stored rather than processed transiently.
