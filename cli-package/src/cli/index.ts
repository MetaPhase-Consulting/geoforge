#!/usr/bin/env node
import { Command } from 'commander';
import { WebsiteAnalyzer } from './cliWebsiteAnalyzer.js';
import fs from 'fs/promises';
import path from 'path';
import { formatUrl } from './utils/urlUtils.js';
import { createAnalysisConfig, getCompressionLevel, type CliOptions } from './utils/configUtils.js';
import { generateFiles } from './generators/fileGenerator.js';
import type { AnalysisResult } from '../shared/types.js';
import { Logger } from './utils/logger.js';

const program = new Command();

program.name('geoforge-cli').description('Analyzes a website and generates AI-ready optimization files.').version('0.0.1');

program
  .argument('<url>', 'The URL of the website to analyze.')
  .option('--allow-training', 'Allow AI training on content', false)
  .option('--no-humans', 'Do not include humans.txt')
  .option('--no-sitemap', 'Do not generate an enhanced sitemap')
  .option('--no-ai-txt', 'Do not generate ai.txt')
  .option('--no-security-txt', 'Do not generate security.txt')
  .option('--no-manifest', 'Do not generate manifest.json')
  .option('--no-ads', 'Do not generate ads.txt and app-ads.txt')
  .option('--profile <profile>', 'Generation profile: strict-privacy, balanced, open-discovery', 'balanced')
  .option('--json-summary', 'Output machine-readable run summary JSON to stdout', false)
  .option('--verbose', 'Enable verbose logging', false)
  .option('--compression <level>', 'Set compression level (none, standard, maximum)', 'standard')
  .option('--output <dir>', 'Output directory (default: geoforge-output)', 'geoforge-output')
  .action(async (url: string, options: CliOptions) => {
    const logger = new Logger(Boolean(options.verbose));
    logger.info('🚀 Starting GEOforge CLI...');

    const formattedUrl = formatUrl(url);
    if (!formattedUrl) {
      logger.error('❌ Invalid URL provided.');
      process.exit(1);
    }
    logger.info(`✅ Analyzing URL: ${formattedUrl}`);

    try {
      const analysisConfig = createAnalysisConfig(formattedUrl, options as CliOptions);
      let analysisResult: AnalysisResult;

      if (process.env.GEOFORGE_MOCK_ANALYSIS === '1') {
        const fixturePath = path.resolve(process.cwd(), 'tests/fixtures/analysisResult.json');
        const fixture = await fs.readFile(fixturePath, 'utf-8');
        analysisResult = JSON.parse(fixture) as AnalysisResult;
      } else {
        logger.info('🔍 Starting website analysis...');
        const analyzer = new WebsiteAnalyzer(analysisConfig);
        analysisResult = await analyzer.analyze((progress, status) => {
          logger.debug(`📊 ${status} (${progress}%)`);
        });
      }

      if (analysisResult.status === 'error') {
        logger.error(`❌ Website analysis failed: ${analysisResult.errors.join('; ')}`);
        process.exit(1);
      }

      logger.info('✅ Website analysis completed successfully!');

      const { zip, filename, artifacts } = await generateFiles(formattedUrl, analysisResult, {
        ...options,
        profile: analysisConfig.profile,
        allowTraining: analysisConfig.allowTraining,
        agents: analysisConfig.agents
      });

      const compressionLevel = getCompressionLevel(options.compression);
      logger.info(`🗜️ Compressing files with level ${compressionLevel}...`);
      const zipBuffer = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: { level: compressionLevel }
      });

      const outputDir = path.resolve(process.cwd(), options.output || 'geoforge-output');
      await fs.mkdir(outputDir, { recursive: true });
      const zipPath = path.join(outputDir, filename);
      await fs.writeFile(zipPath, zipBuffer);

      logger.info('🎉 ZIP file generated successfully!');
      logger.info(`📁 Output directory: ${outputDir}`);
      logger.info(`📦 ZIP file: ${filename}`);
      logger.info(`📊 File size: ${(zipBuffer.length / 1024).toFixed(2)} KB`);

      if (options.jsonSummary) {
        const summary = {
          url: formattedUrl,
          profile: analysisConfig.profile,
          artifactCount: artifacts.length,
          artifacts: artifacts.map((item) => item.name),
          outputPath: zipPath,
          sizeBytes: zipBuffer.length,
          status: 'success'
        };
        console.log(JSON.stringify(summary));
      }
    } catch (error) {
      logger.error('💥 An error occurred:');
      logger.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program.parse(process.argv);
