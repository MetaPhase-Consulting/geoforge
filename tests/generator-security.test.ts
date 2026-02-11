import { describe, it, expect } from 'vitest';
import fixture from './fixtures/analysisResult.json';
import { generateArtifacts } from '../src/shared/generationCore';

const options = {
  url: 'https://example.com/path?x=%0Ainjected',
  siteName: 'Example Domain',
  allowTraining: false,
  profile: 'balanced' as const,
  includeHumans: true,
  includeSitemap: true,
  includeAiTxt: true,
  includeSecurityTxt: true,
  includeManifest: true,
  includeAds: true,
  agents: {
    gptbot: true,
    claudebot: true,
    'google-extended': true,
    'applebot-ext': true
  }
};

describe('generation security regression', () => {
  it('prevents newline injection in robots sitemap line', () => {
    const artifacts = generateArtifacts(options, fixture as never);
    const robots = artifacts.find((item) => item.name === 'robots.txt');
    expect(robots).toBeDefined();
    expect(robots?.content).not.toMatch(/Sitemap:\s*.*[\r\n].*User-agent:/);
  });

  it('escapes XML sitemap loc values', () => {
    const malicious = {
      ...fixture,
      crawledPages: ['https://example.com/?q=<script>alert(1)</script>&x=1']
    };

    const artifacts = generateArtifacts(options, malicious as never);
    const sitemap = artifacts.find((item) => item.name === 'sitemap.xml');

    expect(sitemap).toBeDefined();
    expect(sitemap?.content).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(sitemap?.content).not.toContain('<script>alert(1)</script>');
  });
});
