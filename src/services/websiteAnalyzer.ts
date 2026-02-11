import type { AnalysisConfig, AnalysisResult } from '../shared/types';

const FETCH_TIMEOUT_MS = 15000;
const FILE_CHECK_TIMEOUT_MS = 5000;
const PROXIES = [
  { url: 'https://api.allorigins.win/get?url=', field: 'contents' },
  { url: 'https://api.codetabs.com/v1/proxy?quest=', field: '' }
] as const;

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
        loadTime: null,
        domContentLoaded: null,
        firstContentfulPaint: null,
        largestContentfulPaint: null,
        cumulativeLayoutShift: null,
        firstInputDelay: null
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
      this.validateUrl();

      onProgress?.(25, 'Fetching main page...');
      const mainPageContent = await this.fetchPage(this.config.url);

      onProgress?.(45, 'Analyzing metadata and SEO...');
      this.analyzeHtmlContent(mainPageContent);
      this.analyzeSeoElements(mainPageContent);
      this.discoverAssets(mainPageContent);

      onProgress?.(60, 'Checking technical aspects...');
      this.analyzeTechnicalAspects();

      onProgress?.(75, 'Checking existing robots and sitemap...');
      await this.checkExistingFiles();

      onProgress?.(90, 'Finalizing metrics...');
      this.analyzePerformance();

      this.results.status = 'success';
      onProgress?.(100, 'Analysis complete');
    } catch (error) {
      this.results.status = 'error';
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      this.results.errors.push(message);
      throw error;
    }

    return this.results;
  }

  private validateUrl(): void {
    const url = new URL(this.config.url);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('URL must use HTTP or HTTPS protocol');
    }
  }

  private async fetchWithTimeout(url: string, timeoutMs: number, accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'): Promise<Response> {
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);
    const signal = AbortSignal.any
      ? AbortSignal.any([this.abortController.signal, timeoutController.signal])
      : timeoutController.signal;

    try {
      return await fetch(url, {
        signal,
        headers: {
          'User-Agent': 'GEOforge-Analyzer/1.0',
          Accept: accept
        }
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async fetchPage(url: string): Promise<string> {
    const startTime = Date.now();

    // Retry direct fetch once with short backoff.
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const response = await this.fetchWithTimeout(url, FETCH_TIMEOUT_MS);
        if (response.ok) {
          const content = await response.text();
          this.results.technical.responseTime = Date.now() - startTime;
          this.results.technical.statusCode = response.status;
          this.results.technical.contentType = response.headers.get('content-type') || '';
          this.results.technical.contentLength = content.length;
          return content;
        }
      } catch {
        // ignore and retry/fallback
      }

      await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
    }

    for (const proxy of PROXIES) {
      const proxyUrl = `${proxy.url}${encodeURIComponent(url)}`;
      try {
        const response = await this.fetchWithTimeout(proxyUrl, FETCH_TIMEOUT_MS, '*/*');
        if (!response.ok) continue;

        let content = '';
        if (proxy.field) {
          const data = await response.json();
          content = String(data[proxy.field] || '');
        } else {
          content = await response.text();
        }

        if (!content) continue;
        this.results.technical.responseTime = Date.now() - startTime;
        this.results.technical.statusCode = 200;
        this.results.technical.contentType = 'text/html';
        this.results.technical.contentLength = content.length;
        this.results.errors.push('Fetched through proxy fallback because direct request failed (possible CORS restriction).');
        return content;
      } catch {
        // continue
      }
    }

    throw new Error(
      'Unable to fetch website content. Direct request failed and safe proxy fallback did not return readable HTML. This usually means CORS or anti-bot protection blocked the request.'
    );
  }

  private analyzeHtmlContent(content: string): void {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');

    this.results.metadata.title = doc.title?.trim() || '';
    this.results.metadata.description =
      doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() ||
      doc.querySelector('meta[property="og:description"]')?.getAttribute('content')?.trim() ||
      '';

    this.results.metadata.keywords = (doc.querySelector('meta[name="keywords"]')?.getAttribute('content') || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    this.results.metadata.author = doc.querySelector('meta[name="author"]')?.getAttribute('content')?.trim() || '';
    this.results.metadata.language = doc.documentElement.lang || '';
    this.results.metadata.charset =
      doc.querySelector('meta[charset]')?.getAttribute('charset') ||
      doc.querySelector('meta[http-equiv="Content-Type"]')?.getAttribute('content')?.match(/charset=([^;]+)/)?.[1] ||
      '';
  }

  private analyzeTechnicalAspects(): void {
    const url = new URL(this.config.url);
    this.results.technical.sslEnabled = url.protocol === 'https:';
  }

  private isValidFileContent(content: string, expectedType: 'robots' | 'sitemap'): boolean {
    const text = content.trim();
    if (!text) return false;

    if (expectedType === 'robots') {
      return /(User-agent:|Disallow:|Allow:|Sitemap:)/i.test(text);
    }

    return /(<urlset|<sitemapindex|<loc>)/i.test(text);
  }

  private async fetchWithFallback(url: string, expectedType: 'robots' | 'sitemap'): Promise<string | null> {
    try {
      const response = await this.fetchWithTimeout(url, FILE_CHECK_TIMEOUT_MS, 'text/plain,application/xml,text/xml;q=0.9,*/*;q=0.8');
      if (response.ok) {
        const content = await response.text();
        if (this.isValidFileContent(content, expectedType)) return content;
      }
    } catch {
      // continue
    }

    for (const proxy of PROXIES) {
      try {
        const response = await this.fetchWithTimeout(`${proxy.url}${encodeURIComponent(url)}`, FILE_CHECK_TIMEOUT_MS, '*/*');
        if (!response.ok) continue;

        const content = proxy.field ? String((await response.json())[proxy.field] || '') : await response.text();
        if (this.isValidFileContent(content, expectedType)) return content;
      } catch {
        // continue
      }
    }

    return null;
  }

  private async checkExistingFiles(): Promise<void> {
    const base = new URL(this.config.url).origin;
    const robotsUrl = `${base}/robots.txt`;
    const sitemapUrl = `${base}/sitemap.xml`;

    const robots = await this.fetchWithFallback(robotsUrl, 'robots');
    if (robots) {
      this.results.technical.hasRobots = true;
      this.results.existingFiles.robotsTxt = { exists: true, url: robotsUrl, content: robots };
    }

    const sitemap = await this.fetchWithFallback(sitemapUrl, 'sitemap');
    if (sitemap) {
      this.results.technical.hasSitemap = true;
      this.results.existingFiles.sitemap = { exists: true, url: sitemapUrl, content: sitemap };
    }
  }

  private analyzeSeoElements(content: string): void {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');

    doc.querySelectorAll('meta').forEach((meta) => {
      const name = meta.getAttribute('name') || meta.getAttribute('property') || '';
      const value = meta.getAttribute('content') || '';
      if (name && value) this.results.seo.metaTags[name] = value;
    });

    doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
      this.results.seo.headings.push({
        level: Number.parseInt(heading.tagName[1], 10),
        text: heading.textContent?.trim() || ''
      });
    });

    doc.querySelectorAll('a[href]').forEach((link) => {
      this.results.seo.links.push({
        href: link.getAttribute('href') || '',
        text: link.textContent?.trim() || '',
        rel: link.getAttribute('rel') || undefined
      });
    });

    doc.querySelectorAll('img').forEach((img) => {
      this.results.seo.images.push({
        src: img.getAttribute('src') || '',
        alt: img.getAttribute('alt') || '',
        title: img.getAttribute('title') || undefined
      });
    });
  }

  private analyzePerformance(): void {
    const response = this.results.technical.responseTime || null;
    this.results.performance = {
      loadTime: response,
      domContentLoaded: null,
      firstContentfulPaint: null,
      largestContentfulPaint: null,
      cumulativeLayoutShift: null,
      firstInputDelay: null
    };
  }

  private discoverAssets(content: string): void {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const baseUrl = new URL(this.config.url);

    doc.querySelectorAll('link[rel="stylesheet"]').forEach((element) => {
      const href = element.getAttribute('href');
      if (href) this.results.assets.stylesheets.push(new URL(href, baseUrl).href);
    });

    doc.querySelectorAll('script[src]').forEach((script) => {
      const src = script.getAttribute('src');
      if (src) this.results.assets.scripts.push(new URL(src, baseUrl).href);
    });

    doc.querySelectorAll('img[src]').forEach((img) => {
      const src = img.getAttribute('src');
      if (src) this.results.assets.images.push(new URL(src, baseUrl).href);
    });

    doc.querySelectorAll('link[href*="font"]').forEach((font) => {
      const href = font.getAttribute('href');
      if (href) this.results.assets.fonts.push(new URL(href, baseUrl).href);
    });
  }

  abort(): void {
    this.abortController.abort();
  }
}

export type { AnalysisConfig, AnalysisResult };
