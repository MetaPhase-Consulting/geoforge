# GEOforge CLI

Generate AI-ready website files for crawler/discovery control.

## Installation

```bash
npm install -g geoforge-cli
```

## Usage

```bash
geoforge https://example.com
geoforge https://example.com --profile strict-privacy
geoforge https://example.com --json-summary
geoforge https://example.com --output ./my-ai-files
```

## Options

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

## Outputs

- `robots.txt`
- `sitemap.xml` (optional)
- `humans.txt` (optional)
- `.well-known/ai.txt` (optional)
- `.well-known/security.txt` (optional)
- `manifest.json` + `browserconfig.xml` (optional)
- `ads.txt` + `app-ads.txt` (optional)
- `geoforge.json`

## Local Package Build

From `cli-package/`:

```bash
npm install
npm run build
```

`npm run build` syncs CLI sources from repo root before compilation.

## License

MIT
