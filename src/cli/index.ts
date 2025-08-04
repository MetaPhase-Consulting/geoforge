#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs/promises';
import path from 'path';
import JSZip from 'jszip';

const program = new Command();

program
  .name('geoforge-cli')
  .description('Analyzes a website and generates AI-ready optimization files.')
  .version('0.0.1');

program
  .argument('<url>', 'The URL of the website to analyze.')
  .option('--allow-training', 'Allow AI training on content', false)
  .option('--no-humans', 'Do not include humans.txt')
  .option('--no-sitemap', 'Do not generate an enhanced sitemap')
  .option('--no-ai-txt', 'Do not generate ai.txt')
  .option('--no-security-txt', 'Do not generate security.txt')
  .option('--no-manifest', 'Do not generate manifest.json')
  .option('--no-ads', 'Do not generate ads.txt and app-ads.txt')
  .option('--no-error-pages', 'Do not generate 404.html and 500.html')
  .option('--no-favicons', 'Do not include favicon files')
  .option('--compression <level>', 'Set compression level (none, standard, maximum)', 'standard')
  .option('--output <dir>', 'Output directory (default: geoforge-output)', 'geoforge-output')
  .action(async (url, options) => {
    console.log('🚀 Starting GEOforge CLI...');

    // --- URL Formatting ---
    const formatUrl = (inputUrl: string): string => {
      const trimmedUrl = inputUrl.trim();
      if (!trimmedUrl) return '';
      if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
        return trimmedUrl;
      }
      return `https://${trimmedUrl}`;
    };
    const formattedUrl = formatUrl(url);
    if (!formattedUrl) {
      console.error('❌ Invalid URL provided.');
      process.exit(1);
    }
    console.log(`✅ Analyzing URL: ${formattedUrl}`);

    // --- Configuration Setup ---
    const config = {
      url: formattedUrl,
      siteName: 'Test Website',
      allowTraining: options.allowTraining,
      includeHumans: options.humans,
      includeSitemap: options.sitemap,
      includeAiTxt: options.aiTxt !== false,
      includeSecurityTxt: options.securityTxt !== false,
      includeManifest: options.manifest !== false,
      includeAds: options.ads !== false,
      includeErrorPages: options.errorPages !== false,
      includeFavicons: options.favicons !== false,
      compression: options.compression,
      outputDir: options.output,
    };
    console.log('📋 Configuration:', config);

    // --- File Generation ---
    try {
      console.log('📦 Generating comprehensive AI optimization files...');
      
      const zip = new JSZip();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const domain = new URL(formattedUrl).hostname.replace(/[^a-zA-Z0-9]/g, '-');
      const zipFilename = `geoforge-${domain}-${timestamp}.zip`;
      
      // Generate robots.txt
      const robotsContent = generateRobotsTxt(formattedUrl, config.allowTraining);
      zip.file('robots.txt', robotsContent);
      console.log('✅ robots.txt generated');

      // Generate sitemap.xml
      if (config.includeSitemap) {
        const sitemapContent = generateSitemapXml(formattedUrl);
        zip.file('sitemap.xml', sitemapContent);
        console.log('✅ sitemap.xml generated');
      }

      // Generate humans.txt
      if (config.includeHumans) {
        const humansContent = generateHumansTxt(formattedUrl);
        zip.file('humans.txt', humansContent);
        console.log('✅ humans.txt generated');
      }

      // Generate .well-known/ai.txt
      if (config.includeAiTxt) {
        const aiTxtContent = generateAiTxt(formattedUrl);
        zip.file('.well-known/ai.txt', aiTxtContent);
        console.log('✅ .well-known/ai.txt generated');
      }

      // Generate .well-known/security.txt
      if (config.includeSecurityTxt) {
        const securityTxtContent = generateSecurityTxt(formattedUrl);
        zip.file('.well-known/security.txt', securityTxtContent);
        console.log('✅ .well-known/security.txt generated');
      }

      // Generate manifest.json
      if (config.includeManifest) {
        const manifestContent = generateManifestJson(formattedUrl);
        zip.file('manifest.json', manifestContent);
        console.log('✅ manifest.json generated');
      }

      // Generate ads.txt
      if (config.includeAds) {
        const adsTxtContent = generateAdsTxt(formattedUrl);
        zip.file('ads.txt', adsTxtContent);
        console.log('✅ ads.txt generated');
      }

      // Generate app-ads.txt
      if (config.includeAds) {
        const appAdsTxtContent = generateAppAdsTxt(formattedUrl);
        zip.file('app-ads.txt', appAdsTxtContent);
        console.log('✅ app-ads.txt generated');
      }

      // Generate browserconfig.xml
      if (config.includeManifest) {
        const browserconfigContent = generateBrowserconfigXml(formattedUrl);
        zip.file('browserconfig.xml', browserconfigContent);
        console.log('✅ browserconfig.xml generated');
      }

      // Generate error pages
      if (config.includeErrorPages) {
        const error404Content = generateErrorPage(formattedUrl, 404);
        zip.file('404.html', error404Content);
        console.log('✅ 404.html generated');

        const error500Content = generateErrorPage(formattedUrl, 500);
        zip.file('500.html', error500Content);
        console.log('✅ 500.html generated');
      }

      // Generate README.md
      const readmeContent = generateReadme(formattedUrl);
      zip.file('README.md', readmeContent);
      console.log('✅ README.md generated');

      // Generate DEPLOYMENT.md
      const deploymentContent = generateDeploymentGuide(formattedUrl);
      zip.file('DEPLOYMENT.md', deploymentContent);
      console.log('✅ DEPLOYMENT.md generated');

      // Set compression level
      const compressionLevel = config.compression === 'maximum' ? 9 : 
                             config.compression === 'none' ? 0 : 6;

      console.log(`🗜️ Compressing files with level ${compressionLevel}...`);
      const zipBuffer = await zip.generateAsync({ 
        type: 'nodebuffer', 
        compression: 'DEFLATE',
        compressionOptions: { level: compressionLevel }
      });

      // Save ZIP file
      const outputDir = path.resolve(process.cwd(), config.outputDir);
      await fs.mkdir(outputDir, { recursive: true });
      
      const zipPath = path.join(outputDir, zipFilename);
      await fs.writeFile(zipPath, zipBuffer);

      console.log('🎉 ZIP file generated successfully!');
      console.log(`📁 Output directory: ${outputDir}`);
      console.log(`📦 ZIP file: ${zipFilename}`);
      console.log(`📊 File size: ${(zipBuffer.length / 1024).toFixed(2)} KB`);

    } catch (error) {
      console.error('💥 An error occurred:');
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
      process.exit(1);
    }
  });

