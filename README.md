# GEOforge

GEOforge generates AI-ready website files such as `robots.txt`, `sitemap.xml`, `.well-known/ai.txt`, and `.well-known/security.txt`.

## Key Features

- Web UI with profile presets:
  - `strict-privacy`
  - `balanced` (default)
  - `open-discovery`
- CLI with profile support and machine-readable summaries
- Preview + diff in web UI before download
- Single-file download and selected-file ZIP download
- Shared generation core used by web and CLI

## Quick Start

### Local app

```bash
git clone https://github.com/MetaPhase-Consulting/geoforge.git
cd geoforge
npm install
npm run dev
```

### CLI usage

```bash
# Run from local source after build
npm run build:cli
node dist/cli/index.js https://example.com

# Or installed package
geoforge https://example.com
```

## CLI Options

| Option | Description | Default |
|---|---|---|
| `--allow-training` | Allow AI training on content | `false` |
| `--profile <profile>` | `strict-privacy`, `balanced`, `open-discovery` | `balanced` |
| `--json-summary` | Print machine-readable JSON summary to stdout | `false` |
| `--verbose` | Enable debug logging | `false` |
| `--no-humans` | Skip `humans.txt` | `true` |
| `--no-sitemap` | Skip `sitemap.xml` | `true` |
| `--no-ai-txt` | Skip `.well-known/ai.txt` | `true` |
| `--no-security-txt` | Skip `.well-known/security.txt` | `true` |
| `--no-manifest` | Skip `manifest.json` and `browserconfig.xml` | `true` |
| `--no-ads` | Skip `ads.txt` and `app-ads.txt` | `true` |
| `--compression <level>` | `none`, `standard`, `maximum` | `standard` |
| `--output <dir>` | Output directory | `geoforge-output` |

## Generated Files

- `robots.txt`
- `sitemap.xml` (optional)
- `humans.txt` (optional)
- `.well-known/ai.txt` (optional)
- `.well-known/security.txt` (optional)
- `manifest.json` (optional)
- `browserconfig.xml` (optional)
- `ads.txt` (optional)
- `app-ads.txt` (optional)
- `geoforge.json`

## Architecture

- Shared types: `src/shared/types.ts`
- Shared generator core: `src/shared/generationCore.ts`
- Web analyzer: `src/services/websiteAnalyzer.ts`
- CLI analyzer: `src/cli/cliWebsiteAnalyzer.ts`

The repository root (`src/cli`) is the CLI source of truth. `cli-package/src` is synced from root via:

```bash
npm run sync:cli-package
```

## Development Commands

```bash
npm run lint
npm run test:run
npm run build
```

## Security

- Input sanitization for line-based and XML outputs in shared generation core
- CI includes npm audit checks
- Weekly dependency hygiene workflow in `.github/workflows/dependency-hygiene.yml`

## License

MIT
