# ChallengeCLI

The accelerator itself: the layer that carries the standards in this folder into
Claude and Codex so the work arrives shaped by them.

## Covers

Cross-runtime operation. The same guidance drives both runtimes, which is why
the federal layer lives in `.challengeai/` and the agent files point at it
rather than restating it.

## The requirement

None directly. ChallengeCLI is delivery tooling, and no federal authority
mandates it. It exists so the requirements the other eleven tools cover are
applied while code is written rather than discovered during assessment.

MetaPhase governs the suite under ISO/IEC 42001, the management-system standard
for artificial intelligence, which is what makes its use in federal delivery
defensible.

## One source, two runtimes

Guidance duplicated per runtime drifts, and drift is worse than absence: two
agents then follow two different rule sets while both appear governed. The
federal layer therefore has one home, and each runtime's entry file references
it instead of copying it.

Where a repository maintains parallel agent files, they are kept in agreement
and that agreement is worth enforcing mechanically rather than by habit.

## In this repository

`AGENTS.md` and `CLAUDE.md` exist at the repo root, kept byte-identical
below their shared "Keep this in sync" heading — both point at
`.challengeai/` and `CHALLENGEAI.md` rather than restating the federal
layer, and both carry the same repository-specific operational knowledge
an agent needs before trusting this repo's own documentation: the real
CI branch-trigger bug (see ChallengeCI), and which of `SECURITY.md`/
`PRIVACY.md`/`DEPLOYMENT.md` vs. `README.md`/`TESTING.md` to actually
trust (see ChallengeATO, ChallengeCD). Nothing mechanically enforces the
two files staying in sync — that's still a manual discipline, not a CI
check — so a future edit to one that isn't mirrored to the other is a
real way for them to drift, the exact failure mode this tool's "One
source, two runtimes" principle warns about.

## Evidence

The folder is the evidence. Someone reading `.challengeai/` can see what the
team was held to without interviewing anyone.

## Review checklist

- Do the parallel agent files still agree with each other?
- Is anything here duplicated into a runtime-specific location, where the two
  copies will drift?
- Has a repository-specific detail leaked into a tool file? It belongs in
  `profile.yml`, this file's `In this repository` section, or the repository's
  own documentation.
- Does user-facing copy describe ChallengeAI as a feature of the product? It is
  how the product was built, and saying otherwise is wrong.
