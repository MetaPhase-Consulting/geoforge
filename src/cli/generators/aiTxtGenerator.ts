import type { AnalysisResult } from '../cliWebsiteAnalyzer.js';

export function generateAiTxt(url: string, analysis: AnalysisResult): string {
  const domain = new URL(url).hostname;
  const siteTitle = analysis.metadata.title || domain;
  
  return `# AI Interaction Guidelines for ${domain}
# This file provides guidelines for AI systems interacting with our website

# Contact Information
Contact: Available through our support form
Contact: Available through our security form

# Purpose
This website provides tools for generating AI-ready optimization files for websites.
Our content is designed to help developers and site administrators optimize their
websites for AI crawlers and search engines.

# Content Guidelines
- All content is publicly available for AI training and indexing
- Technical documentation and guides are free to use
- Code examples and templates are open source
- User-generated content should be treated with respect

# Usage Guidelines
- AI systems may crawl and index our content
- Training data usage is permitted with proper attribution
- Real-time search indexing is encouraged
- User privacy should be respected

# Technical Information
- API endpoints: /api/*
- Documentation: /docs
- Examples: /examples
- Support: /support

# File Types
- robots.txt: AI crawler directives
- sitemap.xml: Site structure information
- humans.txt: Human-readable site information
- manifest.json: PWA configuration

# AI Platform Support
We support and optimize for the following AI platforms:
- OpenAI (GPTBot, ChatGPT-User, OAI-SearchBot)
- Anthropic (ClaudeBot, Claude-SearchBot, Claude-User)
- Perplexity (PerplexityBot, Perplexity-User)
- Microsoft (BingBot)
- Google (Google-Extended)
- Apple (Applebot-Extended)

# Content Categories
- Technical documentation
- Code examples and templates
- Best practices and guides
- API documentation
- User guides and tutorials

# Update Frequency
- Documentation: Weekly
- Code examples: Monthly
- API documentation: As needed
- Security updates: Immediate

# Language
Primary language: ${analysis.metadata.language || 'English (en-US)'}

# Accessibility
- WCAG 2.1 AA compliant
- Screen reader friendly
- Keyboard navigation supported
- High contrast mode available

# Security
- HTTPS required
- CSP headers implemented
- Input validation enabled
- XSS protection active

# Privacy
- No personal data collection
- Anonymous analytics only
- No tracking cookies
- GDPR compliant

# Support
For AI-related questions or issues:
- Support: Available through our AI support form
- Documentation: https://${domain}/docs
- GitHub: https://github.com/MetaPhase-Consulting/geoforge

# Version
AI.txt version: 1.0
Last updated: 2025-08-04`;
} 