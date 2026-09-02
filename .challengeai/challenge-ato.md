# ChallengeATO

Authorization readiness: whether this system could be assessed today and whether
the evidence would hold.

## Covers

Control traceability, evidence sufficiency, the security package, the privacy
assessment, and bounded penetration testing against a running instance.

## The requirement

- **FISMA** requires federal systems to implement an information security
  program and to be authorized before operating.
- **NIST SP 800-37 Rev. 2** defines the Risk Management Framework.
- **FIPS 199** categorizes the system as low, moderate, or high impact. The
  categorization drives everything downstream, and it is recorded in
  `profile.yml`.
- **NIST SP 800-53 Rev. 5** provides the control baseline the categorization
  selects.
- **NIST SP 800-53A Rev. 5** provides the procedures an assessor uses.
- **The E-Government Act** requires a Privacy Impact Assessment where a
  system handles information **in identifiable form** — not merely
  information "about" individuals in aggregate — or initiates a qualifying
  electronic collection from ten or more non-federal persons.

## The package

A security package is a set, numbered so it can be handed over as one. The
System Security Plan describes the system, its boundary, and how each control is
met. Around it sit the assessment plan and report, the plan of action and
milestones, the risk assessment, the contingency and incident response plans,
configuration management, access control policy, continuous monitoring, and the
privacy impact assessment.

The boundary described in the SSP is the boundary the system actually
provisions. Anything outside it is inherited from the provider's own
authorization and is named as inherited rather than claimed.

## In this repository

No formal security package exists — no `docs/security/`, no SSP, no FIPS
199 categorization, no POA&M. `profile.yml` records `control_baseline: null`
and `impact_level: null` because none is pursued, appropriate for a free
public tool with no accounts and no agency operator.

**What this repository does have is `SECURITY.md` and `PRIVACY.md` — and
neither holds up against the actual code, more so than in any other repo
reviewed in this suite.** Checked claim by claim rather than dismissed
wholesale:

| Claim | Source | What was actually found |
|---|---|---|
| "SOC 2 Type II compliant hosting" | `SECURITY.md` | Not backed by this repository's own controls — at most describes Netlify's own certification (unverified from here either), presented as if it's this project's compliance status. |
| "DDoS protection and monitoring" | `SECURITY.md` | No monitoring or protection configured anywhere in this repository; whatever exists is Netlify's platform default, not something this codebase implements. |
| "Content Security Policy (CSP) headers" | `SECURITY.md` | Not backed. `netlify.toml` has no `[[headers]]` block; no CSP meta tag in `index.html`. |
| "CSRF protection for form submissions" | `SECURITY.md` | Describes a feature that doesn't exist — there is no server-side form submission anywhere in this application; it's fully client-side with no backend (see ChallengeIaC). CSRF protection is meaningless without a server session to forge a request against. |
| "File upload security with size and type limits" | `SECURITY.md` | Describes a feature that doesn't exist — no file upload input was found anywhere in `src/`. This tool generates files for download; it doesn't accept uploads. |
| "Input validation and sanitization for all user inputs" / "XSS protection in generated content" | `SECURITY.md` | **Real, and well-tested.** `tests/generator-security.test.ts` specifically asserts newline-injection prevention in `robots.txt` output and XML-escaping in sitemap `<loc>` values. This is the one security claim in the document that's both true and independently verified by a test. |
| "Available through our security/privacy/support/emergency contact form" | `SECURITY.md`, `PRIVACY.md` (four separate references) | None of these forms exist anywhere in `src/`. There is no contact form of any kind in this application. |
| "PGP Key available upon request" | `SECURITY.md` | No PGP key, no key-request mechanism, no evidence this was ever set up. |
| "GDPR compliance considerations," "NIST Cybersecurity Framework alignment," "OWASP Top 10 protection" | `SECURITY.md` | Generic compliance-framework namedropping with no corresponding control mapping or evidence anywhere in this repository. |
| "No Third Parties: No data goes to third parties" | `PRIVACY.md` | **Directly false as written.** When a direct site fetch fails, both the web and CLI analyzers relay the user-submitted URL through `api.allorigins.win` or `api.codetabs.com` (see ChallengeEA) — a real, code-present, named third-party data flow, not a hypothetical. |

The pattern across the table: claims about *this application's own code*
(CSP, CSRF, file upload, most of the compliance-framework list, the
contact forms) are fabricated or describe nonexistent features. The one
specific, narrow, checkable technical claim — input sanitization against
injection in generated output — is true and backed by a real regression
test. That's not a coincidence worth glossing over: it suggests
`SECURITY.md` and `PRIVACY.md` were drafted from a generic template rather
than written from this system, while the actual engineering work (tests,
sanitization, the CI audit gate) was done with real care.

## Evidence

- Pipeline output produced on every run: scan results, test reports, and a
  component inventory.
- A traceability record mapping each capability to its implementation and test.
- A reviewable record of the deployed configuration, so the boundary can be
  checked rather than taken on description.

CI produces real, blocking scan output (`npm audit --audit-level=high`, no
`continue-on-error` — see ChallengeCI) and a real test run. No component
inventory (SBOM) and no traceability record exist. Nothing here is
retained as an artifact.

## Review checklist

- Does the SSP describe the system as it is now, or as it was at the last
  release?
- Is every control claim backed by something a reader can open?
- Does the boundary in the SSP match what is actually provisioned?
- Has the data model started handling personal information the PIA does not
  mention?
- **A weakness, POA&M item, or vulnerability goes into a security document only
  with explicit approval.** Cataloguing theoretical gaps manufactures a record
  of insecurity. State what is implemented; independent assessment produces the
  authoritative findings. This repository has no formal security document to
  add a finding to — the table above states what was independently checked
  against the actual code, distinct from fabricating a new POA&M-style
  finding.
- **This repository-specific, and the highest-priority fix this file
  points to:** `SECURITY.md` and `PRIVACY.md` need to be rewritten from
  what this system actually does, not incrementally patched — too much of
  each document describes controls, features, and contact mechanisms that
  don't exist. A partial fix that leaves some fabricated claims standing
  is worse than either fixing all of it or clearly marking it as a
  known-stale placeholder.
