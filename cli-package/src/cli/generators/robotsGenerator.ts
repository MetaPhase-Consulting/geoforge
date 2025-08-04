import type { AnalysisResult } from '../cliWebsiteAnalyzer.js';

export function generateRobotsTxt(url: string, allowTraining: boolean, analysis: AnalysisResult): string {
  const domain = new URL(url).hostname;
  const baseUrl = new URL(url).origin;
  
  let content = `# GEOforge Robots.txt
# Generated for AI crawler management and search engine optimization
# Analysis Date: ${new Date().toISOString()}
# Original robots.txt: ${analysis.existingFiles.robotsTxt.exists ? 'Found' : 'Not found'}

# Allow all crawlers by default
User-agent: *
Allow: /

# AI Training Crawlers
User-agent: GPTBot
${allowTraining ? 'Allow: /' : 'Disallow: /'}
Disallow: /admin/
Disallow: /private/
Disallow: /api/

User-agent: ClaudeBot
${allowTraining ? 'Allow: /' : 'Disallow: /'}
Disallow: /admin/
Disallow: /private/
Disallow: /api/

User-agent: anthropic-ai
${allowTraining ? 'Allow: /' : 'Disallow: /'}
Disallow: /admin/
Disallow: /private/
Disallow: /api/

User-agent: Bingbot
${allowTraining ? 'Allow: /' : 'Disallow: /'}
Disallow: /admin/
Disallow: /private/
Disallow: /api/

# AI Search Indexers
User-agent: OAI-SearchBot
Allow: /
Disallow: /admin/
Disallow: /private/
Disallow: /api/

User-agent: Claude-SearchBot
Allow: /
Disallow: /admin/
Disallow: /private/
Disallow: /api/

User-agent: PerplexityBot
Allow: /
Disallow: /admin/
Disallow: /private/
Disallow: /api/

# AI On-Demand Fetchers
User-agent: ChatGPT-User
Allow: /
Disallow: /admin/
Disallow: /private/
Disallow: /api/

User-agent: Claude-User
Allow: /
Disallow: /admin/
Disallow: /private/
Disallow: /api/

User-agent: Perplexity-User
Allow: /
Disallow: /admin/
Disallow: /private/
Disallow: /api/

# Policy Tokens
User-agent: Google-Extended
${allowTraining ? 'Allow: /' : 'Disallow: /'}
Disallow: /admin/
Disallow: /private/
Disallow: /api/

User-agent: Applebot-Extended
${allowTraining ? 'Allow: /' : 'Disallow: /'}
Disallow: /admin/
Disallow: /private/
Disallow: /api/

# Standard Search Engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: YandexBot
Allow: /

# Block problematic bots
User-agent: MJ12bot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for all bots
Crawl-delay: 1`;

  return content;
} 