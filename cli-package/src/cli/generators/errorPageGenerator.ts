import type { AnalysisResult } from '../cliWebsiteAnalyzer.js';

export function generateErrorPage(url: string, errorCode: number, analysis: AnalysisResult): string {
  const domain = new URL(url).hostname;
  const siteTitle = analysis.metadata.title || domain;
  const title = errorCode === 404 ? 'Page Not Found' : 'Server Error';
  const message = errorCode === 404 
    ? 'The page you are looking for could not be found.'
    : 'Something went wrong on our end. Please try again later.';
  
  return `<!DOCTYPE html>
<html lang="${analysis.metadata.language || 'en'}">
<head>
    <meta charset="${analysis.metadata.charset || 'UTF-8'}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${errorCode} - ${title} | ${siteTitle}</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .error { font-size: 72px; color: #e74c3c; margin-bottom: 20px; }
        .message { font-size: 18px; color: #666; margin-bottom: 30px; }
        .home { color: #3498db; text-decoration: none; }
    </style>
</head>
<body>
    <div class="error">${errorCode}</div>
    <div class="message">${message}</div>
    <a href="/" class="home">Return to Homepage</a>
</body>
</html>`;
} 