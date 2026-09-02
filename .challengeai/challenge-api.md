# ChallengeAPI

The API: its contract, what it accepts, and what it discloses.

## Covers

API contracts, input validation, interoperability, versioning, rate limiting,
and federal API governance.

## The requirement

- **SP 800-53 Rev. 5** System and Communications Protection (SC) and System and
  Information Integrity (SI-10, input validation).
- **The Federal Source Code Policy and API guidance** expect government APIs to
  be documented, versioned, and stable for the people who build against them.
- **OMB guidance on open data** expects machine-readable access where the data
  is public.

## The contract

An API is a promise to people who cannot be consulted before it changes.

- **Versioned in the path**, moving independently of the product release, so
  adding a version does not by itself require a major release of the system.
- **Published as a machine-readable document**, so a client can generate against
  it rather than read prose.
- **Validated at the edge of the process.** Every parameter is parsed and
  bounded before it reaches a query. Unbounded pagination and unbounded result
  sizes are both denial-of-service vectors and cost vectors.
- **Health reported against dependencies**, not just process liveness. A process
  that is up and cannot reach its data is not healthy.
- **Rate limited at the edge**, so a burst is refused rather than queued.

## Errors

An error names what was wrong with the request without describing the internals
of the system. A stack trace, a driver message, or a query fragment in a
response body is an information disclosure finding.

## In this repository

GEOforge has no API of its own — no backend, no server route (see
ChallengeIaC). The closest analog is worth reviewing on its own terms
rather than forced into this tool's contract-versioning language: the
generated output files (`robots.txt`, `sitemap.xml`, `.well-known/ai.txt`,
`.well-known/security.txt`, `manifest.json`, `browserconfig.xml`,
`ads.txt`, `app-ads.txt`, `geoforge.json`) are what this system actually
publishes to a caller, whether through the web UI's download/ZIP or the
CLI's file output — and the shared generation core is genuinely careful
about how it produces them:

- **Validated at the edge:** real. `tests/generator-security.test.ts`
  confirms two specific, targeted protections in the shared generation
  core — newline injection into `robots.txt` lines is prevented, and XML
  `<loc>` values in `sitemap.xml` are escaped. This is real defense
  against a real risk: these generated files are typically deployed
  directly to a production web root, so an injection into them isn't just
  an app-level bug, it's a vector into whatever site adopts the output.
- **The actual network-facing "API" this system calls is outbound, not
  inbound:** the website analyzer fetches the target URL directly, falling
  back to `api.allorigins.win`/`api.codetabs.com` when a direct request is
  blocked (see ChallengeEA, ChallengeATO). Neither proxy call is bounded
  by a timeout beyond the fixed `FETCH_TIMEOUT_MS`/`FILE_CHECK_TIMEOUT_MS`
  constants — real bounds, though not configurable per-request.
- **Versioning / published contract:** not applicable — there's no API
  surface a third party integrates against, aside from the published
  `geoforge-cli` npm package itself, which is versioned normally
  (semver, currently `0.1.2`, matching the npm registry — see
  `profile.yml`).
- **Rate limiting:** not applicable to an inbound surface that doesn't
  exist. Worth naming the inverse concern instead: nothing in this
  codebase rate-limits *outbound* calls to the two proxy services, so a
  user analyzing many URLs in quick succession (via the CLI in a script,
  for instance) could generate meaningful traffic against those two free
  third-party services with no local throttling.

## Evidence

- The published contract document.
- Route tests exercising the documented behaviour, including failure cases.

No API contract document applies. `tests/generator-security.test.ts` and
`tests/generator.test.ts` are real evidence for the output-generation
behavior that functions as this system's actual "contract" with anyone who
deploys the generated files.

## Review checklist

- Is every new parameter validated and bounded?
- Does a new route appear in the contract document in the same pull request?
- Does an error response leak an internal detail?
- Does a change alter the shape of an existing response? That is a breaking
  change to a published contract, and it belongs behind a new version.
- Is anything personal placed in a URL, where it reaches logs and history?
- **This repository-specific:** does a new generated output type get a
  corresponding security regression test in the style of
  `generator-security.test.ts` before it ships? That test file is small
  (45 lines) but targets exactly the risk that matters for this system —
  worth treating as the minimum bar for any new output format, not just
  the two it currently covers.
