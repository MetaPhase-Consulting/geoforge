export type CompressionLevel = 'none' | 'standard' | 'maximum';
export type GenerationProfile = 'strict-privacy' | 'balanced' | 'open-discovery';

export interface AnalysisConfig {
  url: string;
  siteName: string;
  allowTraining: boolean;
  profile: GenerationProfile;
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
  compression: CompressionLevel;
}

export interface AnalysisResult {
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
    loadTime: number | null;
    domContentLoaded: number | null;
    firstContentfulPaint: number | null;
    largestContentfulPaint: number | null;
    cumulativeLayoutShift: number | null;
    firstInputDelay: number | null;
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

export interface GeneratedArtifact {
  name: string;
  content: string;
  type: 'text' | 'json' | 'xml';
}

export interface GenerationOptions {
  url: string;
  profile: GenerationProfile;
  allowTraining: boolean;
  includeHumans: boolean;
  includeSitemap: boolean;
  includeAiTxt: boolean;
  includeSecurityTxt: boolean;
  includeManifest: boolean;
  includeAds: boolean;
  siteName: string;
  agents: Record<string, boolean>;
}
