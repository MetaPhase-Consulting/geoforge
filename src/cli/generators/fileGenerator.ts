import JSZip from 'jszip';
import type { AnalysisResult } from '../cliWebsiteAnalyzer.js';
import type { CliOptions } from '../utils/configUtils.js';
import { generateRobotsTxt } from './robotsGenerator.js';
import { generateSitemapXml } from './sitemapGenerator.js';
import { generateHumansTxt } from './humansGenerator.js';
import { generateAiTxt } from './aiTxtGenerator.js';
import { generateSecurityTxt } from './securityGenerator.js';
import { generateManifestJson } from './manifestGenerator.js';
import { generateAdsTxt, generateAppAdsTxt } from './adsGenerator.js';
import { generateBrowserconfigXml } from './browserconfigGenerator.js';
import { generateAnalysisReport } from './documentationGenerator.js';

export async function generateFiles(
  url: string, 
  analysis: AnalysisResult, 
  options: CliOptions
): Promise<{ zip: JSZip; filename: string }> {
  const zip = new JSZip();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const domain = new URL(url).hostname.replace(/[^a-zA-Z0-9]/g, '-');
  const filename = `geoforge-${domain}-${timestamp}.zip`;

  // Generate robots.txt
  const robotsContent = generateRobotsTxt(url, options.allowTraining, analysis);
  zip.file('robots.txt', robotsContent);
  console.log('✅ robots.txt generated');

  // Generate sitemap.xml
  if (options.sitemap) {
    const sitemapContent = generateSitemapXml(url, analysis);
    zip.file('sitemap.xml', sitemapContent);
    console.log('✅ sitemap.xml generated');
  }

  // Generate humans.txt
  if (options.humans) {
    const humansContent = generateHumansTxt(url, analysis);
    zip.file('humans.txt', humansContent);
    console.log('✅ humans.txt generated');
  }

  // Generate .well-known/ai.txt
  if (options.aiTxt !== false) {
    const aiTxtContent = generateAiTxt(url, analysis);
    zip.file('.well-known/ai.txt', aiTxtContent);
    console.log('✅ .well-known/ai.txt generated');
  }

  // Generate .well-known/security.txt
  if (options.securityTxt !== false) {
    const securityTxtContent = generateSecurityTxt(url, analysis);
    zip.file('.well-known/security.txt', securityTxtContent);
    console.log('✅ .well-known/security.txt generated');
  }

  // Generate manifest.json
  if (options.manifest !== false) {
    const manifestContent = generateManifestJson(url, analysis);
    zip.file('manifest.json', manifestContent);
    console.log('✅ manifest.json generated');
  }

  // Generate ads.txt
  if (options.ads !== false) {
    const adsTxtContent = generateAdsTxt(url, analysis);
    zip.file('ads.txt', adsTxtContent);
    console.log('✅ ads.txt generated');
  }

  // Generate app-ads.txt
  if (options.ads !== false) {
    const appAdsTxtContent = generateAppAdsTxt(url, analysis);
    zip.file('app-ads.txt', appAdsTxtContent);
    console.log('✅ app-ads.txt generated');
  }

  // Generate browserconfig.xml
  if (options.manifest !== false) {
    const browserconfigContent = generateBrowserconfigXml(url, analysis);
    zip.file('browserconfig.xml', browserconfigContent);
    console.log('✅ browserconfig.xml generated');
  }

  // Generate geoforge.json
  const analysisContent = generateAnalysisReport(url, analysis);
  zip.file('geoforge.json', analysisContent);
  console.log('✅ geoforge.json generated');

  return { zip, filename };
} 