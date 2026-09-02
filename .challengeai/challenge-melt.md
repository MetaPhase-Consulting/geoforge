# ChallengeMELT

Metrics, events, logs, and traces: whether an operator can tell what happened.

## Covers

Observability coverage, alerting, audit logging, retention, and runbooks.

## The requirement

- **SP 800-53 Rev. 5** Audit and Accountability (AU) is the core family: what is
  recorded, protected, retained, and reviewed.
- **The Federal Records Act** governs retention and disposition. Records are kept
  on a schedule rather than until storage becomes inconvenient.
- **Incident Response (IR)** depends on this: an incident that cannot be
  reconstructed cannot be reported accurately.

## What gets recorded

- **Audit records are tamper evident and retained on a schedule**, not rotated
  by size. They exist to be read later by somebody investigating something.
- **Application logs carry no personal information and no secrets.** A log line
  is a permanent record in an environment where records are discoverable.
- **Absence is monitored as well as failure.** A scheduled job that stops
  running produces no errors at all, so the alarm is on the job not having run
  rather than on it having failed.

## Alerting

An alarm fires on a condition an operator can act on. An alarm nobody acts on
trains people to ignore alarms, which leaves the system worse off than having no
alarm at all.

Every alarm therefore has an action attached, and that action lives in a runbook
carrying the actual commands rather than describing them.

## In this repository

There's no logging, metrics, or tracing infrastructure of any kind — no
server exists to log anything (see ChallengeIaC), and the client-side app
doesn't call out to any logging or monitoring service. Confirmed directly:
no analytics script, no error-tracking SDK (Sentry, despite
`DEPLOYMENT.md` recommending it — see ChallengeCD for that document's
broader reliability problem), and no telemetry call anywhere in `src/` or
`index.html`. **This is one specific place `PRIVACY.md`'s claims actually
hold up** — "No Analytics" and "No Tracking" are both true, confirmed
independently, in contrast to the same document's false "No Third Parties"
claim (see ChallengeATO).

`SECURITY.md` claims "DDoS protection and monitoring" and "Security
monitoring and alerting" under Infrastructure Security — neither is
configured or implemented anywhere in this repository; whatever exists,
if anything, is entirely Netlify's own platform behavior, not something
this codebase sets up.

The analysis errors this system does surface (the proxy-fallback warning
in `websiteAnalyzer.ts`/`cliWebsiteAnalyzer.ts` — see ChallengeEA) go into
the in-memory `results.errors` array returned to the caller, not to any
persistent log an operator could review after the fact. That's reasonable
for a stateless client-side tool with no operator role to speak of — worth
naming as appropriate rather than as a gap, unlike the sweeping monitoring
claims above.

There's no scheduled job in this repository (the weekly dependency-hygiene
workflow is GitHub Actions' own cron, not something this codebase
monitors for), so "absence is monitored" has nothing local to apply to.

## Retention

Retention is a decision with a records-schedule basis, recorded where the log
is configured. Changing it is a compliance change, not a cost optimization.

Not applicable — no log stream exists to have a retention setting.

## Evidence

- Alarm definitions declared as code, so they are reviewable.
- Runbooks versioned with the system.
- Retention declared rather than left at a provider default.

None of the three exists, and — apart from the monitoring/DDoS claims in
`SECURITY.md` — none is claimed to exist either, which is honest by
omission even where other documents in this repository are not honest by
commission.

## Review checklist

- Does a new log line carry anything personal, or any secret?
- Does a new scheduled task have an alarm on it not running?
- Does a new alarm have an action, or does it only notify?
- Is retention on a new log stream declared?
- Would this incident be reconstructable from what is recorded today?
- **This repository-specific:** if `SECURITY.md` is rewritten to match
  reality (see ChallengeATO), does the "Security monitoring and alerting"
  and "DDoS protection and monitoring" language get removed rather than
  softened? There's genuinely nothing to soften it into — no monitoring
  of any kind exists today.
