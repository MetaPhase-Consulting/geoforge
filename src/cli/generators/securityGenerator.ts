import type { AnalysisResult } from '../cliWebsiteAnalyzer.js';

export function generateSecurityTxt(url: string, analysis: AnalysisResult): string {
  const domain = new URL(url).hostname;
  
  return `Expires: 2026-08-04T00:00:00.000Z
Preferred-Languages: en
Canonical: https://${domain}/.well-known/security.txt`;
} 