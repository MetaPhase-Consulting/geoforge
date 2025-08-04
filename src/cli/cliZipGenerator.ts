import JSZip from 'jszip';
import type { AnalysisConfig, AnalysisResult } from '../services/websiteAnalyzer';
import fs from 'fs/promises';
import path from 'path';

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

      console.log('🤖 Step 4: Generating AI agent manifests...');
      onProgress?.(40, 'Generating AI agent manifests...');
      const manifests = this.generateLLMManifests();
      console.log('📋 Generated manifests:', manifests.length);
      if (manifests && manifests.length > 0) {
        manifests.forEach((manifest, index) => {
          console.log(`📄 Adding manifest ${index + 1}: ${manifest.name} (${manifest.content.length} chars)`);
          zip.file(manifest.name, manifest.content);
        });
      } else {
        console.log('⚠️ No manifests generated');
      }

      console.log('📊 Step 5: Generating analysis report...');
      onProgress?.(50, 'Generating analysis report...');
      const analysisReport = this.generateAnalysisReport();
      console.log('✅ analysis-report.html generated, size:', analysisReport.content.length, 'chars');
      zip.file('analysis-report.html', analysisReport.content);
      
      const analysisData = JSON.stringify(this.analysisResult, null, 2);
      console.log('✅ analysis-data.json generated, size:', analysisData.length, 'chars');
      zip.file('analysis-data.json', analysisData);

      console.log('⚙️ Step 6: Generating configuration files...');
      onProgress?.(60, 'Generating configuration files...');
      const configFiles = this.generateConfigFiles();
      console.log('📋 Generated config files:', configFiles.length);
      if (configFiles && configFiles.length > 0) {
        configFiles.forEach((file, index) => {
          console.log(`📄 Adding config file ${index + 1}: ${file.name} (${file.content.length} chars)`);
          zip.file(file.name, file.content);
        });
      } else {
        console.log('⚠️ No config files generated');
      }

      console.log('📚 Step 7: Adding documentation...');
      onProgress?.(70, 'Adding documentation...');
      const documentation = this.generateDocumentation();
      console.log('✅ README.md generated, size:', documentation.content.length, 'chars');
      zip.file('README.md', documentation.content);

      console.log('📖 Step 8: Creating deployment guide...');
      onProgress?.(80, 'Creating deployment guide...');
      const deploymentGuide = this.generateDeploymentGuide();
      console.log('✅ DEPLOYMENT.md generated, size:', deploymentGuide.content.length, 'chars');
      zip.file('DEPLOYMENT.md', deploymentGuide.content);

      console.log('🗜️ Step 9: Compressing files...');
      onProgress?.(90, 'Compressing files...');
      const compressionLevel = this.getCompressionLevel();
      console.log('🔧 Compression level:', compressionLevel);
      
      console.log('📦 Generating ZIP blob...');
      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: compressionLevel }
      });
      console.log('✅ ZIP blob generated, size:', blob.size, 'bytes');

      console.log('💾 Step 10: Starting download...');
      onProgress?.(100, 'Download starting...');
      const filename = `${this.config.siteName || 'geoforge'}-geo-files-${new Date().toISOString().split('T')[0]}.zip`;
      console.log('📁 Filename:', filename);

      const outputPath = path.resolve(process.cwd(), filename);
      console.log(`💾 Saving ZIP file to: ${outputPath}`);
      const nodeBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: compressionLevel } });
      await fs.writeFile(outputPath, nodeBuffer);
      console.log('✅ ZIP file saved successfully.');

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

  private generateAnalysisReport(): GeneratedFile {
    // Ensure we have safe defaults for all properties
    const safeResult = {
      metadata: {
        title: this.analysisResult.metadata?.title || 'Unknown',
        description: this.analysisResult.metadata?.description || 'No description available',
        keywords: this.analysisResult.metadata?.keywords || [],
        author: this.analysisResult.metadata?.author || '',
        language: this.analysisResult.metadata?.language || 'en',
        charset: this.analysisResult.metadata?.charset || ''
      },
      technical: {
        statusCode: this.analysisResult.technical?.statusCode || 0,
        responseTime: this.analysisResult.technical?.responseTime || 0,
        sslEnabled: this.analysisResult.technical?.sslEnabled || false,
        hasRobots: this.analysisResult.technical?.hasRobots || false,
        hasSitemap: this.analysisResult.technical?.hasSitemap || false,
        contentType: this.analysisResult.technical?.contentType || '',
        contentLength: this.analysisResult.technical?.contentLength || 0
      },
      seo: {
        headings: this.analysisResult.seo?.headings || [],
        images: this.analysisResult.seo?.images || [],
        links: this.analysisResult.seo?.links || [],
        metaTags: this.analysisResult.seo?.metaTags || {}
      },
      performance: {
        loadTime: this.analysisResult.performance?.loadTime || 0,
        firstContentfulPaint: this.analysisResult.performance?.firstContentfulPaint || 0,
        largestContentfulPaint: this.analysisResult.performance?.largestContentfulPaint || 0,
        cumulativeLayoutShift: this.analysisResult.performance?.cumulativeLayoutShift || 0,
        domContentLoaded: this.analysisResult.performance?.domContentLoaded || 0,
        firstInputDelay: this.analysisResult.performance?.firstInputDelay || 0
      },
      accessibility: {
        score: this.analysisResult.accessibility?.score || 0,
        issues: this.analysisResult.accessibility?.issues || []
      },
      assets: {
        stylesheets: this.analysisResult.assets?.stylesheets || [],
        scripts: this.analysisResult.assets?.scripts || [],
        images: this.analysisResult.assets?.images || [],
        fonts: this.analysisResult.assets?.fonts || [],
        other: this.analysisResult.assets?.other || []
      },
      errors: this.analysisResult.errors || []
    };

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Website Analysis Report - ${this.config.siteName || 'Unknown Site'}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #D4AF37; border-bottom: 3px solid #D4AF37; padding-bottom: 10px; }
        h2 { color: #333; margin-top: 30px; }
        .metric { display: inline-block; margin: 10px; padding: 15px; background: #f8f9fa; border-radius: 6px; border-left: 4px solid #D4AF37; }
        .metric-label { font-weight: bold; display: block; }
        .metric-value { font-size: 1.2em; color: #D4AF37; }
        .success { color: #28a745; }
        .warning { color: #ffc107; }
        .error { color: #dc3545; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
        .card { background: #f8f9fa; padding: 20px; border-radius: 6px; border: 1px solid #dee2e6; }
        ul { list-style-type: none; padding: 0; }
        li { padding: 5px 0; border-bottom: 1px solid #eee; }
        .timestamp { color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Website Analysis Report</h1>
        <p class="timestamp">Generated on ${new Date().toLocaleString()} by GEOforge</p>
        
        <div class="grid">
            <div class="metric">
                <span class="metric-label">Website</span>
                <span class="metric-value">${this.config.url}</span>
            </div>
            <div class="metric">
                <span class="metric-label">Status Code</span>
                <span class="metric-value ${safeResult.technical.statusCode === 200 ? 'success' : 'error'}">${safeResult.technical.statusCode}</span>
            </div>
            <div class="metric">
                <span class="metric-label">Response Time</span>
                <span class="metric-value">${safeResult.technical.responseTime}ms</span>
            </div>
            <div class="metric">
                <span class="metric-label">SSL Enabled</span>
                <span class="metric-value ${safeResult.technical.sslEnabled ? 'success' : 'error'}">${safeResult.technical.sslEnabled ? 'Yes' : 'No'}</span>
            </div>
        </div>

        <h2>SEO Analysis</h2>
        <div class="grid">
            <div class="card">
                <h3>Page Title</h3>
                <p>${safeResult.metadata.title}</p>
            </div>
            <div class="card">
                <h3>Meta Description</h3>
                <p>${safeResult.metadata.description}</p>
            </div>
            <div class="card">
                <h3>Headings Structure</h3>
                <ul>
                    ${safeResult.seo.headings.slice(0, 10).map(h => `<li>H${h.level}: ${h.text}</li>`).join('')}
                </ul>
            </div>
            <div class="card">
                <h3>Images</h3>
                <p>Total: ${safeResult.seo.images.length}</p>
                <p>Missing Alt Text: ${safeResult.seo.images.filter(img => !img.alt).length}</p>
            </div>
        </div>

        <h2>Performance Metrics</h2>
        <div class="grid">
            <div class="metric">
                <span class="metric-label">Load Time</span>
                <span class="metric-value">${Math.round(safeResult.performance.loadTime)}ms</span>
            </div>
            <div class="metric">
                <span class="metric-label">First Contentful Paint</span>
                <span class="metric-value">${Math.round(safeResult.performance.firstContentfulPaint)}ms</span>
            </div>
            <div class="metric">
                <span class="metric-label">Largest Contentful Paint</span>
                <span class="metric-value">${Math.round(safeResult.performance.largestContentfulPaint)}ms</span>
            </div>
            <div class="metric">
                <span class="metric-label">Cumulative Layout Shift</span>
                <span class="metric-value">${safeResult.performance.cumulativeLayoutShift.toFixed(3)}</span>
            </div>
        </div>

        <h2>Accessibility Score</h2>
        <div class="metric">
            <span class="metric-label">Overall Score</span>
            <span class="metric-value ${safeResult.accessibility.score >= 80 ? 'success' : safeResult.accessibility.score >= 60 ? 'warning' : 'error'}">${safeResult.accessibility.score}/100</span>
        </div>

        ${safeResult.accessibility.issues.length > 0 ? `
        <h3>Accessibility Issues</h3>
        <ul>
            ${safeResult.accessibility.issues.map(issue => `<li class="${issue.severity}">${issue.message}</li>`).join('')}
        </ul>
        ` : ''}

        <h2>Technical Details</h2>
        <div class="grid">
            <div class="card">
                <h3>Robots.txt</h3>
                <p class="${safeResult.technical.hasRobots ? 'success' : 'warning'}">${safeResult.technical.hasRobots ? 'Found' : 'Not found'}</p>
            </div>
            <div class="card">
                <h3>Sitemap</h3>
                <p class="${safeResult.technical.hasSitemap ? 'success' : 'warning'}">${safeResult.technical.hasSitemap ? 'Found' : 'Not found'}</p>
            </div>
            <div class="card">
                <h3>Content Type</h3>
                <p>${safeResult.technical.contentType}</p>
            </div>
            <div class="card">
                <h3>Content Length</h3>
                <p>${this.formatBytes(safeResult.technical.contentLength)}</p>
            </div>
        </div>

        <h2>Discovered Assets</h2>
        <div class="grid">
            <div class="card">
                <h3>Stylesheets (${safeResult.assets.stylesheets.length})</h3>
                <ul>
                    ${safeResult.assets.stylesheets.slice(0, 5).map(css => `<li>${css}</li>`).join('')}
                    ${safeResult.assets.stylesheets.length > 5 ? `<li>... and ${safeResult.assets.stylesheets.length - 5} more</li>` : ''}
                </ul>
            </div>
            <div class="card">
                <h3>Scripts (${safeResult.assets.scripts.length})</h3>
                <ul>
                    ${safeResult.assets.scripts.slice(0, 5).map(js => `<li>${js}</li>`).join('')}
                    ${safeResult.assets.scripts.length > 5 ? `<li>... and ${safeResult.assets.scripts.length - 5} more</li>` : ''}
                </ul>
            </div>
            <div class="card">
                <h3>Images (${safeResult.assets.images.length})</h3>
                <ul>
                    ${safeResult.assets.images.slice(0, 5).map(img => `<li>${img}</li>`).join('')}
                    ${safeResult.assets.images.length > 5 ? `<li>... and ${safeResult.assets.images.length - 5} more</li>` : ''}
                </ul>
            </div>
        </div>

        ${safeResult.errors.length > 0 ? `
        <h2>Errors & Warnings</h2>
        <ul>
            ${safeResult.errors.map(error => `<li class="error">${error}</li>`).join('')}
        </ul>
        ` : ''}

        <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #666;">
            <p>Generated by <strong>GEOforge</strong> - AI Website Optimization Tool</p>
            <p>Visit <a href="https://geoforge.dev" style="color: #D4AF37;">geoforge.dev</a> for more information</p>
        </footer>
    </div>
</body>
</html>`;

    return {
      name: 'analysis-report.html',
      content: html,
      type: 'text'
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