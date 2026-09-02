# What is different about building for the federal government

Commercial software ships when the team decides it is ready. A federal system
ships when someone with authority accepts the risk of operating it, in writing,
on the strength of evidence the team produced while building. That single
difference drives most of what follows.

GEOforge has no ATO in flight and pursues none — see ChallengeATO. It's a
free, public developer tool (generates `robots.txt`, `sitemap.xml`, AI-crawler
manifest files), not built for or operated on behalf of any agency.

## Authorization to Operate

A federal information system needs an ATO before it carries real data or real
users. An authorizing official signs it, and signs a specific system with a
specific boundary at a specific point in time.

The process is the NIST Risk Management Framework, SP 800-37 Rev. 2:

1. **Prepare** establish context, roles, and risk tolerance
2. **Categorize** the system against FIPS 199, as low, moderate, or high impact
3. **Select** the SP 800-53 Rev. 5 control baseline the categorization implies
4. **Implement** the controls
5. **Assess** whether they work, using SP 800-53A Rev. 5 procedures
6. **Authorize** the system, accepting residual risk
7. **Monitor** continuously, because an ATO describes a system that keeps changing

A system's categorization is recorded in `profile.yml`. This one is `null` —
not a federal information system, no categorization performed.

**The consequence for development.** Evidence is a build output, not a document
written at the end. A control that was implemented but never evidenced is
indistinguishable, to an assessor, from one that was not implemented.

## Authorization is a claim, and claims are checkable

"Authorized", "compliant", and "accredited" describe a decision an authorizing
official made about a specific system at a specific time. Use them where that
decision exists, and describe the standards a system is built against where it
does not. Both are accurate statements; only one of them is checkable against a
signature.

**This is the central finding of this review, not a minor caveat.**
`SECURITY.md` claims "SOC 2 Type II compliant hosting," "DDoS protection and
monitoring," "NIST Cybersecurity Framework alignment," "GDPR compliance
considerations," and "WCAG 2.1 AA accessibility standards," among others.
`PRIVACY.md` claims "No Third Parties: No data goes to third parties."
`DEPLOYMENT.md` documents environment variables, staging environments, and
a Vercel/GitHub Pages deployment story none of which exist in this
codebase. None of these three documents was checked against the actual
code before this review — see ChallengeATO, ChallengeUI, and ChallengeCD
for the specific, verified corrections. This is a materially larger gap
between public claim and implementation than any other repo reviewed in
this suite so far.

## Accessibility is law

Section 508 of the Rehabilitation Act requires federal electronic and
information technology to be accessible to people with disabilities. The
Revised Section 508 Standards incorporate **WCAG 2.0 Level AA** by reference
as the technical standard; WCAG 2.1 AA is a valid but stricter voluntary
target a project may adopt on top of it — a project choice distinct from what
the statute itself requires, worth keeping distinct wherever this feeds ATO
evidence (see ChallengeUI for what a given project targets specifically).
`SECURITY.md` claims "WCAG 2.1 AA accessibility standards" as a compliance
item; see ChallengeUI for what's actually implemented and verified against
that specific claim.

Accessibility is a legal obligation with a compliance consequence: a complaint
is a legal matter. The intended posture is to gate on it rather than merely
report it, and a claim of conformance is made on the strength of a scan
someone can open — but whether a given repository's CI actually enforces
that gate today, versus still reporting advisory, is a fact recorded in
`profile.yml`'s `gates` section, not assumed from this general principle.

## Cloud services carry their own authorization

FedRAMP authorizes cloud service offerings so that agencies do not each assess
the same provider. Building on an authorized service means inheriting the
controls that service already satisfies, and inheriting them is only valid for
services actually in the authorized boundary at the authorized level.

Choosing a service that is not authorized at the required level means either
authorizing it independently or not using it. This is a design constraint at the
moment of choosing a service, not a discovery to make during assessment. Not
a live constraint for this tool — see ChallengeIaC. Worth noting regardless:
this system's own website-analysis feature calls two named third-party proxy
services (`api.allorigins.win`, `api.codetabs.com`) as a CORS-fallback path
— unauthorized, uncontrolled third parties by any federal standard, though
the analyzed content is a public website's own markup, not this system's
private data. See ChallengeAPI, ChallengeEA.

## Privacy has its own gate

If a system collects, maintains, or disseminates information about individuals,
the E-Government Act requires a Privacy Impact Assessment. A system of records
retrieved by personal identifier additionally requires a System of Records
Notice published in the Federal Register.

The PIA is written from what the system actually does with personal
information, so a data model that quietly starts storing an identifier changes
the privacy posture whether or not anyone updates the document. GEOforge
collects no personal information about its own users — no accounts, no
stored user data (see ChallengeSQL) — so `profile.yml` records
`privacy_assessment_required: false`. `PRIVACY.md`'s "No Third Parties"
claim doesn't survive the same check, though — see ChallengeATO.

## Retention and disposition

The Federal Records Act governs what a federal system keeps and for how long.
Retention and disposition follow a records schedule. Audit records in particular
exist to be read later by somebody investigating something, which is why they
are written to be tamper evident and are kept for their scheduled term rather
than rotated once they grow large.

Not applicable — see ChallengeMELT. This system keeps no records of its own.

## The public reads everything

Federal systems operate in public. Repository contents, pull requests, and
issues can become public records. Plain language is required of public-facing
government communication by the Plain Writing Act. This repository is
already fully public (MIT licensed, open source) — everything in it,
including the gap between `SECURITY.md`'s claims and the actual code, is
already readable by anyone.

Two practical rules follow. Nothing permanent carries sensitive account or
resource identifiers, or vulnerability detail — an identifier recorded
deliberately so a reader can verify a deployment target (an AWS account
number in a runbook, say) is a legitimate exception to this rule, not a
violation of it. Dollar figures are a narrower exception still: they stay out
of permanent records where they're incidental, but where cost is the point of
the record — a POA&M's required "Resources required" field, for instance —
stripping the estimate makes the record worse, not more secure. And
documentation states what the system does rather than cataloguing what it does
not, because a system described mostly by its gaps reads as less trustworthy
than one described by its implementation.

## Government data is not government endorsement

Not applicable in the usual sense — this tool doesn't republish government
data or present as a government product.

## What this means day to day

- Build the evidence while building the feature, in the same pull request.
- Treat accessibility as a build break, not a warning — not gated today;
  see ChallengeUI and ChallengeCI.
- Check a service's authorization before adopting it, not after — the
  third-party proxy fallback (above) is exactly the kind of dependency
  this principle exists to catch before it ships, not after.
- Say what is implemented. Findings come from independent assessment, and a
  weakness, POA&M item, or vulnerability goes into a security document only
  with explicit approval. Cataloguing theoretical gaps manufactures a record
  of insecurity. **This repository's `SECURITY.md` and `PRIVACY.md` already
  demonstrate the inverse failure mode** — claiming controls and postures
  that were never implemented or checked — which is at least as serious a
  problem as an undisclosed weakness, since it actively misinforms anyone
  relying on the document. See ChallengeATO.