// Helper functions to generate file content
function generateRobotsTxt(url: string, allowTraining: boolean): string {
  const domain = new URL(url).hostname;
  const baseUrl = new URL(url).origin;
  
  let content = `# GEOforge Robots.txt
# Generated for AI crawler management and search engine optimization

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

function generateSitemapXml(url: string): string {
  const baseUrl = new URL(url).origin;
  const today = new Date().toISOString().split('T')[0];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- About Page -->
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Documentation -->
  <url>
    <loc>${baseUrl}/docs</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- API Documentation -->
  <url>
    <loc>${baseUrl}/api</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- Support -->
  <url>
    <loc>${baseUrl}/support</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

</urlset>`;
}

function generateHumansTxt(url: string): string {
  const domain = new URL(url).hostname;
  const year = new Date().getFullYear();
  
  return `/* TEAM */
    Developer: Generated by GEOforge CLI
    Contact: Generated for ${domain}

/* SITE */
    Last update: ${year}/08/04
    Language: English
    Doctype: HTML5
    IDE: Visual Studio Code
    Standards: HTML5, CSS3, JavaScript ES6+
    Components: React, TypeScript, Vite, Tailwind CSS
    Software: Node.js, npm, Git

/* PURPOSE */
    Generate AI-optimized website files for maximum Generative Engine Optimization (GEO)
    Create robots.txt, sitemaps, and vendor-specific AI manifests
    Enable websites to be easily discovered and indexed by AI crawlers and LLMs

/* MISSION */
    Democratize AI website optimization
    Make GEO accessible to all developers
    Bridge the gap between traditional SEO and AI discovery

/* VALUES */
    Open Source: Transparency and collaboration
    Innovation: Cutting-edge AI optimization techniques
    Accessibility: Tools for everyone, regardless of technical expertise
    Community: Supporting the broader AI and web development ecosystem

/* TECHNOLOGY */
    Frontend: React 18, TypeScript, Vite
    Styling: Tailwind CSS, CSS3
    Build: Vite, npm
    Deployment: Netlify, GitHub Pages
    Version Control: Git, GitHub
    Code Quality: ESLint, Prettier

/* AI PLATFORMS SUPPORTED */
    GPTBot (OpenAI)
    ClaudeBot (Anthropic)
    Bingbot (Microsoft)
    Google-Extended (Google)
    Applebot-Extended (Apple)
    PerplexityBot (Perplexity)
    CCBot (Common Crawl)
    YouBot (You.com)
    CohereBot (Cohere)
    AI21Bot (AI21)
    HuggingFaceBot (Hugging Face)
    StabilityBot (Stability AI)
    MidjourneyBot (Midjourney)
    DALL-E-Bot (OpenAI)
    BardBot (Google)
    GeminiBot (Google)
    CopilotBot (Microsoft)
    SGEBot (Google)
    ResearchBot (Various)
    AcademicBot (Academic)
    ScholarBot (Academic)
    ArXivBot (ArXiv)
    PubMedBot (PubMed)
    EnterpriseBot (Enterprise)
    BusinessBot (Business)
    CorporateBot (Corporate)
    AIBot (Generic)
    MLBot (Machine Learning)
    NeuralBot (Neural Networks)
    DeepLearningBot (Deep Learning)
    LLMBot (Large Language Models)
    GenAIBot (Generative AI)
    AGIBot (Artificial General Intelligence)

/* GENERATED FILES */
    robots.txt: AI crawler directives
    sitemap.xml: Site structure for crawlers
    sitemap.json: JSON sitemap for AI crawlers
    ai.txt: AI interaction guidelines
    security.txt: Security contact information
    humans.txt: Human-readable project information
    manifest.json: PWA manifest
    browserconfig.xml: Microsoft tile configuration
    ads.txt: Authorized digital sellers
    app-ads.txt: Mobile app advertising
    404.html: Custom error page
    500.html: Server error page

/* CONTRIBUTING */
    We welcome contributions! See CONTRIBUTING.md for guidelines.
    Report bugs, suggest features, or submit pull requests.
    Join our community of AI optimization enthusiasts.

/* LICENSE */
    MIT License - See LICENSE file for details
    Open source and free to use, modify, and distribute

/* THANKS */
    OpenAI for GPTBot and AI crawler standards
    Anthropic for ClaudeBot and AI safety
    Google for search and AI integration
    Microsoft for Bing and AI services
    Apple for Applebot and privacy-focused AI
    All AI crawler developers and researchers
    The open source community
    Contributors and users of GEOforge

/* INSPIRATION */
    The need for AI-optimized websites
    Growing importance of Generative Engine Optimization
    Desire to make AI discovery accessible to all
    Passion for open source and community-driven development`;
}

