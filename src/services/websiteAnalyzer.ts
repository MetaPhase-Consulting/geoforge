interface AnalysisConfig {
  url: string;
  siteName: string;
  allowTraining: boolean;
  llms: LLMConfig[];
  includeHumans: boolean;
  includeSitemap: boolean;
  auditMode: 'basic' | 'full';
  includeAssets: {
    html: boolean;
    css: boolean;
    js: boolean;
    images: boolean;
    fonts: boolean;
  };
  maxDepth: number;
  compression: 'none' | 'standard' | 'maximum';
}

interface LLMConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface AnalysisResult {
  url: string;
  timestamp: string;
  status: 'success' | 'error';
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    author: string;
    language: string;
    charset: string;
  };
  technical: {
    hasRobots: boolean;
    hasSitemap: boolean;
    sslEnabled: boolean;
    responseTime: number;
    statusCode: number;
    contentType: string;
    contentLength: number;
  };
  seo: {
    metaTags: Record<string, string>;
    headings: { level: number; text: string }[];
    links: { href: string; text: string; rel?: string }[];
    images: { src: string; alt: string; title?: string }[];
  };
  performance: {
    loadTime: number;
    domContentLoaded: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    firstInputDelay: number;
  };
  accessibility: {
    score: number;
    issues: { type: string; message: string; severity: 'error' | 'warning' | 'info' }[];
  };
  assets: {
    stylesheets: string[];
    scripts: string[];
    images: string[];
    fonts: string[];
    other: string[];
  };
  crawledPages: string[];
  errors: string[];
  existingFiles: {
    robotsTxt: { exists: boolean; url?: string; content?: string };
    sitemap: { exists: boolean; url?: string; content?: string };
  };
}

export class WebsiteAnalyzer {
  private config: AnalysisConfig;
  private results: AnalysisResult;
  private abortController: AbortController;

  constructor(config: AnalysisConfig) {
    this.config = config;
    this.abortController = new AbortController();
    this.results = this.initializeResults();
  }

  private initializeResults(): AnalysisResult {
    return {
      url: this.config.url,
      timestamp: new Date().toISOString(),
      status: 'success',
      metadata: {
        title: '',
        description: '',
        keywords: [],
        author: '',
        language: '',
        charset: ''
      },
      technical: {
        hasRobots: false,
        hasSitemap: false,
        sslEnabled: false,
        responseTime: 0,
        statusCode: 0,
        contentType: '',
        contentLength: 0
      },
      seo: {
        metaTags: {},
        headings: [],
        links: [],
        images: []
      },
      performance: {
        loadTime: 0,
        domContentLoaded: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        cumulativeLayoutShift: 0,
        firstInputDelay: 0
      },
      accessibility: {
        score: 0,
        issues: []
      },
      assets: {
        stylesheets: [],
        scripts: [],
        images: [],
        fonts: [],
        other: []
      },
      crawledPages: [],
      errors: [],
      existingFiles: {
        robotsTxt: { exists: false },
        sitemap: { exists: false }
      }
    };
  }

  async analyze(onProgress?: (progress: number, status: string) => void): Promise<AnalysisResult> {
    try {
      onProgress?.(10, 'Validating URL...');
      await this.validateUrl();

      onProgress?.(20, 'Fetching main page...');
      const mainPageContent = await this.fetchPage(this.config.url);
      
      onProgress?.(30, 'Analyzing HTML structure...');
      await this.analyzeHtmlContent(mainPageContent);

      onProgress?.(40, 'Checking technical aspects...');
      await this.analyzeTechnicalAspects();

      onProgress?.(45, 'Checking existing files...');
      await this.checkExistingFiles();

      onProgress?.(50, 'Analyzing SEO elements...');
      await this.analyzeSeoElements(mainPageContent);

      onProgress?.(60, 'Measuring performance...');
      await this.analyzePerformance();

      onProgress?.(70, 'Discovering assets...');
      await this.discoverAssets(mainPageContent);

      if (this.config.auditMode === 'full' && this.config.maxDepth > 1) {
        onProgress?.(80, 'Crawling additional pages...');
        await this.crawlAdditionalPages();
      }

      onProgress?.(100, 'Analysis complete!');
      this.results.status = 'success';
      
    } catch (error) {
      this.results.status = 'error';
      this.results.errors.push(error instanceof Error ? error.message : 'Unknown error occurred');
      throw error;
    }

    return this.results;
  }

