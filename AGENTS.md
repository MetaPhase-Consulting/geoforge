# AGENTS.md — GEOforge

**Keep this in sync with [`CLAUDE.md`](CLAUDE.md) — the two files carry the same guidance for Codex and Claude Code respectively; update both together.**

## About This Repo

**GEOforge** generates AI-ready website files — `robots.txt`, `sitemap.xml`, `.well-known/ai.txt`, `.well-known/security.txt`, `manifest.json`, `browserconfig.xml`, `ads.txt`, `app-ads.txt` — via a web UI and a CLI, built by MetaPhase.

Built with **ChallengeAI**, MetaPhase's accelerator suite for federal software delivery. The federal layer lives in [`.challengeai/`](.challengeai/); [`CHALLENGEAI.md`](CHALLENGEAI.md) is the index. GEOforge is not itself a federal information system — `.challengeai/profile.yml` and `challenge-ato.md` say so directly, and also document real drift between `SECURITY.md`/`PRIVACY.md`/`DEPLOYMENT.md` and the actual code that hasn't been reconciled yet.

## Architecture

- Shared types: `src/shared/types.ts`
- Shared generator core: `src/shared/generationCore.ts`
- Web analyzer: `src/services/websiteAnalyzer.ts`
- CLI analyzer: `src/cli/cliWebsiteAnalyzer.ts`

`src/cli` is the CLI source of truth. `cli-package/src` is synced from it via `npm run sync:cli-package` (`scripts/sync-cli-package.sh`, an `rsync --delete`) — this runs automatically as part of `npm run build:cli`, so the published `geoforge-cli` npm package can't silently drift from root `src/` without a build failure surfacing it.

**Known duplication:** the web analyzer and CLI analyzer each define their own copy of the third-party CORS-fallback proxy list (`api.allorigins.win`, `api.codetabs.com`) and its retry logic — not shared via `src/shared/`, so a change to one doesn't propagate to the other. Update both if you touch this.

## Build, Test, and Development Commands

- `npm run dev` — Vite dev server
- `npm run build` — production build (`vite build && npm run build:cli`)
- `npm run build:cli` — syncs `cli-package/` then compiles the CLI (`tsc --project tsconfig.cli.json`)
- `npm run lint` — ESLint (v10 flat config)
- `npm test` — Vitest watch mode
- `npm run test:run` — rebuilds the CLI first, then runs Vitest once (this is what CI runs)
- `npm run test:coverage` — Vitest with v8 coverage (not run in CI)

## Tech Stack

- React 18 + TypeScript + Vite (SPA)
- Commander (CLI argument parsing)
- Vitest + `@vitest/coverage-v8` for tests
- ESLint v10 flat config
- Tailwind CSS
- `jsdom` for server-side-style HTML parsing during analysis

## Testing

`TESTING.md` is accurate and current — read it before adding tests. Five files, ~829 lines:

- `cli.test.ts`, `cli-unit.test.ts` — CLI contract and unit behavior (largest share of the suite)
- `cli-integration.test.ts` — fixture-backed (`tests/fixtures/analysisResult.json`), deterministic via `GEOFORGE_MOCK_ANALYSIS=1`, no network dependency
- `generator-security.test.ts` — small but critical: newline-injection prevention in `robots.txt`, XML-escaping in `sitemap.xml`. Any new generated-output type should get a test here before it ships.
- `generator.test.ts` — general generation-core behavior

No rendered-UI or accessibility test exists yet.

## Branching & CI — read this before assuming CI ran

- **Default/working branch is `dev`. Release branch is `main`.**
- **`ci.yml`'s push trigger currently listens for `[main, develop]` — not `dev`.** No `develop` branch exists or ever has. **Pushes to `dev` do not trigger CI.** CI only runs on a direct push to `main` or a PR targeting `main`. Don't assume a green check exists for work still on `dev` — it doesn't, until this trigger is fixed. See `.challengeai/challenge-ci.md`.
- CI (`test` job, when it does run): lint, build, `test:run`, and `npm audit --audit-level=high` — all blocking, no `continue-on-error`. Matrix is `[18.x, 20.x]`, but the `18.x` leg is unsupported — the lockfile requires Vite 7.3.6's `^20.19.0 || >=22.12.0`, and `.nvmrc` pins 22 — so that leg can fail before completing the gates. Don't trust an `18.x` failure as a real signal without checking whether it's this engine mismatch first.
- Deploy (`deploy` job, on `main` only): pushes `dist/` to Netlify via `nwtgck/actions-netlify`, using `NETLIFY_AUTH_TOKEN`/`NETLIFY_SITE_ID` GitHub Actions secrets.
- `dependency-hygiene.yml` runs weekly, audits, applies `npm audit fix`, and opens a real PR with the changes — except its own audit step's failing exit code (no `continue-on-error`, no `|| true`) currently skips the fix-and-PR steps whenever a vulnerability actually exists, which is the one case this workflow is meant to handle. Don't assume a moderate+ advisory produced an auto-PR; check directly.

## Known Documentation Drift — do not treat these as ground truth

`SECURITY.md`, `PRIVACY.md`, and `DEPLOYMENT.md` describe controls, environment variables, and deployment targets that don't exist in this codebase (no backend API, no CSP, no file upload, no Vercel/GitHub Pages deploy path, several fabricated "contact forms"). Full details in `.challengeai/challenge-ato.md` and `.challengeai/challenge-cd.md`. Don't cite these three documents as fact without checking the actual code first; `README.md` and `TESTING.md` are accurate and safe to trust.

## Standing Preferences

- **No AI attribution anywhere.** No `Co-Authored-By: Claude`, no "Generated with Claude Code", no model names in commit messages, PR titles, PR bodies, branch names, or code comments.
- Never commit real API keys or `.env` values. This app currently reads no environment variable for its own logic (only `GEOFORGE_MOCK_ANALYSIS`, a CLI test-mode flag).
