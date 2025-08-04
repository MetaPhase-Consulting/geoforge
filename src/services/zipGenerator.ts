import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { AnalysisConfig, AnalysisResult } from './websiteAnalyzer';

interface GeneratedFile {
  name: string;
  content: string;
  type: 'text' | 'json' | 'xml';
}

export class ZipGenerator {
  private config: AnalysisConfig;
  private analysisResult: AnalysisResult;

  constructor(config: AnalysisConfig, analysisResult: AnalysisResult) {
    this.config = config;
    this.analysisResult = analysisResult;
  }

  async generateAndDownload(onProgress?: (progress: number, status: string) => void): Promise<void> {
    console.log('📦 ZipGenerator.generateAndDownload started');
    console.log('⚙️ Config:', this.config);
    console.log('📊 Analysis Result status:', this.analysisResult.status);
    
    const zip = new JSZip();
    console.log('📁 JSZip instance created');

    try {
      console.log('🤖 Step 1: Generating robots.txt...');
      onProgress?.(10, 'Generating robots.txt...');
      const robotsTxt = this.generateRobotsTxt();
      console.log('✅ robots.txt generated, size:', robotsTxt.content.length, 'chars');
      zip.file('robots.txt', robotsTxt.content);

      console.log('🗺️ Step 2: Generating sitemap.xml...');
      onProgress?.(20, 'Generating sitemap.xml...');
      if (this.config.includeSitemap) {
        const sitemap = this.generateSitemap();
        console.log('✅ sitemap.xml generated, size:', sitemap.content.length, 'chars');
        zip.file('sitemap.xml', sitemap.content);
      } else {
        console.log('⏭️ Skipping sitemap.xml (not included in config)');
      }

      console.log('👥 Step 3: Generating humans.txt...');
      onProgress?.(30, 'Generating humans.txt...');
      if (this.config.includeHumans) {
        const humansTxt = this.generateHumansTxt();
        console.log('✅ humans.txt generated, size:', humansTxt.content.length, 'chars');
        zip.file('humans.txt', humansTxt.content);
      } else {
        console.log('⏭️ Skipping humans.txt (not included in config)');
      }

      console.log('🤖 Step 4: Generating AI files...');
      onProgress?.(40, 'Generating AI files...');
      
      // Generate .well-known/ai.txt
      const aiTxtContent = this.generateAiTxt();
      console.log('✅ .well-known/ai.txt generated, size:', aiTxtContent.content.length, 'chars');
      zip.file('.well-known/ai.txt', aiTxtContent.content);
      
      // Generate .well-known/security.txt
      const securityTxtContent = this.generateSecurityTxt();
      console.log('✅ .well-known/security.txt generated, size:', securityTxtContent.content.length, 'chars');
      zip.file('.well-known/security.txt', securityTxtContent.content);

      console.log('📱 Step 5: Generating web app files...');
      onProgress?.(50, 'Generating web app files...');
      
      // Generate manifest.json
      const manifestContent = this.generateManifestJson();
      console.log('✅ manifest.json generated, size:', manifestContent.content.length, 'chars');
      zip.file('manifest.json', manifestContent.content);
      
      // Generate browserconfig.xml
      const browserconfigContent = this.generateBrowserconfigXml();
      console.log('✅ browserconfig.xml generated, size:', browserconfigContent.content.length, 'chars');
      zip.file('browserconfig.xml', browserconfigContent.content);

      console.log('📢 Step 6: Generating advertising files...');
      onProgress?.(60, 'Generating advertising files...');
      
      // Generate ads.txt
      const adsTxtContent = this.generateAdsTxt();
      console.log('✅ ads.txt generated, size:', adsTxtContent.content.length, 'chars');
      zip.file('ads.txt', adsTxtContent.content);
      
      // Generate app-ads.txt
      const appAdsTxtContent = this.generateAppAdsTxt();
      console.log('✅ app-ads.txt generated, size:', appAdsTxtContent.content.length, 'chars');
      zip.file('app-ads.txt', appAdsTxtContent.content);

      console.log('📊 Step 7: Generating analysis report...');
      onProgress?.(70, 'Generating analysis report...');
      const geoforgeReport = this.generateAnalysisReport();
      console.log('✅ geoforge.json generated, size:', geoforgeReport.content.length, 'chars');
      zip.file('geoforge.json', geoforgeReport.content);

      console.log('🗜️ Step 8: Compressing files...');
      onProgress?.(80, 'Compressing files...');
      const compressionLevel = this.getCompressionLevel();
      console.log('🔧 Compression level:', compressionLevel);
      
      console.log('📦 Generating ZIP blob...');
      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: compressionLevel }
      });
      console.log('✅ ZIP blob generated, size:', blob.size, 'bytes');

      console.log('💾 Step 9: Starting download...');
      onProgress?.(90, 'Download starting...');
      const filename = `${this.config.siteName || 'geoforge'}-geo-files-${new Date().toISOString().split('T')[0]}.zip`;
      console.log('📁 Filename:', filename);
      
      console.log('🚀 Calling saveAs...');
      saveAs(blob, filename);
      console.log('✅ saveAs called successfully');

    } catch (error) {
      console.error('💥 Error in generateAndDownload:', error);
      console.error('🔍 Error type:', typeof error);
      console.error('🔍 Error constructor:', error?.constructor?.name);
      console.error('🔍 Error message:', error instanceof Error ? error.message : 'No message');
      console.error('🔍 Error stack:', error instanceof Error ? error.stack : 'No stack');
      
      throw new Error(`Failed to generate ZIP file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private generateRobotsTxt(): GeneratedFile {
    console.log('🤖 generateRobotsTxt started');
    console.log('🔧 Config agents:', this.config.agents);
    console.log('🔧 Config allowTraining:', this.config.allowTraining);
    console.log('🔧 Config includeSitemap:', this.config.includeSitemap);
    
    const lines: string[] = [];
    
    lines.push('# Robots.txt generated by GEOforge');
    lines.push(`# Generated on: ${new Date().toISOString()}`);
    lines.push(`# For: ${this.config.url}`);
    lines.push('');

    // Human crawlers
    lines.push('# Search Engine Crawlers');
    lines.push('User-agent: Googlebot');
    lines.push('Allow: /');
    lines.push('');
    lines.push('User-agent: Bingbot');
    lines.push('Allow: /');
    lines.push('');

    // AI crawlers - use agents from config
    lines.push('# AI Training Crawlers');
    if (this.config.agents && typeof this.config.agents === 'object') {
      console.log('📋 Processing agents:', Object.keys(this.config.agents));
      Object.entries(this.config.agents).forEach(([agentId, enabled]) => {
        console.log(`🤖 Processing agent: ${agentId} (enabled: ${enabled})`);
        const userAgent = this.getAgentUserAgent(agentId);
        if (userAgent) {
          lines.push(`User-agent: ${userAgent}`);
          lines.push(enabled ? 'Allow: /' : 'Disallow: /');
          lines.push('');
        }
      });
    } else {
      console.log('⚠️ No agents config found or invalid format');
    }

    // General AI training policy
    if (!this.config.allowTraining) {
      lines.push('# Block AI training crawlers');
      lines.push('User-agent: GPTBot');
      lines.push('Disallow: /');
      lines.push('');
      lines.push('User-agent: Google-Extended');
      lines.push('Disallow: /');
      lines.push('');
      lines.push('User-agent: CCBot');
      lines.push('Disallow: /');
      lines.push('');
    }

    // Sitemap reference
    if (this.config.includeSitemap) {
      lines.push(`Sitemap: ${new URL('/sitemap.xml', this.config.url).href}`);
    }

    const content = lines.join('\n');
    console.log('✅ robots.txt content generated, length:', content.length);
    
    return {
      name: 'robots.txt',
      content: content,
      type: 'text'
    };
  }

  private generateSitemap(): GeneratedFile {
    // Always include the main URL, even if no other pages were crawled
    const urls = [this.config.url];
    
    // Add crawled pages if they exist and are valid URLs
    if (this.analysisResult.crawledPages && Array.isArray(this.analysisResult.crawledPages)) {
      urls.push(...this.analysisResult.crawledPages.filter(url => {
        try {
          new URL(url);
          return true;
        } catch {
          return false; // Skip invalid URLs
        }
      }));
    }
    
    const uniqueUrls = [...new Set(urls)];

    const lines: string[] = [];
    lines.push('<?xml version="1.0" encoding="UTF-8"?>');
    lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

    uniqueUrls.forEach(url => {
      lines.push('  <url>');
      lines.push(`    <loc>${url}</loc>`);
      lines.push(`    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>`);
      lines.push('    <changefreq>weekly</changefreq>');
      lines.push('    <priority>0.8</priority>');
      lines.push('  </url>');
    });

    lines.push('</urlset>');

    return {
      name: 'sitemap.xml',
      content: lines.join('\n'),
      type: 'xml'
    };
  }

  private generateHumansTxt(): GeneratedFile {
    const lines: string[] = [];
    
    lines.push('/* TEAM */');
    lines.push(`Website: ${this.config.url}`);
    lines.push(`Generated: ${new Date().toLocaleDateString()}`);
    lines.push('');
    lines.push('/* THANKS */');
    lines.push('GEOforge - AI Optimization Tool');
    lines.push('https://geoforge.dev');
    lines.push('');
    lines.push('/* SITE */');
    lines.push('Standards: HTML5, CSS3, JavaScript');
    lines.push('Components: AI-ready optimization');
    lines.push('Software: GEOforge');

    return {
      name: 'humans.txt',
      content: lines.join('\n'),
      type: 'text'
    };
  }

  private generateLLMManifests(): GeneratedFile[] {
    console.log('🤖 generateLLMManifests started');
    console.log('🔧 Config agents:', this.config.agents);
    console.log('🔧 Analysis result metadata:', this.analysisResult.metadata);
    
    const manifests: GeneratedFile[] = [];

    // Use agents from config instead of llms
    if (this.config.agents && typeof this.config.agents === 'object') {
      console.log('📋 Processing agents for manifests:', Object.keys(this.config.agents));
      Object.entries(this.config.agents).forEach(([agentId, enabled]) => {
        console.log(`🤖 Processing agent for manifest: ${agentId} (enabled: ${enabled})`);
        if (enabled) {
          try {
            const manifestData = {
              version: '1.0',
              generator: 'GEOforge',
              generated: new Date().toISOString(),
              website: {
                url: this.config.url,
                name: this.config.siteName,
                description: this.analysisResult.metadata?.description || 'No description available'
              },
              permissions: {
                crawling: true,
                training: this.config.allowTraining,
                indexing: true
              },
              policies: {
                attribution: 'required',
                commercial_use: 'allowed',
                modification: 'allowed'
              },
              technical: {
                preferred_format: 'json',
                rate_limit: '1req/sec',
                user_agent: this.getAgentUserAgent(agentId)
              },
              content: {
                languages: [this.analysisResult.metadata?.language || 'en'],
                topics: this.analysisResult.metadata?.keywords || [],
                last_updated: new Date().toISOString()
              }
            };
            
            const manifest = {
              name: `${agentId}.json`,
              content: JSON.stringify(manifestData, null, 2),
              type: 'json' as const
            };
            
            console.log(`✅ Generated manifest for ${agentId}, size: ${manifest.content.length} chars`);
            manifests.push(manifest);
          } catch (error) {
            console.error(`❌ Error generating manifest for ${agentId}:`, error);
          }
        }
      });
    } else {
      console.log('⚠️ No agents config found or invalid format for manifests');
    }

    console.log(`📋 Total manifests generated: ${manifests.length}`);
    return manifests;
  }

  private generateAiTxt(): GeneratedFile {
    const domain = new URL(this.config.url).hostname;
    const siteTitle = this.analysisResult.metadata?.title || domain;
    
    const content = `# AI Interaction Guidelines for ${domain}
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
Primary language: ${this.analysisResult.metadata?.language || 'English (en-US)'}

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

    return {
      name: '.well-known/ai.txt',
      content,
      type: 'text'
    };
  }

  private generateSecurityTxt(): GeneratedFile {
    const domain = new URL(this.config.url).hostname;
    
    const content = `Contact: mailto:security@${domain}
Expires: 2026-12-31T23:59:59.000Z
Preferred-Languages: en
Canonical: https://${domain}/.well-known/security.txt
Policy: https://${domain}/security-policy`;

    return {
      name: '.well-known/security.txt',
      content,
      type: 'text'
    };
  }

  private generateManifestJson(): GeneratedFile {
    const domain = new URL(this.config.url).hostname;
    const siteTitle = this.analysisResult.metadata?.title || domain;
    const description = this.analysisResult.metadata?.description || `AI optimization tools for ${domain}`;
    
    const content = JSON.stringify({
      name: siteTitle,
      short_name: siteTitle.split(' ')[0],
      description: description,
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#D4AF37',
      icons: [
        {
          src: '/favicon.ico',
          sizes: '16x16 32x32',
          type: 'image/x-icon'
        },
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }, null, 2);

    return {
      name: 'manifest.json',
      content,
      type: 'json'
    };
  }

  private generateBrowserconfigXml(): GeneratedFile {
    const domain = new URL(this.config.url).hostname;
    const siteTitle = this.analysisResult.metadata?.title || domain;
    
    const content = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/mstile-150x150.png"/>
            <TileColor>#D4AF37</TileColor>
        </tile>
    </msapplication>
</browserconfig>`;

    return {
      name: 'browserconfig.xml',
      content,
      type: 'xml'
    };
  }

  private generateAdsTxt(): GeneratedFile {
    const domain = new URL(this.config.url).hostname;
    
    const content = `# ads.txt for ${domain}
# This file lists authorized digital sellers for this domain
# Format: <domain>, <publisher ID>, <relationship>, <certification authority ID>

# Example entries (replace with actual authorized sellers):
# google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0
# amazon.com, pub-0000000000000000, RESELLER, f08c47fec0942fa0

# For more information, visit: https://iabtechlab.com/ads-txt/`;

    return {
      name: 'ads.txt',
      content,
      type: 'text'
    };
  }

  private generateAppAdsTxt(): GeneratedFile {
    const domain = new URL(this.config.url).hostname;
    
    const content = `# app-ads.txt for ${domain}
# This file lists authorized digital sellers for mobile apps
# Format: <domain>, <publisher ID>, <relationship>, <certification authority ID>

# Example entries (replace with actual authorized sellers):
# google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0
# amazon.com, pub-0000000000000000, RESELLER, f08c47fec0942fa0

# For more information, visit: https://iabtechlab.com/app-ads-txt/`;

    return {
      name: 'app-ads.txt',
      content,
      type: 'text'
    };
  }

  private generateAnalysisReport(): GeneratedFile {
    const domain = new URL(this.config.url).hostname;
    const siteTitle = this.analysisResult.metadata?.title || domain;
    
    const report = {
      geoforge: {
        version: "0.0.1",
        generated: new Date().toISOString(),
        url: this.config.url,
        domain: domain
      },
      site: {
        title: siteTitle,
        description: this.analysisResult.metadata?.description || 'No description available',
        language: this.analysisResult.metadata?.language || 'Not specified',
        charset: this.analysisResult.metadata?.charset || 'Not specified',
        author: this.analysisResult.metadata?.author || 'Not specified'
      },
      technical: {
        responseTime: this.analysisResult.technical?.responseTime || 0,
        statusCode: this.analysisResult.technical?.statusCode || 0,
        contentType: this.analysisResult.technical?.contentType || '',
        contentLength: this.analysisResult.technical?.contentLength || 0,
        sslEnabled: this.analysisResult.technical?.sslEnabled || false,
        hasRobots: this.analysisResult.technical?.hasRobots || false,
        hasSitemap: this.analysisResult.technical?.hasSitemap || false
      },
      seo: {
        metaTags: this.analysisResult.seo?.metaTags || {},
        headings: (this.analysisResult.seo?.headings || []).slice(0, 20),
        links: (this.analysisResult.seo?.links || []).slice(0, 50).map(link => ({
          href: link.href,
          text: link.text,
          rel: link.rel
        })),
        images: (this.analysisResult.seo?.images || []).slice(0, 20).map(img => ({
          src: img.src,
          alt: img.alt,
          title: img.title
        }))
      },
      performance: {
        loadTime: this.analysisResult.performance?.loadTime || 0,
        domContentLoaded: this.analysisResult.performance?.domContentLoaded || 0,
        firstContentfulPaint: this.analysisResult.performance?.firstContentfulPaint || 0,
        largestContentfulPaint: this.analysisResult.performance?.largestContentfulPaint || 0,
        cumulativeLayoutShift: this.analysisResult.performance?.cumulativeLayoutShift || 0,
        firstInputDelay: this.analysisResult.performance?.firstInputDelay || 0
      },
      assets: {
        stylesheets: (this.analysisResult.assets?.stylesheets || []).slice(0, 20),
        scripts: (this.analysisResult.assets?.scripts || []).slice(0, 20),
        images: (this.analysisResult.assets?.images || []).slice(0, 20),
        fonts: (this.analysisResult.assets?.fonts || []).slice(0, 10)
      },
      generatedFiles: {
        core: [
          "robots.txt - AI crawler directives and policies",
          "sitemap.xml - Enhanced XML sitemap with AI metadata",
          "humans.txt - Human-readable site information"
        ],
        ai: [
          ".well-known/ai.txt - AI interaction guidelines",
          ".well-known/security.txt - Security contact information"
        ],
        web: [
          "manifest.json - Progressive Web App manifest",
          "browserconfig.xml - Microsoft tile configuration"
        ],
        advertising: [
          "ads.txt - Authorized digital sellers",
          "app-ads.txt - Mobile app advertising"
        ]
      },
      summary: {
        totalLinks: (this.analysisResult.seo?.links || []).length,
        totalImages: (this.analysisResult.seo?.images || []).length,
        totalStylesheets: (this.analysisResult.assets?.stylesheets || []).length,
        totalScripts: (this.analysisResult.assets?.scripts || []).length,
        analysisStatus: this.analysisResult.status || 'unknown',
        timestamp: this.analysisResult.timestamp || new Date().toISOString()
      }
    };
    
    return {
      name: 'geoforge.json',
      content: JSON.stringify(report, null, 2),
      type: 'json'
    };
  }

  private generateConfigFiles(): GeneratedFile[] {
    console.log('⚙️ generateConfigFiles started');
    console.log('🔧 Config agents:', this.config.agents);
    console.log('🔧 Config allowTraining:', this.config.allowTraining);
    
    const files: GeneratedFile[] = [];

    try {
      // .well-known/ai.txt
      console.log('📄 Generating ai.txt...');
      const aiTxt = [
        '# AI.txt - AI Interaction Guidelines',
        `# Generated by GEOforge for ${this.config.url}`,
        '',
        '# Training Permission',
        `training: ${this.config.allowTraining ? 'allowed' : 'disallowed'}`,
        '',
        '# Crawling Rules',
        'crawling: allowed',
        'rate-limit: 1req/sec',
        '',
        '# Attribution',
        'attribution: required',
        `source: ${this.config.url}`,
        '',
        '# Contact',
        `website: ${this.config.url}`,
        `updated: ${new Date().toISOString().split('T')[0]}`
      ].join('\n');

      files.push({
        name: '.well-known/ai.txt',
        content: aiTxt,
        type: 'text'
      });
      console.log('✅ ai.txt generated, size:', aiTxt.length, 'chars');

      // llms.txt
      console.log('📄 Generating llms.txt...');
      const enabledAgents = this.config.agents ? 
        Object.entries(this.config.agents).filter(([_, enabled]) => enabled).map(([agentId, _]) => agentId) : 
        [];
      
      const llmsTxt = [
        '# LLMs.txt - Large Language Model Directives',
        `# For: ${this.config.url}`,
        `# Generated: ${new Date().toISOString()}`,
        '',
        '# Enabled AI Systems:',
        ...enabledAgents.map(agentId => `# - ${agentId}: AI agent configuration`),
        '',
        '# Training Policy:',
        `# Content may ${this.config.allowTraining ? '' : 'NOT '}be used for AI training`,
        '',
        '# Usage Guidelines:',
        '# - Respect robots.txt directives',
        '# - Provide attribution when using content',
        '# - Follow rate limiting guidelines',
        '# - Check vendor-specific manifest files'
      ].join('\n');

      files.push({
        name: 'llms.txt',
        content: llmsTxt,
        type: 'text'
      });
      console.log('✅ llms.txt generated, size:', llmsTxt.length, 'chars');

    } catch (error) {
      console.error('❌ Error in generateConfigFiles:', error);
    }

    console.log(`📋 Total config files generated: ${files.length}`);
    return files;
  }

  private generateDocumentation(): GeneratedFile {
    const content = `# GEOforge Generated Files

This package contains AI-ready optimization files generated by GEOforge for **${this.config.siteName}** (${this.config.url}).

## Generated Files

### Core Files
- \`robots.txt\` - Search engine and AI crawler directives
- \`sitemap.xml\` - XML sitemap for search engines
- \`humans.txt\` - Human-readable site information
- \`llms.txt\` - Large Language Model directives

### AI Vendor Manifests
${this.config.agents ? Object.entries(this.config.agents).filter(([_, enabled]) => enabled).map(([agentId, _]) => `- \`${agentId}.json\` - ${agentId} specific configuration`).join('\n') : 'No AI agents configured'}

### Analysis & Reports
- \`analysis-report.html\` - Comprehensive website analysis report
- \`analysis-data.json\` - Raw analysis data in JSON format

### Configuration Files
- \`.well-known/ai.txt\` - AI interaction guidelines
- \`DEPLOYMENT.md\` - Deployment instructions

## Installation

1. Extract all files from this ZIP package
2. Copy the files to your website's root directory
3. Ensure proper file permissions (644 for most files)
4. Test the files are accessible via your web server

## Verification

After deployment, verify the files are accessible:
- ${this.config.url}/robots.txt
- ${this.config.url}/sitemap.xml
- ${this.config.url}/humans.txt
- ${this.config.url}/.well-known/ai.txt

## Configuration Summary

- **Training Allowed**: ${this.config.allowTraining ? 'Yes' : 'No'}
- **Sitemap Included**: ${this.config.includeSitemap ? 'Yes' : 'No'}
- **Humans.txt Included**: ${this.config.includeHumans ? 'Yes' : 'No'}

## Enabled AI Systems

${this.config.agents ? Object.entries(this.config.agents).filter(([_, enabled]) => enabled).map(([agentId, _]) => `- **${agentId}**: AI agent configuration`).join('\n') : 'No AI agents enabled'}

## Support

For questions or issues with these files:
- Visit: https://geoforge.dev
- Documentation: https://docs.geoforge.dev
- GitHub: https://github.com/brianfunk/geoforge

Generated on ${new Date().toLocaleString()} by GEOforge v1.0
`;

    return {
      name: 'README.md',
      content,
      type: 'text'
    };
  }

  private generateDeploymentGuide(): GeneratedFile {
    const content = `# Deployment Guide

## Quick Start

1. **Extract Files**: Unzip this package to a temporary directory
2. **Upload Files**: Copy all files to your website's root directory
3. **Set Permissions**: Ensure files have proper read permissions (644)
4. **Test Access**: Verify files are accessible via web browser

## File Locations

\`\`\`
your-website-root/
├── robots.txt
├── sitemap.xml
├── humans.txt
├── llms.txt
├── .well-known/
│   └── ai.txt
${this.config.agents ? Object.entries(this.config.agents).filter(([_, enabled]) => enabled).map(([agentId, _]) => `├── ${agentId}.json`).join('\n') : ''}
\`\`\`

## Server Configuration

### Apache (.htaccess)
\`\`\`apache
# Ensure proper MIME types
<Files "*.txt">
    ForceType text/plain
</Files>

<Files "*.json">
    ForceType application/json
</Files>

<Files "*.xml">
    ForceType application/xml
</Files>
\`\`\`

### Nginx
\`\`\`nginx
location ~* \\.(txt|json|xml)$ {
    add_header Content-Type text/plain;
    add_header Cache-Control "public, max-age=3600";
}
\`\`\`

## Verification Checklist

After deployment, check these URLs return HTTP 200:

- [ ] ${this.config.url}/robots.txt
- [ ] ${this.config.url}/sitemap.xml
- [ ] ${this.config.url}/humans.txt
- [ ] ${this.config.url}/llms.txt
- [ ] ${this.config.url}/.well-known/ai.txt
${this.config.agents ? Object.entries(this.config.agents).filter(([_, enabled]) => enabled).map(([agentId, _]) => `- [ ] ${this.config.url}/${agentId}.json`).join('\n') : ''}

## Testing AI Crawler Access

Use these commands to test crawler access:

\`\`\`bash
# Test robots.txt
curl -A "GPTBot" ${this.config.url}/robots.txt

# Test AI manifest
curl -H "Accept: application/json" ${this.config.url}/openai.json

# Validate sitemap
curl ${this.config.url}/sitemap.xml
\`\`\`

## Maintenance

- **Update Frequency**: Review and regenerate files monthly
- **Content Changes**: Regenerate when site structure changes significantly
- **AI Policy Updates**: Update manifests when AI usage policies change

## Troubleshooting

### Common Issues

1. **404 Errors**: Ensure files are in the correct directory
2. **Permission Denied**: Check file permissions (should be 644)
3. **Wrong MIME Type**: Configure server to serve correct content types
4. **Caching Issues**: Clear CDN/proxy caches after deployment

### Support

If you encounter issues:
1. Check the analysis report for specific recommendations
2. Visit https://docs.geoforge.dev for detailed documentation
3. Open an issue at https://github.com/brianfunk/geoforge

---

Generated by GEOforge on ${new Date().toLocaleString()}
`;

    return {
      name: 'DEPLOYMENT.md',
      content,
      type: 'text'
    };
  }

  private getCompressionLevel(): number {
    switch (this.config.compression) {
      case 'none': return 0;
      case 'standard': return 6;
      case 'maximum': return 9;
      default: return 6;
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private getAgentUserAgent(agentId: string): string {
    // Map agent IDs to their user agent strings
    const agentUserAgents: Record<string, string> = {
      'gptbot': 'GPTBot',
      'chatgpt-user': 'ChatGPT-User',
      'oai-search': 'OAI-SearchBot',
      'claudebot': 'ClaudeBot',
      'claude-search': 'Claude-SearchBot',
      'claude-user': 'Claude-User',
      'perplexitybot': 'PerplexityBot',
      'perplexity-user': 'Perplexity-User',
      'bingbot': 'Bingbot',
      'google-extended': 'Google-Extended',
      'applebot-ext': 'Applebot-Extended'
    };
    
    return agentUserAgents[agentId] || agentId;
  }
}