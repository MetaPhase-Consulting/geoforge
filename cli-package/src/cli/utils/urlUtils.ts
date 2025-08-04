export function formatUrl(inputUrl: string): string {
  const trimmedUrl = inputUrl.trim();
  if (!trimmedUrl) return '';
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }
  return `https://${trimmedUrl}`;
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function extractDomain(url: string): string {
  return new URL(url).hostname;
}

export function generateZipFilename(url: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const domain = extractDomain(url).replace(/[^a-zA-Z0-9]/g, '-');
  return `geoforge-${domain}-${timestamp}.zip`;
} 