#!/usr/bin/env node
import { Command } from 'commander';
import { WebsiteAnalyzer } from './cliWebsiteAnalyzer.js';
import fs from 'fs/promises';
import path from 'path';
import { formatUrl } from './utils/urlUtils.js';
import { createAnalysisConfig, getCompressionLevel, type CliOptions } from './utils/configUtils.js';
import { generateFiles } from './generators/fileGenerator.js';

const program = new Command();

program
  .name('geoforge-cli')
  .description('Analyzes a website and generates AI-ready optimization files.')
  .version('0.0.1');

program
  .argument('<url>', 'The URL of the website to analyze.')
  .option('--allow-training', 'Allow AI training on content', false)
  .option('--no-humans', 'Do not include humans.txt')
  .option('--no-sitemap', 'Do not generate an enhanced sitemap')
  .option('--no-ai-txt', 'Do not generate ai.txt')
  .option('--no-security-txt', 'Do not generate security.txt')
  .option('--no-manifest', 'Do not generate manifest.json')
  .option('--no-ads', 'Do not generate ads.txt and app-ads.txt')

  .option('--compression <level>', 'Set compression level (none, standard, maximum)', 'standard')
  .option('--output <dir>', 'Output directory (default: geoforge-output)', 'geoforge-output')
  .action(async (url, options) => {
    console.log('🚀 Starting GEOforge CLI...');

    // --- URL Formatting ---
    const formattedUrl = formatUrl(url);
    if (!formattedUrl) {
      console.error('❌ Invalid URL provided.');
      process.exit(1);
    }
    console.log(`✅ Analyzing URL: ${formattedUrl}`);

    // --- Website Analysis ---
    try {
      console.log('🔍 Starting website analysis...');
      
      // Create analysis configuration
      const analysisConfig = createAnalysisConfig(formattedUrl, options as CliOptions);

      // Create analyzer and run analysis
      const analyzer = new WebsiteAnalyzer(analysisConfig);
      const analysisResult = await analyzer.analyze((progress, status) => {
        console.log(`📊 ${status} (${progress}%)`);
      });

      if (analysisResult.status === 'error') {
        console.error('❌ Website analysis failed:', analysisResult.errors);
        process.exit(1);
      }

      console.log('✅ Website analysis completed successfully!');

      // Update site name with actual title
      const siteName = analysisResult.metadata.title || new URL(formattedUrl).hostname;
      analysisConfig.siteName = siteName;

      // --- File Generation ---
      console.log('📦 Generating comprehensive AI optimization files...');
      
      const { zip, filename } = await generateFiles(formattedUrl, analysisResult, options as CliOptions);

      // Set compression level
      const compressionLevel = getCompressionLevel(options.compression);

      console.log(`🗜️ Compressing files with level ${compressionLevel}...`);
      const zipBuffer = await zip.generateAsync({ 
        type: 'nodebuffer', 
        compression: 'DEFLATE',
        compressionOptions: { level: compressionLevel }
      });

      // Save ZIP file
      const outputDir = path.resolve(process.cwd(), options.output || 'geoforge-output');
      await fs.mkdir(outputDir, { recursive: true });
      
      const zipPath = path.join(outputDir, filename);
      await fs.writeFile(zipPath, zipBuffer);

      console.log('🎉 ZIP file generated successfully!');
      console.log(`📁 Output directory: ${outputDir}`);
      console.log(`📦 ZIP file: ${filename}`);
      console.log(`📊 File size: ${(zipBuffer.length / 1024).toFixed(2)} KB`);

    } catch (error) {
      console.error('💥 An error occurred:');
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
      process.exit(1);
    }
  });

program.parse(process.argv);
