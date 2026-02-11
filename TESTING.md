# GEOforge Testing Guide

## Run Tests

```bash
npm run test:run
```

`test:run` rebuilds CLI first, then executes Vitest.

## Current Coverage Areas

- CLI contract and integration behavior
- Shared generation core golden tests
- Security regression tests for output sanitization
- Unit tests for URL/config/compression helpers

## Test Files

- `tests/cli-integration.test.ts`
- `tests/cli.test.ts`
- `tests/cli-unit.test.ts`
- `tests/generator.test.ts`
- `tests/generator-security.test.ts`

## Deterministic CLI Integration

CLI integration tests use a fixture-backed mock analysis mode:

- Fixture: `tests/fixtures/analysisResult.json`
- Env flag: `GEOFORGE_MOCK_ANALYSIS=1`

This removes network dependency and keeps tests deterministic.

## Build + Lint + Audit

```bash
npm run lint
npm run build
npm audit
```

## CI Expectations

CI runs on Node 18 and 20 and gates merges on:

- lint
- build
- tests
- `npm audit --audit-level=high`

## Notes

Deprecated options/files are intentionally not tested:

- `--no-error-pages`
- `--no-favicons`
- generated `404.html` / `500.html` from CLI
