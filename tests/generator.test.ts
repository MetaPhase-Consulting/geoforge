import { describe, it, expect } from 'vitest';
import fixture from './fixtures/analysisResult.json';
import { generateArtifacts } from '../src/shared/generationCore';

const baseOptions = {
  url: 'https://example.com',
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

describe('generation core', () => {
  it('generates core artifacts', () => {
    const artifacts = generateArtifacts(baseOptions, fixture as never);
    const names = artifacts.map((item) => item.name);

    expect(names).toContain('robots.txt');
    expect(names).toContain('sitemap.xml');
    expect(names).toContain('.well-known/ai.txt');
    expect(names).toContain('.well-known/security.txt');
    expect(names).toContain('geoforge.json');
  });

  it('applies strict privacy profile rules', () => {
    const artifacts = generateArtifacts({ ...baseOptions, profile: 'strict-privacy' as const }, fixture as never);
    const robots = artifacts.find((item) => item.name === 'robots.txt');

    expect(robots?.content).toContain('# Profile: strict-privacy');
    expect(robots?.content).toContain('Disallow: /');
  });

  it('uses nullable performance fields in report', () => {
    const customFixture = {
      ...fixture,
      performance: {
        loadTime: null,
        domContentLoaded: null,
        firstContentfulPaint: null,
        largestContentfulPaint: null,
        cumulativeLayoutShift: null,
        firstInputDelay: null
      }
    };

    const artifacts = generateArtifacts(baseOptions, customFixture as never);
    const report = artifacts.find((item) => item.name === 'geoforge.json');
    expect(report).toBeDefined();
    expect(report?.content).toContain('"loadTime": null');
  });
});
