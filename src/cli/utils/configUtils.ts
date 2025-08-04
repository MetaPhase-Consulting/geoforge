import { AGENTS } from '../../config/agents.js';
import type { AnalysisConfig } from '../cliWebsiteAnalyzer.js';

export interface CliOptions {
  allowTraining: boolean;
  humans: boolean;
  sitemap: boolean;
  aiTxt?: boolean;
  securityTxt?: boolean;
  manifest?: boolean;
  ads?: boolean;

  compression: 'none' | 'standard' | 'maximum';
  output?: string;
}

export function createAnalysisConfig(url: string, options: CliOptions): AnalysisConfig {
  return {
    url,
    siteName: 'Auto-detected', // Will be updated with actual title
    allowTraining: options.allowTraining,
    agents: AGENTS.reduce((acc, agent) => {
      acc[agent.id] = agent.defaultEnabled;
      return acc;
    }, {} as Record<string, boolean>),
    includeHumans: options.humans,
    includeSitemap: options.sitemap,
    includeAssets: {
      html: true,
      css: true,
      js: true,
      images: true,
      fonts: true
    },
    compression: options.compression,
  };
}

export function getCompressionLevel(compression: string): number {
  switch (compression) {
    case 'maximum': return 9;
    case 'none': return 0;
    default: return 6;
  }
} 