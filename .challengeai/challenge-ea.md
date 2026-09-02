# ChallengeEA

Enterprise architecture: whether the system fits the environment it has to live
in.

## Covers

Federal architecture alignment, governance rigor, interoperability with agency
systems, and the traceability between a mission need and a technical choice.

## The requirement

- **The Clinger-Cohen Act** requires agencies to manage IT as a capital
  investment, with architecture as part of that discipline.
- **OMB Circular A-130** sets expectations for managing federal information
  resources.
- **The Federal Enterprise Architecture Framework** provides the reference
  models an agency maps its systems against.
- **The Federal Source Code Policy** governs custom-developed code, including
  reuse and, where applicable, release.

## Reasoning travels with the component

An architecture record that captures only the decision leaves the next team to
rediscover the constraint that produced it, and rediscovery usually happens by
reversing the decision and hitting the constraint again.

So each significant choice carries the alternatives that were considered and why
they were not taken, kept next to the description of the component rather than
in a separate decision archive, where somebody changing it will actually
encounter it.

## In this repository

`README.md`'s "Architecture" section is real and accurate: `src/shared/types.ts`
and `src/shared/generationCore.ts` hold the shared generation logic
(242 lines), while `src/services/websiteAnalyzer.ts` (web, 351 lines) and
`src/cli/cliWebsiteAnalyzer.ts` (CLI, 339 lines) implement the actual
site-fetching and analysis separately per surface. `scripts/sync-cli-package.sh`
keeps `cli-package/src/` in sync with root `src/cli/`, `src/config/agents.ts`,
and `src/shared/` via `rsync --delete` — and unlike a sibling repo's manual-only
sync script, this one is wired into the actual build (`npm run build:cli`
runs it automatically, and `npm run test:run` runs `build:cli` first) — so
the published `geoforge-cli` package can't silently drift from root `src/`
without a build failure making that visible.

**One real duplication this sync mechanism doesn't cover:** the web
analyzer and the CLI analyzer each define their own separate, independent
copy of the third-party proxy fallback list (`PROXIES`, pointing at
`api.allorigins.win` and `api.codetabs.com`) and its retry/fallback logic
— not shared via `src/shared/`, so `sync-cli-package.sh`'s file-level sync
doesn't keep them aligned; they just happen to currently match because
both were written the same way. A future change to one (adding a third
proxy, changing the timeout) has no mechanism forcing it into the other.

**The third-party proxy dependency itself is a real, worth-naming
architectural fact, not just a code detail:** when a direct fetch of the
site being analyzed fails (CORS, anti-bot protection), both analyzers
relay the request through `api.allorigins.win` or `api.codetabs.com` and
log that the fallback was used. That's a reasonable engineering choice for
a public browser-side tool with no server of its own to do the fetch
instead — but it means a URL a user submits for analysis, and the full
HTML that comes back, can transit two named third-party services outside
MetaPhase's control. See ChallengeATO for why this directly contradicts a
specific claim in `PRIVACY.md`.

## Boundaries the architecture has to respect

- **The authorization boundary** is what the system provisions and controls. A
  component added outside it changes the security posture and the
  documentation that describes it.
- **Data stays inside the provider boundary** unless a deliberate decision says
  otherwise, and that decision is recorded with its reasoning.
- **Services are chosen from what is authorized** at the required impact level,
  checked before adoption.

Not applicable in the ATO sense — see ChallengeIaC. The third-party proxy
fallback above is the one place this system's "boundary" is genuinely
porous, and it isn't documented as a deliberate decision anywhere.

## Interoperability

Where the system exchanges data with an agency system, the interface is
documented as a contract with a version, and the failure behaviour is
specified. An integration whose failure mode is unspecified becomes an
incident rather than a degraded state.

No agency-system integration exists. The proxy fallback above does specify
its own failure behavior reasonably well — a logged warning
(`errors.push(...)`) rather than a silent substitution — which is worth
crediting even though the dependency itself isn't documented elsewhere.

## Evidence

- Architecture documentation carrying the design and its reasoning.
- A reviewable record of what is actually provisioned.
- The published interface contract.

`README.md`'s architecture section is real, accurate evidence, unusually
so for a document of its kind in this suite (see ChallengeATO, ChallengeUI
for the contrast with `SECURITY.md`/`PRIVACY.md`/`DEPLOYMENT.md`, which
are not).

## Review checklist

- Does this choice have its reasoning recorded next to it?
- Were alternatives considered, and is the reason for not taking them written
  down?
- Does a new component sit inside the authorization boundary?
- Does data leave the provider boundary, and was that decided or assumed?
- Does a new integration specify what happens when the other side is down?
- **This repository-specific:** does a change to the `PROXIES` list or its
  fallback logic get made in both `websiteAnalyzer.ts` and
  `cliWebsiteAnalyzer.ts`, or moved into `src/shared/` so
  `sync-cli-package.sh` actually keeps it aligned going forward? The two
  copies are identical today only by coincidence of when they were last
  each edited.