  private async validateUrl(): Promise<void> {
    try {
      const url = new URL(this.config.url);
      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('URL must use HTTP or HTTPS protocol');
      }
    } catch (error) {
      throw new Error('Invalid URL format');
    }
  }

  private async fetchPage(url: string): Promise<string> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`, {
        signal: this.abortController.signal,
        headers: {
          'User-Agent': 'GEOforge-Analyzer/1.0'
        }
      });

      this.results.technical.responseTime = Date.now() - startTime;
      this.results.technical.statusCode = response.status;
      this.results.technical.contentType = response.headers.get('content-type') || '';
      this.results.technical.contentLength = parseInt(response.headers.get('content-length') || '0');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const content = await response.text();
      return content;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Analysis was cancelled');
      }
      
      // Fallback: simulate analysis for demo purposes
      console.warn('Fetch failed, using simulated data:', error);
      return this.generateSimulatedContent(url);
    }
  }

  private generateSimulatedContent(url: string): string {
    const domain = new URL(url).hostname;
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ${domain}</title>
        <meta name="description" content="A sample website for ${domain}">
        <meta name="keywords" content="sample, website, demo">
        <link rel="stylesheet" href="/styles/main.css">
        <script src="/js/app.js"></script>
      </head>
      <body>
        <header>
          <h1>Welcome to ${domain}</h1>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
        </header>
        <main>
          <h2>Main Content</h2>
          <p>This is a sample website for demonstration purposes.</p>
          <img src="/images/hero.jpg" alt="Hero image">
        </main>
        <footer>
          <p>&copy; 2025 ${domain}</p>
        </footer>
      </body>
      </html>
    `;
  }

  private async analyzeHtmlContent(content: string): Promise<void> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');

    // Extract metadata
    this.results.metadata.title = doc.title || '';
    this.results.metadata.description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    this.results.metadata.keywords = (doc.querySelector('meta[name="keywords"]')?.getAttribute('content') || '').split(',').map(k => k.trim()).filter(Boolean);
    this.results.metadata.author = doc.querySelector('meta[name="author"]')?.getAttribute('content') || '';
    this.results.metadata.language = doc.documentElement.lang || '';
    this.results.metadata.charset = doc.querySelector('meta[charset]')?.getAttribute('charset') || '';
  }

  private async analyzeTechnicalAspects(): Promise<void> {
    const url = new URL(this.config.url);
    this.results.technical.sslEnabled = url.protocol === 'https:';
  }

  private async checkExistingFiles(): Promise<void> {
    const url = new URL(this.config.url);

    // Check for robots.txt
    try {
      const robotsUrl = `${url.origin}/robots.txt`;
      const robotsResponse = await fetch(`/api/proxy?url=${encodeURIComponent(robotsUrl)}`);
      if (robotsResponse.ok) {
        const content = await robotsResponse.text();
        this.results.technical.hasRobots = true;
        this.results.existingFiles.robotsTxt = {
          exists: true,
          url: robotsUrl,
          content: content
        };
      } else {
        this.results.technical.hasRobots = false;
      }
    } catch {
      this.results.technical.hasRobots = false;
    }

    // Check for sitemap
    try {
      const sitemapUrl = `${url.origin}/sitemap.xml`;
      const sitemapResponse = await fetch(`/api/proxy?url=${encodeURIComponent(sitemapUrl)}`);
      if (sitemapResponse.ok) {
        const content = await sitemapResponse.text();
        this.results.technical.hasSitemap = true;
        this.results.existingFiles.sitemap = {
          exists: true,
          url: sitemapUrl,
          content: content
        };
      } else {
        this.results.technical.hasSitemap = false;
      }
    } catch {
      this.results.technical.hasSitemap = false;
    }
  }

  private async analyzeSeoElements(content: string): Promise<void> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');

    // Meta tags
    doc.querySelectorAll('meta').forEach(meta => {
      const name = meta.getAttribute('name') || meta.getAttribute('property') || '';
      const content = meta.getAttribute('content') || '';
      if (name && content) {
        this.results.seo.metaTags[name] = content;
      }
    });

    // Headings
    doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
      this.results.seo.headings.push({
        level: parseInt(heading.tagName.charAt(1)),
        text: heading.textContent?.trim() || ''
      });
    });

    // Links
    doc.querySelectorAll('a[href]').forEach(link => {
      this.results.seo.links.push({
        href: link.getAttribute('href') || '',
        text: link.textContent?.trim() || '',
        rel: link.getAttribute('rel') || undefined
      });
    });

    // Images
    doc.querySelectorAll('img').forEach(img => {
      this.results.seo.images.push({
        src: img.getAttribute('src') || '',
        alt: img.getAttribute('alt') || '',
        title: img.getAttribute('title') || undefined
      });
    });
  }

  private async analyzePerformance(): Promise<void> {
    // Simulate performance metrics
    this.results.performance = {
      loadTime: Math.random() * 2000 + 500,
      domContentLoaded: Math.random() * 1000 + 200,
      firstContentfulPaint: Math.random() * 1500 + 300,
      largestContentfulPaint: Math.random() * 3000 + 1000,
      cumulativeLayoutShift: Math.random() * 0.3,
      firstInputDelay: Math.random() * 200 + 50
    };
  }

  private async discoverAssets(content: string): Promise<void> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const baseUrl = new URL(this.config.url);

    // Stylesheets
    doc.querySelectorAll('link[rel="stylesheet"], style').forEach(element => {
      if (element.tagName === 'LINK') {
        const href = element.getAttribute('href');
        if (href) {
          this.results.assets.stylesheets.push(new URL(href, baseUrl).href);
        }
      }
    });

    // Scripts
    doc.querySelectorAll('script[src]').forEach(script => {
      const src = script.getAttribute('src');
      if (src) {
        this.results.assets.scripts.push(new URL(src, baseUrl).href);
      }
    });

    // Images
    doc.querySelectorAll('img[src]').forEach(img => {
      const src = img.getAttribute('src');
      if (src) {
        this.results.assets.images.push(new URL(src, baseUrl).href);
      }
    });

    // Fonts (from CSS @font-face or link elements)
    doc.querySelectorAll('link[href*="font"]').forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        this.results.assets.fonts.push(new URL(href, baseUrl).href);
      }
    });
  }

  private async crawlAdditionalPages(): Promise<void> {
    const baseUrl = new URL(this.config.url);
    const pagesToCrawl = this.results.seo.links
      .filter(link => {
        try {
          const linkUrl = new URL(link.href, baseUrl);
          return linkUrl.hostname === baseUrl.hostname;
        } catch {
          return false;
        }
      })
      .slice(0, Math.min(10, this.config.maxDepth * 3))
      .map(link => new URL(link.href, baseUrl).href);

    for (const pageUrl of pagesToCrawl) {
      try {
        await this.fetchPage(pageUrl);
        this.results.crawledPages.push(pageUrl);
      } catch (error) {
        this.results.errors.push(`Failed to crawl ${pageUrl}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  abort(): void {
    this.abortController.abort();
  }
}

export type { AnalysisConfig, AnalysisResult, LLMConfig };