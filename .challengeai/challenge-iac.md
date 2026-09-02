# ChallengeIaC

Infrastructure: what is provisioned, what it costs, and where the authorization
boundary falls.

## Covers

Infrastructure as code, FedRAMP service selection, the authorization boundary,
and the cost consequences of a topology.

## The requirement

- **FedRAMP** authorizes cloud service offerings. Using an authorized service at
  the required impact level lets the system inherit the controls that service
  already satisfies.
- **SP 800-53 Rev. 5** Configuration Management, applied to infrastructure: the
  deployed configuration has to be reviewable and controlled.

Inheritance is only valid for services inside the authorized boundary at the
authorized level. Checking that before adopting a service is a design step, not
an assessment finding.

## Declared, not clicked

Infrastructure that exists because someone configured it by hand is
infrastructure nobody can review, reproduce, or diff. Declaring it makes the
deployed state readable, and makes a change to it something that can be
approved.

The declaration is checked for syntax and validity as a gate, and the same
declaration is what gets applied, so the reviewed configuration and the running
one are the same artifact.

## In this repository

No IaC tool of any kind (Terraform, Bicep, CloudFormation) is in use. The
real, actually-used topology is simple: a static SPA on Netlify, deployed
by `ci.yml` (see ChallengeCD). `netlify.toml` is the entire real
infrastructure declaration — build command, publish directory, one
SPA-fallback redirect rule.

`Dockerfile` and `docker-compose.yml` exist, but the `Dockerfile` itself
doesn't actually build — see ChallengeCD for the specific defect (a
production-only dependency install followed by a build step that needs a
dev-only tool). Neither is part of the production deployment path either
way — see ChallengeCD for why
`DEPLOYMENT.md`'s presentation of Docker (and Vercel, and GitHub Pages) as
deployment options is misleading relative to what `ci.yml` actually does.

FedRAMP authorization doesn't bind this system's choice of Netlify — no
agency operator, no federal data (see ChallengeATO, federal-context.md).

## Boundary

What the system provisions is the boundary. Everything else is inherited from
the provider and is named as inherited rather than claimed as implemented.

This system provisions almost nothing itself — a Netlify site, built and
deployed by CI. The two third-party proxy services it calls at runtime
(`api.allorigins.win`, `api.codetabs.com` — see ChallengeEA, ChallengeATO)
are outbound dependencies, not infrastructure this repository provisions,
but worth naming here too since they're a real boundary crossing this
system's actual topology includes.

## Cost

Cost-relevant settings are variables, each carrying its reasoning. A default was
usually chosen against a measurement, and keeping the reasoning next to it means
the next person changes it knowingly.

Topology drives cost more than instance sizing does, and the expensive parts are
usually the ones added without being noticed: an always-on gateway, a
cross-region transfer, a log stream with no retention.

Nothing here is a hardcoded cost-relevant setting needing extraction — a
static site with no backend has essentially no cost surface this
repository controls, beyond Netlify's own bandwidth/build-minute pricing.

## Evidence

- The infrastructure declaration is the record of what is provisioned.
- Validation results from the pipeline.
- Variables and their reasoning.

`netlify.toml` is real, minimal, accurate evidence — genuinely so, unlike
`DEPLOYMENT.md` (see ChallengeCD). Nothing in CI validates it directly
beyond the build succeeding.

## Review checklist

- Is this service authorized at the required impact level?
- Does this change move anything across the authorization boundary?
- Is a cost-relevant setting hardcoded rather than declared as a variable with
  its reasoning?
- Does the running configuration still match what is declared?
- Is a new resource missing a retention or lifecycle setting, leaving it at the
  provider default?
- **This repository-specific:** is `Dockerfile` actually fixed (or
  removed) before `DEPLOYMENT.md` is relied on again? It currently
  documents `docker build`/`docker-compose up` as working commands, and
  neither one succeeds — see ChallengeCD.
