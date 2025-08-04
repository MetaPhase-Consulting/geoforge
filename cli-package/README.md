# GEOforge CLI

Generate AI-ready optimization files for websites, including robots.txt, sitemaps, and AI manifests.

## Installation

```bash
npm install -g geoforge-cli
```

## Usage

```bash
# Basic usage
geoforge https://example.com

# With options
geoforge https://example.com --allow-training --no-humans --compression maximum

# Custom output directory
geoforge https://example.com --output ./my-ai-files
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--allow-training` | Allow AI training on content | `false` |
| `--no-humans` | Skip humans.txt generation | `true` |
| `--no-sitemap` | Skip sitemap.xml generation | `true` |
| `--no-ai-txt` | Skip ai.txt generation | `true` |
| `--no-security-txt` | Skip security.txt generation | `true` |
| `--no-manifest` | Skip manifest.json generation | `true` |
| `--no-ads` | Skip ads.txt and app-ads.txt generation | `true` |
| `--compression <level>` | ZIP compression level (none, standard, maximum) | `standard` |
| `--output <dir>` | Output directory | `geoforge-output` |

## Generated Files

- `robots.txt` - AI crawler directives and policies
- `sitemap.xml` - Enhanced XML sitemap with AI metadata
- `humans.txt` - Human-readable site information
- `.well-known/ai.txt` - AI interaction guidelines
- `.well-known/security.txt` - Security contact information
- `manifest.json` - Progressive Web App manifest
- `browserconfig.xml` - Microsoft tile configuration
- `ads.txt` - Authorized digital sellers
- `app-ads.txt` - Mobile app advertising
- `geoforge.json` - Detailed website analysis report

## Examples

**Basic analysis:**
```bash
geoforge https://metaphase.tech
```

**Selective file generation:**
```bash
geoforge https://farmers.gov --no-humans --no-ai-txt --compression maximum
```

**Allow AI training:**
```bash
geoforge https://example.com --allow-training
```

## License

MIT
