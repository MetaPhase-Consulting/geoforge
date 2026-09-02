# ChallengeCD

Deployment: whether a release can be made safely and undone quickly.

## Covers

Rollout safety, rollback readiness, secrets handling, and the operational
controls around putting a change in front of users.

## The requirement

SP 800-53 Rev. 5 Configuration Management (CM-3 change control, CM-5 access
restrictions for change) and Contingency Planning (CP-10 system recovery). An
authorized system must be able to show that changes are controlled and that a
bad change can be reversed.

## Know where the risk is actually taken

Every deployment model takes the risk somewhere. What matters is that everyone
knows where, because a branch treated as a safety gate that does not gate
anything is worse than no gate: it produces confidence without protection.

Where a promotion redeploys code that is already live, the promotion names a
version rather than de-risking anything, and the risk was taken earlier.

## Rollout and rollback

- **Health-gated rollout**, so a release that never passes its health check
  reverses itself rather than waiting to be noticed.
- **Rollback documented and rehearsed.** A procedure that has never been run is
  a hypothesis.
- **Credentials from short-lived federated identity**, so no long-lived key
  exists to leak or rotate.

A change that cannot be rolled back without also reversing a data migration is
a different class of change, and saying so at review time is the point.

## In this repository

Real deployment exists, and it's worth describing precisely because it
differs from the pattern used elsewhere in this suite. `.github/workflows/ci.yml`'s
`deploy` job, gated on the `test` job passing and on being on `main`,
pushes `dist/` to Netlify via `nwtgck/actions-netlify@v2.0`, authenticated
with `NETLIFY_AUTH_TOKEN`/`NETLIFY_SITE_ID` held as long-lived GitHub
Actions secrets — a real, working, credential-based deploy, unlike most
sibling repos' Netlify-GitHub-App auto-deploy (which needs no secret held
in Actions at all). That's a real deviation from this tool's "short-lived
federated identity" principle, though a common and reasonable one for a
project this size — worth naming rather than treating as equivalent to a
proper OIDC flow. There's no explicit health check after deploy and no
documented rollback procedure; whatever Netlify's own deploy history
provides is the only rollback mechanism.

**`DEPLOYMENT.md` does not describe this actual deploy path, or this
actual application, at all — this needs to be stated as directly as the
`SECURITY.md`/`PRIVACY.md` findings in ChallengeATO.** It documents:

- `VITE_API_URL`, `VITE_APP_ENV`, `VITE_DEBUG` environment variables for
  development/staging/production — none of these are read anywhere in
  `src/`, confirmed by a direct search. This application has no backend
  API to point a URL at (see ChallengeIaC), so `VITE_API_URL` describes a
  concept that doesn't apply to this architecture at all.
- A staging environment (`staging-api.geoforge.dev`) that isn't referenced
  anywhere else in this repository.
- Vercel and GitHub Pages as alternative deploy targets, including a
  GitHub Pages `homepage` pointing at `brianfunk.github.io/geoforge` — a
  personal account URL, not MetaPhase's, and not what `ci.yml` actually
  deploys to (Netlify, exclusively).
- Nginx security-header configuration (`Content-Security-Policy`,
  `X-Frame-Options`) presented as this project's setup — nothing in this
  repository runs Nginx; deployment is a static Netlify site.

The real deploy path (`ci.yml` → Netlify via `nwtgck/actions-netlify`) is
never mentioned in `DEPLOYMENT.md` at all. This document appears to be
generic deployment boilerplate that was never adapted to this project,
the same pattern found in `SECURITY.md`/`PRIVACY.md` — see ChallengeATO.

**Docker isn't just unused in the deploy path — the `Dockerfile` itself is
broken and cannot build.** `RUN npm ci --only=production` (equivalent to
`npm ci --omit=dev`) skips installing every devDependency, which is where
`vite` and `typescript` — the build tools the very next step depends on —
both live. The following `RUN npm run build` invokes `vite build`, which
won't be on `PATH` at all, so the image build fails there every time. This
isn't a documentation-vs-reality gap like `DEPLOYMENT.md`'s other claims —
it's a real defect in the `Dockerfile` itself, confirmed by tracing what
each `RUN` step actually has available. `docker-compose.yml`'s `geoforge`
service builds this same broken `Dockerfile` before its `command: npm run
dev` override even runs, so `docker-compose up` fails at the build step
too. Nothing in CI builds or pushes a Docker image, so this defect has
never been caught automatically. `DEPLOYMENT.md`'s "Docker Deployment"
section presents `docker build`/`docker-compose up` as working commands;
they aren't.

## Secrets

Secrets reach the running system at start from a secret store, never from the
repository and never from a build artifact. The repository is scanned on every
push and on a schedule, and a verified finding fails the build.

A value inlined at build time is baked into whatever ships and is readable by
anyone holding the artifact. That can be an acceptable trade, but it is a
decision to make deliberately rather than discover.

This application itself holds no secret — no `.env` file exists, and the
only environment variable read anywhere in the codebase is
`GEOFORGE_MOCK_ANALYSIS` (a CLI test-mode flag, not a secret — see
ChallengeTDD). The two real secrets in this repository
(`NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`) exist only as GitHub Actions
secrets used to deploy, never read by the application itself or baked
into any build artifact.

## Evidence

- Deploy runs recorded per change and retained.
- A release runbook carrying the verification commands and the rollback
  procedure.
- Whatever the platform keeps as the previous good revision is the rollback
  record.

`ci.yml`'s deploy job leaves a real GitHub Actions run record per deploy
(retained per GitHub's own log retention, not extended by this
repository). Netlify's own deploy history is the rollback record. No
release runbook exists — and the one document that could have served as
one, `DEPLOYMENT.md`, describes a different deployment than the one that
actually runs.

## Review checklist

- Does the deploy watch its own run with a failure exit status? A watch that
  returns success whichever way the run ended will let a failed deploy be tagged
  as a release.
- Is the run identified by commit rather than by branch? A branch filter asked
  seconds after a merge returns the previous run, which is already green.
- Can this change be rolled back without a data migration being reversed? If
  not, say so in the pull request.
- Does anything new read a secret at build time rather than at run time?
- **This repository-specific, and the second-highest-priority fix after
  ChallengeCI's branch-trigger bug:** rewrite `DEPLOYMENT.md` to describe
  the actual deploy path — `ci.yml`'s Netlify job via
  `nwtgck/actions-netlify`, the real secrets involved, and the real
  branch/trigger relationship — and either fix the `Dockerfile` (install
  dev dependencies before the build step, or restructure into a
  multi-stage build) or remove the Docker section entirely; it currently
  documents a command that fails. Remove or clearly mark the Vercel/GitHub
  Pages/Nginx sections as untested too — none of it is this project's
  actual setup.
