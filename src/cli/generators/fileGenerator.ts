import JSZip from 'jszip';
import type { AnalysisResult, GeneratedArtifact } from '../../shared/types.js';
import { generateArtifacts } from '../../shared/generationCore.js';
import type { CliOptions } from '../utils/configUtils.js';

export function buildArtifacts(url: string, analysis: AnalysisResult, options: CliOptions): GeneratedArtifact[] {
  return generateArtifacts(
    {
      url,
      profile: options.profile,
      allowTraining: options.allowTraining,
      includeHumans: options.humans,
      includeSitemap: options.sitemap,
      includeAiTxt: options.aiTxt !== false,
      includeSecurityTxt: options.securityTxt !== false,
      includeManifest: options.manifest !== false,
      includeAds: options.ads !== false,
      siteName: analysis.metadata.title || new URL(url).hostname,
      agents: options.agents || {}
    },
    analysis
  );
}

export async function generateFiles(
  url: string,
  analysis: AnalysisResult,
  options: CliOptions
): Promise<{ zip: JSZip; filename: string; artifacts: GeneratedArtifact[] }> {
  const zip = new JSZip();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const domain = new URL(url).hostname.replace(/[^a-zA-Z0-9]/g, '-');
  const filename = `geoforge-${domain}-${timestamp}.zip`;

  const artifacts = buildArtifacts(url, analysis, options);
  for (const artifact of artifacts) {
    zip.file(artifact.name, artifact.content);
    console.log(`✅ ${artifact.name} generated`);
  }

  return { zip, filename, artifacts };
}
