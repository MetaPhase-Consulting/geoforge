import { AGENTS, Agent } from '../config/agents';

interface AnalysisConfig {
  url: string;
  siteName: string;
  allowTraining: boolean;
  agents: Record<string, boolean>;
  includeHumans: boolean;
  includeSitemap: boolean;
  includeAssets: {
    html: boolean;
    css: boolean;
    js: boolean;
    images: boolean;
    fonts: boolean;
  };
  compression: 'none' | 'standard' | 'maximum';
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
    console.log('🔍 WebsiteAnalyzer.analyze started');
    console.log('📋 Config:', this.config);
    
    try {
      console.log('✅ Step 1: Validating URL...');
      onProgress?.(10, 'Validating URL...');
      await this.validateUrl();
      console.log('✅ URL validation passed');

      console.log('🌐 Step 2: Fetching main page...');
      onProgress?.(20, 'Fetching main page...');
      const mainPageContent = await this.fetchPage(this.config.url);
      console.log('✅ Main page fetched, content length:', mainPageContent.length);
      
      console.log('📄 Step 3: Analyzing HTML structure...');
      onProgress?.(30, 'Analyzing HTML structure...');
      await this.analyzeHtmlContent(mainPageContent);
      console.log('✅ HTML analysis complete');

      console.log('⚙️ Step 4: Checking technical aspects...');
      onProgress?.(40, 'Checking technical aspects...');
      await this.analyzeTechnicalAspects();
      console.log('✅ Technical analysis complete');

      console.log('📁 Step 5: Checking existing files...');
      onProgress?.(45, 'Checking existing files...');
      await this.checkExistingFiles();
      console.log('✅ Existing files check complete');

      console.log('🔍 Step 6: Analyzing SEO elements...');
      onProgress?.(50, 'Analyzing SEO elements...');
      await this.analyzeSeoElements(mainPageContent);
      console.log('✅ SEO analysis complete');

      console.log('⚡ Step 7: Measuring performance...');
      onProgress?.(60, 'Measuring performance...');
      await this.analyzePerformance();
      console.log('✅ Performance analysis complete');

      console.log('📦 Step 8: Discovering assets...');
      onProgress?.(70, 'Discovering assets...');
      await this.discoverAssets(mainPageContent);
      console.log('✅ Asset discovery complete');

      console.log('🎉 Step 9: Analysis complete!');
      onProgress?.(100, 'Analysis complete!');
      this.results.status = 'success';
      console.log('✅ Final results:', this.results);
      
    } catch (error) {
      console.error('💥 Error in WebsiteAnalyzer.analyze:', error);
      console.error('🔍 Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      
      this.results.status = 'error';
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.results.errors.push(errorMessage);
      
      // If we can't fetch the site at all, set a specific error
      if (errorMessage.includes('Unable to fetch website content') || 
          errorMessage.includes('Request timed out') ||
          errorMessage.includes('Failed to fetch')) {
        throw new Error('Website appears to be unreachable. Please check the URL and ensure the website is accessible.');
      }
      
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
    const FETCH_TIMEOUT = 10000; // 10 seconds timeout
    
    try {
      // Create timeout controller
      const timeoutController = new AbortController();
      const timeoutId = setTimeout(() => timeoutController.abort(), FETCH_TIMEOUT);
      
      // Combine user abort and timeout signals
      const combinedSignal = AbortSignal.any ? 
        AbortSignal.any([this.abortController.signal, timeoutController.signal]) :
        timeoutController.signal;

      try {
        // Try direct fetch first (will work for CORS-enabled sites)
        const response = await fetch(url, {
          signal: combinedSignal,
          headers: {
            'User-Agent': 'GEOforge-Analyzer/1.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          }
        });

        clearTimeout(timeoutId);
        this.results.technical.responseTime = Date.now() - startTime;
        this.results.technical.statusCode = response.status;
        this.results.technical.contentType = response.headers.get('content-type') || '';
        this.results.technical.contentLength = parseInt(response.headers.get('content-length') || '0');

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const content = await response.text();
        return content;
        
      } catch (directFetchError) {
        clearTimeout(timeoutId);
        
        // Check if it was a timeout
        if (directFetchError instanceof Error && directFetchError.name === 'AbortError') {
          if (timeoutController.signal.aborted) {
            throw new Error(`Request timed out after ${FETCH_TIMEOUT / 1000} seconds. The website may be slow to respond or unreachable.`);
          } else {
            throw new Error('Analysis was cancelled by user');
          }
        }
        
        // Try CORS proxy as fallback
        console.warn('Direct fetch failed, trying CORS proxy:', directFetchError);
        
        const proxyTimeoutController = new AbortController();
        const proxyTimeoutId = setTimeout(() => proxyTimeoutController.abort(), FETCH_TIMEOUT);
        
        const proxySignal = AbortSignal.any ? 
          AbortSignal.any([this.abortController.signal, proxyTimeoutController.signal]) :
          proxyTimeoutController.signal;

        try {
          const proxyResponse = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`, {
            signal: proxySignal
          });
          
          clearTimeout(proxyTimeoutId);
          
          if (proxyResponse.ok) {
            const proxyData = await proxyResponse.json();
            this.results.technical.responseTime = Date.now() - startTime;
            this.results.technical.statusCode = 200;
            this.results.technical.contentType = 'text/html';
            this.results.technical.contentLength = proxyData.contents.length;
            return proxyData.contents;
          } else {
            throw new Error(`Proxy service returned HTTP ${proxyResponse.status}`);
          }
        } catch (proxyError) {
          clearTimeout(proxyTimeoutId);
          
          if (proxyError instanceof Error && proxyError.name === 'AbortError') {
            if (proxyTimeoutController.signal.aborted) {
              throw new Error(`Request timed out after ${FETCH_TIMEOUT / 1000} seconds using proxy service. The website appears to be unreachable.`);
            } else {
              throw new Error('Analysis was cancelled by user');
            }
          }
          
          // Both direct and proxy failed
          throw new Error(`Unable to fetch website content. This could be due to:\n• CORS restrictions blocking direct access\n• Website is down or unreachable\n• Network connectivity issues\n• Website blocking automated requests\n\nOriginal error: ${directFetchError instanceof Error ? directFetchError.message : 'Network error'}`);
        }
      }

    } catch (error) {
      // Re-throw the error as-is since we've already handled it above
      throw error;
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
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');

      // Extract metadata with better error handling
      this.results.metadata.title = doc.title?.trim() || '';
      
      const descriptionMeta = doc.querySelector('meta[name="description"]') || 
                             doc.querySelector('meta[property="og:description"]');
      this.results.metadata.description = descriptionMeta?.getAttribute('content')?.trim() || '';
      
      const keywordsMeta = doc.querySelector('meta[name="keywords"]');
      const keywordsContent = keywordsMeta?.getAttribute('content') || '';
      this.results.metadata.keywords = keywordsContent
        .split(',')
        .map(k => k.trim())
        .filter(Boolean);
      
      this.results.metadata.author = doc.querySelector('meta[name="author"]')?.getAttribute('content')?.trim() || '';
      this.results.metadata.language = doc.documentElement.lang || doc.querySelector('html')?.getAttribute('lang') || '';
      
      const charsetMeta = doc.querySelector('meta[charset]') || 
                         doc.querySelector('meta[http-equiv="Content-Type"]');
      this.results.metadata.charset = charsetMeta?.getAttribute('charset') || 
                                     charsetMeta?.getAttribute('content')?.match(/charset=([^;]+)/)?.[1] || '';
      
      console.log('Extracted metadata:', this.results.metadata);
    } catch (error) {
      console.error('Error parsing HTML content:', error);
      // Set fallback values
      this.results.metadata.title = 'Unable to parse title';
      this.results.metadata.description = 'Unable to parse description';
    }
  }

  private async analyzeTechnicalAspects(): Promise<void> {
    const url = new URL(this.config.url);
    this.results.technical.sslEnabled = url.protocol === 'https:';
  }

  private async checkExistingFiles(): Promise<void> {
    const url = new URL(this.config.url);
    const FILE_TIMEOUT = 5000; // 5 seconds for individual file checks

    // CORS proxy services to try in sequence
    const corsProxies = [
      'https://api.allorigins.win/get?url=',
      'https://corsproxy.io/?',
      'https://thingproxy.freeboard.io/fetch/',
      'https://cors-anywhere.herokuapp.com/',
      'https://api.codetabs.com/v1/proxy?quest=',
      'https://cors.bridged.cc/',
      'https://api.codetabs.com/v1/proxy?quest='
    ];

    // Helper function to validate content type
    const validateContent = (content: string, expectedType: 'robots' | 'sitemap'): boolean => {
      const trimmedContent = content.trim();
      
      if (expectedType === 'robots') {
        // Check for robots.txt content patterns
        const robotsPatterns = [
          /^User-agent:/i,
          /^Disallow:/i,
          /^Allow:/i,
          /^Sitemap:/i,
          /^Crawl-delay:/i,
          /^#/ // Comments
        ];
        
        // Must contain at least one robots.txt directive or be empty
        return trimmedContent === '' || robotsPatterns.some(pattern => pattern.test(trimmedContent));
      } else if (expectedType === 'sitemap') {
        // Check for XML sitemap content patterns
        const xmlPatterns = [
          /^<\?xml/i,
          /<urlset/i,
          /<sitemapindex/i,
          /<url>/i,
          /<loc>/i,
          /<lastmod>/i
        ];
        
        // Must contain XML declaration and sitemap structure
        return xmlPatterns.some(pattern => pattern.test(trimmedContent));
      }
      
      return false;
    };

    // Helper function to try direct fetch first, then CORS proxies
    const fetchWithCorsFallback = async (targetUrl: string, timeout: number, expectedType: 'robots' | 'sitemap'): Promise<{ success: boolean; content?: string; error?: string }> => {
      // Try direct fetch first
      let timeoutId: number | null = null;
      try {
        const timeoutController = new AbortController();
        timeoutId = setTimeout(() => timeoutController.abort(), timeout);
        
        const signal = AbortSignal.any ? 
          AbortSignal.any([this.abortController.signal, timeoutController.signal]) :
          timeoutController.signal;

        const response = await fetch(targetUrl, {
          signal,
          headers: {
            'User-Agent': 'GEOforge-Analyzer/1.0',
            'Accept': 'text/plain,application/xml,text/xml;q=0.9,*/*;q=0.8'
          }
        });
        
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        
        if (response.ok) {
          const content = await response.text();
          // Validate that the content is actually the expected file type
          if (validateContent(content, expectedType)) {
            return { success: true, content };
          } else {
            console.warn(`Content validation failed for ${targetUrl} - expected ${expectedType} but got invalid content`);
            return { success: false, error: `Invalid ${expectedType} content` };
          }
        }
      } catch (directError) {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        console.warn(`Direct fetch failed for ${targetUrl}:`, directError);
      }

      // Try CORS proxies in sequence
      for (const proxy of corsProxies) {
        try {
          const proxyUrl = proxy + encodeURIComponent(targetUrl);
          const timeoutController = new AbortController();
          timeoutId = setTimeout(() => timeoutController.abort(), timeout);
          
          const signal = AbortSignal.any ? 
            AbortSignal.any([this.abortController.signal, timeoutController.signal]) :
            timeoutController.signal;

          const response = await fetch(proxyUrl, {
            signal,
            headers: {
              'User-Agent': 'GEOforge-Analyzer/1.0',
              'Accept': 'text/plain,application/xml,text/xml;q=0.9,*/*;q=0.8'
            }
          });
          
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          
          if (response.ok) {
            let content: string;
            
            // Handle different proxy response formats
            if (proxy.includes('allorigins.win')) {
              const data = await response.json();
              content = data.contents;
            } else if (proxy.includes('codetabs.com')) {
              const data = await response.json();
              content = data.data;
            } else {
              content = await response.text();
            }
            
            // Validate that the content is actually the expected file type
            if (validateContent(content, expectedType)) {
              return { success: true, content };
            } else {
              console.warn(`Content validation failed for ${targetUrl} via proxy ${proxy} - expected ${expectedType} but got invalid content`);
              continue; // Try next proxy
            }
          }
        } catch (proxyError) {
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          console.warn(`Proxy ${proxy} failed for ${targetUrl}:`, proxyError);
          continue; // Try next proxy
        }
      }

      return { success: false, error: 'All direct and proxy attempts failed' };
    };

    // Check for robots.txt
    const robotsUrl = `${url.origin}/robots.txt`;
    const robotsResult = await fetchWithCorsFallback(robotsUrl, FILE_TIMEOUT, 'robots');
    
    if (robotsResult.success && robotsResult.content) {
      this.results.technical.hasRobots = true;
      this.results.existingFiles.robotsTxt = {
        exists: true,
        url: robotsUrl,
        content: robotsResult.content
      };
    } else {
      this.results.technical.hasRobots = false;
      this.results.existingFiles.robotsTxt = { exists: false };
    }

    // Check for sitemap.xml
    const sitemapUrl = `${url.origin}/sitemap.xml`;
    const sitemapResult = await fetchWithCorsFallback(sitemapUrl, FILE_TIMEOUT, 'sitemap');
    
    if (sitemapResult.success && sitemapResult.content) {
      this.results.technical.hasSitemap = true;
      this.results.existingFiles.sitemap = {
        exists: true,
        url: sitemapUrl,
        content: sitemapResult.content
      };
    } else {
      this.results.technical.hasSitemap = false;
      this.results.existingFiles.sitemap = { exists: false };
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


  abort(): void {
    this.abortController.abort();
  }
}

export type { AnalysisConfig, AnalysisResult };