import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generateArtifacts } from '../shared/generationCore';
import type { AnalysisConfig, AnalysisResult, GeneratedArtifact } from '../shared/types';

export class ZipGenerator {
  private config: AnalysisConfig;
  private analysisResult: AnalysisResult;

  constructor(config: AnalysisConfig, analysisResult: AnalysisResult) {
    this.config = config;
    this.analysisResult = analysisResult;
  }

  getArtifacts(): GeneratedArtifact[] {
    return generateArtifacts(
      {
        url: this.config.url,
        profile: this.config.profile,
        allowTraining: this.config.allowTraining,
        includeHumans: this.config.includeHumans,
        includeSitemap: this.config.includeSitemap,
        includeAiTxt: true,
        includeSecurityTxt: true,
        includeManifest: true,
        includeAds: true,
        siteName: this.config.siteName,
        agents: this.config.agents
      },
      this.analysisResult
    );
  }

  async generateAndDownload(onProgress?: (progress: number, status: string) => void): Promise<void> {
    const artifacts = this.getArtifacts();
    const zip = new JSZip();

    onProgress?.(20, 'Preparing files...');
    for (const artifact of artifacts) {
      zip.file(artifact.name, artifact.content);
    }

    onProgress?.(70, 'Compressing files...');
    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: this.getCompressionLevel() }
    });

    onProgress?.(90, 'Starting download...');
    const filename = `${this.config.siteName || 'geoforge'}-geo-files-${new Date().toISOString().split('T')[0]}.zip`;
    saveAs(blob, filename);
    onProgress?.(100, 'Done');
  }

  async downloadSingleFile(fileName: string): Promise<void> {
    const artifact = this.getArtifacts().find((item) => item.name === fileName);
    if (!artifact) {
      throw new Error(`File not found: ${fileName}`);
    }

    const blob = new Blob([artifact.content], { type: this.toMimeType(artifact.type) });
    const cleanName = fileName.includes('/') ? fileName.split('/').pop() || fileName : fileName;
    saveAs(blob, cleanName);
  }

  async downloadSelectedFiles(fileNames: string[]): Promise<void> {
    const artifacts = this.getArtifacts().filter((item) => fileNames.includes(item.name));
    if (artifacts.length === 0) {
      throw new Error('No files selected for download.');
    }

    const zip = new JSZip();
    for (const artifact of artifacts) {
      zip.file(artifact.name, artifact.content);
    }

    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: this.getCompressionLevel() }
    });

    saveAs(blob, `geoforge-selected-${new Date().toISOString().split('T')[0]}.zip`);
  }

  private getCompressionLevel(): number {
    switch (this.config.compression) {
      case 'none':
        return 0;
      case 'maximum':
        return 9;
      case 'standard':
      default:
        return 6;
    }
  }

  private toMimeType(type: GeneratedArtifact['type']): string {
    if (type === 'json') return 'application/json';
    if (type === 'xml') return 'application/xml';
    return 'text/plain';
  }
}