function generateAiTxt(url: string): string {
  const domain = new URL(url).hostname;
  
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
Primary language: English (en-US)

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
- GitHub: https://github.com/brianfunk/geoforge

# Version
AI.txt version: 1.0
Last updated: 2025-08-04`;
}

function generateSecurityTxt(url: string): string {
  const domain = new URL(url).hostname;
  
  return `Contact: mailto:security@${domain}
Expires: 2026-08-04T00:00:00.000Z
Preferred-Languages: en
Canonical: https://${domain}/.well-known/security.txt`;
}

function generateManifestJson(url: string): string {
  const domain = new URL(url).hostname;
  
  return JSON.stringify({
    "name": `${domain} - AI Optimized Website`,
    "short_name": domain,
    "description": "AI-optimized website with comprehensive crawler directives",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#000000",
    "icons": [
      {
        "src": "/favicon-16x16.png",
        "sizes": "16x16",
        "type": "image/png"
      },
      {
        "src": "/favicon-32x32.png",
        "sizes": "32x32",
        "type": "image/png"
      },
      {
        "src": "/android-chrome-192x192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/android-chrome-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ]
  }, null, 2);
}

function generateAdsTxt(url: string): string {
  const domain = new URL(url).hostname;
  
  return `# Ads.txt file for ${domain}
# Generated by GEOforge CLI
# This file lists authorized digital sellers for your domain

# Example entries (replace with your actual authorized sellers)
# google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0
# amazon.com, pub-0000000000000000, RESELLER, f08c47fec0942fa0

# For more information, visit: https://iabtechlab.com/ads-txt/`;
}

function generateAppAdsTxt(url: string): string {
  const domain = new URL(url).hostname;
  
  return `# App-ads.txt file for ${domain}
# Generated by GEOforge CLI
# This file lists authorized digital sellers for your mobile apps

# Example entries (replace with your actual authorized sellers)
# google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0
# amazon.com, pub-0000000000000000, RESELLER, f08c47fec0942fa0

# For more information, visit: https://iabtechlab.com/app-ads-txt/`;
}

function generateBrowserconfigXml(url: string): string {
  const domain = new URL(url).hostname;
  
  return `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/mstile-150x150.png"/>
            <TileColor>#000000</TileColor>
        </tile>
    </msapplication>
</browserconfig>`;
}

function generateErrorPage(url: string, errorCode: number): string {
  const domain = new URL(url).hostname;
  const title = errorCode === 404 ? 'Page Not Found' : 'Server Error';
  const message = errorCode === 404 
    ? 'The page you are looking for could not be found.'
    : 'Something went wrong on our end. Please try again later.';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${errorCode} - ${title} | ${domain}</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .error { font-size: 72px; color: #e74c3c; margin-bottom: 20px; }
        .message { font-size: 18px; color: #666; margin-bottom: 30px; }
        .home { color: #3498db; text-decoration: none; }
    </style>
</head>
<body>
    <div class="error">${errorCode}</div>
    <div class="message">${message}</div>
    <a href="/" class="home">Return to Homepage</a>
</body>
</html>`;
}

function generateReadme(url: string): string {
  const domain = new URL(url).hostname;
  
  return `# AI Optimization Files for ${domain}

This package contains comprehensive AI optimization files generated by GEOforge CLI.

## Files Included

### Core Files
- \`robots.txt\` - AI crawler directives and policies
- \`sitemap.xml\` - Enhanced XML sitemap with AI metadata
- \`humans.txt\` - Human-readable site information

### AI-Specific Files
- \`.well-known/ai.txt\` - AI interaction guidelines
- \`.well-known/security.txt\` - Security contact information

### Web App Files
- \`manifest.json\` - Progressive Web App manifest
- \`browserconfig.xml\` - Microsoft tile configuration

### Advertising Files
- \`ads.txt\` - Authorized digital sellers
- \`app-ads.txt\` - Mobile app advertising

### Error Pages
- \`404.html\` - Custom 404 error page
- \`500.html\` - Custom 500 error page

## Installation

1. Extract all files to your website's root directory
2. Ensure \`.well-known/\` directory is accessible
3. Update any domain-specific references in the files

## AI Platforms Supported

- OpenAI (GPTBot, ChatGPT-User, OAI-SearchBot)
- Anthropic (ClaudeBot, Claude-SearchBot, Claude-User)
- Perplexity (PerplexityBot, Perplexity-User)
- Microsoft (BingBot)
- Google (Google-Extended)
- Apple (Applebot-Extended)

## Generated by

GEOforge CLI v0.0.1
Generated on: ${new Date().toISOString()}
Website: ${url}`;
}

function generateDeploymentGuide(url: string): string {
  const domain = new URL(url).hostname;
  
  return `# Deployment Guide for ${domain}

## Quick Start

1. **Extract Files**: Extract all files to your website's root directory
2. **Upload**: Upload all files to your web server
3. **Verify**: Check that files are accessible at your domain

## File Locations

### Root Directory
- \`robots.txt\` → \`https://${domain}/robots.txt\`
- \`sitemap.xml\` → \`https://${domain}/sitemap.xml\`
- \`humans.txt\` → \`https://${domain}/humans.txt\`
- \`manifest.json\` → \`https://${domain}/manifest.json\`
- \`ads.txt\` → \`https://${domain}/ads.txt\`
- \`app-ads.txt\` → \`https://${domain}/app-ads.txt\`
- \`browserconfig.xml\` → \`https://${domain}/browserconfig.xml\`
- \`404.html\` → \`https://${domain}/404.html\`
- \`500.html\` → \`https://${domain}/500.html\`

### .well-known Directory
- \`.well-known/ai.txt\` → \`https://${domain}/.well-known/ai.txt\`
- \`.well-known/security.txt\` → \`https://${domain}/.well-known/security.txt\`

## Server Configuration

### Apache (.htaccess)
\`\`\`apache
# Enable .well-known directory
RewriteEngine On
RewriteRule ^\\.well-known/(.*)$ .well-known/$1 [L]

# Custom error pages
ErrorDocument 404 /404.html
ErrorDocument 500 /500.html
\`\`\`

### Nginx
\`\`\`nginx
# Custom error pages
error_page 404 /404.html;
error_page 500 /500.html;

# .well-known location
location /.well-known/ {
    try_files $uri =404;
}
\`\`\`

## Verification

After deployment, verify these URLs are accessible:
- \`https://${domain}/robots.txt\`
- \`https://${domain}/sitemap.xml\`
- \`https://${domain}/.well-known/ai.txt\`
- \`https://${domain}/.well-known/security.txt\`

## Testing

Use these tools to verify your deployment:
- Google Search Console
- Bing Webmaster Tools
- Screaming Frog SEO Spider
- Online robots.txt validators

## Support

For deployment issues, check:
1. File permissions (644 for files, 755 for directories)
2. Server configuration for .well-known directory
3. HTTPS redirects and canonical URLs

Generated by GEOforge CLI v0.0.1`;
}

program.parse(process.argv);
