# ChallengeUI

The interface: whether everyone can use it, and whether it reads as what it
actually is.

## Covers

Section 508 conformance, WCAG 2.0/2.1 Level AA, USWDS conventions, and the line
between following federal design conventions and implying government authorship.

## The requirement

- **Section 508 of the Rehabilitation Act** requires federal electronic and
  information technology to be accessible to people with disabilities.
- **WCAG 2.0 Level AA** is the technical standard the Revised Section 508
  Standards actually incorporate by reference — not 2.1. A project may adopt
  WCAG 2.1 AA (a superset, adding criteria like reflow and orientation) as
  its own stricter target, which is a project choice beyond the legal
  minimum, not what the statute itself requires — worth keeping distinct in
  anything that becomes ATO evidence. `profile.yml`'s `accessibility` field
  records which one a given project actually targets.
- **The U.S. Web Design System** is the shared design system for federal
  websites. It is a convention rather than a statute, and following it makes a
  federal site behave the way its users already expect.

Accessibility here is a legal obligation. A failure is a compliance matter, not
a defect to prioritize against other work.

## What automated checks reach

An automated rule engine catches a meaningful share of WCAG failures and is
worth running on every route, at more than one viewport, as a gate. It does not
reach reading order, focus order that is technically valid but incoherent, alt
text that is present but wrong, or whether an error message actually tells
someone what to do.

Reflow at a 320 CSS-pixel viewport — WCAG 1.4.10, which corresponds to 400%
zoom on a common 1280px desktop width, not 200% — is checkable and often
missed. It's a distinct requirement from WCAG 1.4.4's 200% text-resize check;
testing only to 200% zoom can miss horizontal-scrolling failures that only
appear at the 400%/320px reflow condition. Both remain largely manual passes.

Contrast is measured rather than judged by eye, and the measured ratio is
recorded next to the color pair it describes, so a later change to a token is a
visible change to a number.

## In this repository

`SECURITY.md` lists "WCAG 2.1 AA accessibility standards" under
"Compliance" as though it were an established fact. It isn't: no
automated accessibility check exists anywhere (no `eslint-plugin-jsx-a11y`,
no axe-core, no Lighthouse check, no CI step — see ChallengeCI), and
`aria-`/`role` usage appears in only 3 files (`Header.tsx`,
`CommandLine.tsx`, `Online.tsx`), confirmed directly via a repository-wide
search. That's real but modest effort, well short of a conformance claim
nothing in this codebase verifies. `profile.yml` records
`accessibility: null` rather than repeating `SECURITY.md`'s unbacked claim.

## Who operates the service

A system that returns government data, or follows federal design conventions,
still says who operates it. Attribution is reachable from every route, and the
operator is named where a reader goes looking.

Federal seals, agency logos and wordmarks, and wording claiming agency
authorship stay out. USWDS conventions are deliberate and permitted by this
rule, which governs attribution rather than appearance.

MetaPhase attribution is real: `Footer.tsx` links `metaphase.tech`
directly, and the GitHub repository link appears across `Hero.tsx`,
`About.tsx`, and `CommandLine.tsx`. No federal seal, agency logo, or
official government wordmark was found anywhere in `src/` or `public/` —
this repository doesn't present as a government product in any way, and
that check holds up cleanly, unlike the compliance-badge situation
elsewhere in this suite.

## Evidence

- A per-route accessibility assertion in the test suite, failing the build.
- A scan of every rendered route at more than one viewport, with its report
  retained.
- Contrast ratios recorded alongside the tokens they describe.

None of this exists. The real test suite (`tests/generator*.test.ts`,
`tests/cli*.test.ts` — see ChallengeTDD) covers generation logic and CLI
behavior, not rendered UI or accessibility.

## Review checklist

- Does every interactive element reach keyboard focus, in a visible way?
- Does every image carry alt text, and every form control a label?
- Is anything conveyed by color alone?
- Does the page survive 200 percent text resize (WCAG 1.4.4)?
- Does the page reflow without horizontal scrolling at a 320px viewport
  (WCAG 1.4.10, i.e. 400% zoom) — checked separately from the 200% case above?
- Does any new copy imply this is an official government system?
- Is a heading level skipped, and is there exactly one `h1`?
- **This repository-specific:** before `SECURITY.md`'s WCAG claim is kept,
  removed, or qualified, does an actual accessibility scan run against it
  at least once? A claim this specific deserves either real verification
  or removal — leaving it as an unverified assertion is worse than saying
  nothing.
