import { AGENTS } from '../../config/agents.js';
import type { AnalysisConfig, GenerationProfile } from '../../shared/types.js';

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
  profile: GenerationProfile;
  jsonSummary?: boolean;
  verbose?: boolean;
  agents?: Record<string, boolean>;
}

function buildProfileAgents(profile: GenerationProfile): Record<string, boolean> {
  if (profile === 'open-discovery') {
    return AGENTS.reduce((acc, agent) => {
      acc[agent.id] = true;
      return acc;
    }, {} as Record<string, boolean>);
  }

  if (profile === 'strict-privacy') {
    return AGENTS.reduce((acc, agent) => {
      acc[agent.id] = false;
      return acc;
    }, {} as Record<string, boolean>);
  }

  return AGENTS.reduce((acc, agent) => {
    acc[agent.id] = agent.defaultEnabled;
    return acc;
  }, {} as Record<string, boolean>);
}

export function createAnalysisConfig(url: string, options: CliOptions): AnalysisConfig {
  const profile = options.profile || 'balanced';
  const profileAgents = buildProfileAgents(profile);
  const effectiveAllowTraining = profile === 'strict-privacy' ? false : profile === 'open-discovery' ? true : options.allowTraining;

  return {
    url,
    siteName: 'Auto-detected',
    allowTraining: effectiveAllowTraining,
    profile,
    agents: profileAgents,
    includeHumans: options.humans,
    includeSitemap: options.sitemap,
    includeAssets: {
      html: true,
      css: true,
      js: true,
      images: true,
      fonts: true
    },
    compression: options.compression
  };
}

export function getCompressionLevel(compression: string): number {
  switch (compression) {
    case 'maximum':
      return 9;
    case 'none':
      return 0;
    default:
      return 6;
  }
}
