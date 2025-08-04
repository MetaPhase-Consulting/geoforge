# GEOforge

**Generative Engine Optimization for LLM Discovery**

GEOforge is an open-source tool that generates AI-ready optimization files for websites, including robots.txt, sitemaps, and vendor-specific AI manifests.

## Features

- 🤖 **AI Crawler Management** - Control which AI systems can access your content
- 📄 **Vendor Manifests** - Generate standardized JSON manifests for AI platforms
- 🗺️ **Enhanced Sitemaps** - XML and JSON sitemaps optimized for AI discovery
- 🔧 **Online Tool** - Web-based interface for easy configuration
- 💻 **CLI Support** - Command-line interface for developers

## Supported Agents

| Label | Type | robots User-Agent |
|-------|------|-------------------|
| GPTBot | Training crawler | GPTBot |
| ChatGPT-User | On-demand fetch | ChatGPT-User |
| OAI-SearchBot | Live indexer | OAI-SearchBot |
| ClaudeBot | Training crawler | ClaudeBot, anthropic-ai |
| Claude-SearchBot | Live indexer | Claude-SearchBot |
| Claude-User | On-demand fetch | Claude-User |
| PerplexityBot | Live indexer | PerplexityBot |
| Perplexity-User | On-demand fetch | Perplexity-User |
| BingBot | Training crawler | Bingbot |
| Google-Extended | Policy token | Google-Extended |
| Applebot-Extended | Policy token | Applebot-Extended |

## Quick Start

### Online Tool
Visit [geoforge.dev](https://geoforge.dev) to use the web interface.

### Command Line
```bash
# Install globally
npm install -g geoforge

# Initialize project
npx geoforge init --site "My Site" --domain https://mysite.com

# Run audit
npx geoforge audit
```

## Agent Types

- **Training Crawlers**: Automated systems that crawl for AI model training
- **Live Search Indexers**: Real-time indexing for AI-powered search
- **On-Demand Fetchers**: User-triggered systems that may bypass robots.txt
- **Policy Tokens**: Special robots.txt tokens that control AI training usage

## Generated Files

- `robots.txt` - AI crawler directives and policies
- `sitemap.xml` - Enhanced XML sitemap
- `humans.txt` - Human-readable site information
- `llms.txt` - Large Language Model directives
- `*.json` - Vendor-specific AI manifests
- `.well-known/ai.txt` - AI interaction guidelines

## Contributing

GEOforge is open source and welcomes contributions. Visit our [GitHub repository](https://github.com/geoforge/geoforge) to get started.

## License

Open source - see LICENSE file for details.
