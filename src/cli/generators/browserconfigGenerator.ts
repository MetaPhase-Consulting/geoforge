import type { AnalysisResult } from '../cliWebsiteAnalyzer.js';

export function generateBrowserconfigXml(url: string, analysis: AnalysisResult): string {
  const domain = new URL(url).hostname;
  
  return `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/mstile-150x150.png"/>
            <TileColor>#000000</TileColor>
        </tile>
    </msapplication>
</browserconfig>`;
} 