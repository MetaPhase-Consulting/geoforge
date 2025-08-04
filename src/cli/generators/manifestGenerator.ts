import type { AnalysisResult } from '../cliWebsiteAnalyzer.js';

export function generateManifestJson(url: string, analysis: AnalysisResult): string {
  const domain = new URL(url).hostname;
  const siteTitle = analysis.metadata.title || domain;
  
  return JSON.stringify({
    "name": `${siteTitle} - AI Optimized Website`,
    "short_name": domain,
    "description": analysis.metadata.description || "AI-optimized website with comprehensive crawler directives",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#000000",
    "icons": [
      {
        "src": "/favicon-16x16.png",
        "sizes": "16x16",
        "type": "image/png"
      },
      {
        "src": "/favicon-32x32.png",
        "sizes": "32x32",
        "type": "image/png"
      },
      {
        "src": "/android-chrome-192x192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/android-chrome-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ]
  }, null, 2);
} 