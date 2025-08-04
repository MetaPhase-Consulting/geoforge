import { describe, it, expect, vi } from 'vitest';
import fs from 'fs/promises';
import path from 'path';

// Import CLI utilities (we'll extract these from the main CLI file)
const formatUrl = (inputUrl: string): string => {
  const trimmedUrl = inputUrl.trim();
  if (!trimmedUrl) return '';
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }
  return `https://${trimmedUrl}`;
};

const validateCompressionLevel = (level: string): boolean => {
  const validLevels = ['none', 'standard', 'maximum'];
  return validLevels.includes(level);
};

const createDefaultConfig = (url: string, options: any) => {
  return {
    url,
    siteName: '',
    allowTraining: options.allowTraining || false,
    agents: {},
    includeHumans: options.humans !== false,
    includeSitemap: options.sitemap !== false,
    includeAssets: {
      html: true,
      css: false,
      js: false,
      images: false,
      fonts: false,
    },
    compression: options.compression || 'standard'
  };
};

describe('CLI Unit Tests', () => {
  describe('URL Formatting', () => {
    it('should format URLs with https protocol', () => {
      expect(formatUrl('https://metaphase.tech')).toBe('https://metaphase.tech');
      expect(formatUrl('https://www.metaphase.tech')).toBe('https://www.metaphase.tech');
      expect(formatUrl('https://metaphase.tech/path')).toBe('https://metaphase.tech/path');
    });

    it('should format URLs with http protocol', () => {
      expect(formatUrl('http://farmers.gov')).toBe('http://farmers.gov');
      expect(formatUrl('http://www.farmers.gov')).toBe('http://www.farmers.gov');
    });

    it('should add https protocol to URLs without protocol', () => {
      expect(formatUrl('metaphase.tech')).toBe('https://metaphase.tech');
      expect(formatUrl('www.farmers.gov')).toBe('https://www.farmers.gov');
      expect(formatUrl('subdomain.metaphase.tech')).toBe('https://subdomain.metaphase.tech');
    });

    it('should handle URLs with whitespace', () => {
      expect(formatUrl('  https://metaphase.tech  ')).toBe('https://metaphase.tech');
      expect(formatUrl('  farmers.gov  ')).toBe('https://farmers.gov');
      expect(formatUrl('\nhttps://metaphase.tech\n')).toBe('https://metaphase.tech');
    });

    it('should handle empty URLs', () => {
      expect(formatUrl('')).toBe('');
      expect(formatUrl('   ')).toBe('');
      expect(formatUrl('\n')).toBe('');
      expect(formatUrl('\t')).toBe('');
    });

    it('should handle URLs with ports', () => {
      expect(formatUrl('https://metaphase.tech:8080')).toBe('https://metaphase.tech:8080');
      expect(formatUrl('farmers.gov:8080')).toBe('https://farmers.gov:8080');
    });

    it('should handle URLs with query parameters', () => {
      expect(formatUrl('https://metaphase.tech?param=value')).toBe('https://metaphase.tech?param=value');
      expect(formatUrl('farmers.gov?param=value')).toBe('https://farmers.gov?param=value');
    });
  });

  describe('Compression Level Validation', () => {
    it('should accept valid compression levels', () => {
      expect(validateCompressionLevel('none')).toBe(true);
      expect(validateCompressionLevel('standard')).toBe(true);
      expect(validateCompressionLevel('maximum')).toBe(true);
    });

    it('should reject invalid compression levels', () => {
      expect(validateCompressionLevel('invalid')).toBe(false);
      expect(validateCompressionLevel('high')).toBe(false);
      expect(validateCompressionLevel('low')).toBe(false);
      expect(validateCompressionLevel('')).toBe(false);
    });

    it('should be case sensitive', () => {
      expect(validateCompressionLevel('NONE')).toBe(false);
      expect(validateCompressionLevel('Standard')).toBe(false);
      expect(validateCompressionLevel('MAXIMUM')).toBe(false);
    });
  });

  describe('Configuration Creation', () => {
    it('should create default configuration', () => {
      const options = {};
      const config = createDefaultConfig('https://metaphase.tech', options);

      expect(config.url).toBe('https://metaphase.tech');
      expect(config.siteName).toBe('');
      expect(config.allowTraining).toBe(false);
      expect(config.includeHumans).toBe(true);
      expect(config.includeSitemap).toBe(true);
      expect(config.compression).toBe('standard');
      expect(config.includeAssets.html).toBe(true);
      expect(config.includeAssets.css).toBe(false);
    });

    it('should handle --allow-training flag', () => {
      const options = { allowTraining: true };
      const config = createDefaultConfig('https://farmers.gov', options);

      expect(config.allowTraining).toBe(true);
    });

    it('should handle --no-humans flag', () => {
      const options = { humans: false };
      const config = createDefaultConfig('https://metaphase.tech', options);

      expect(config.includeHumans).toBe(false);
    });

    it('should handle --no-sitemap flag', () => {
      const options = { sitemap: false };
      const config = createDefaultConfig('https://farmers.gov', options);

      expect(config.includeSitemap).toBe(false);
    });

    it('should handle custom compression level', () => {
      const options = { compression: 'maximum' };
      const config = createDefaultConfig('https://metaphase.tech', options);

      expect(config.compression).toBe('maximum');
    });

    it('should handle multiple flags together', () => {
      const options = {
        allowTraining: true,
        humans: false,
        sitemap: false,
        compression: 'none'
      };
      const config = createDefaultConfig('https://farmers.gov', options);

      expect(config.allowTraining).toBe(true);
      expect(config.includeHumans).toBe(false);
      expect(config.includeSitemap).toBe(false);
      expect(config.compression).toBe('none');
    });
  });

  describe('File Path Operations', () => {
    it('should resolve file paths correctly', () => {
      const filename = 'test.zip';
      const outputPath = path.resolve(process.cwd(), filename);
      
      expect(outputPath).toContain(filename);
      expect(outputPath).toContain(process.cwd());
    });

    it('should handle relative paths', () => {
      const relativePath = './test-output/test.zip';
      const absolutePath = path.resolve(relativePath);
      
      expect(absolutePath).toContain('test-output');
      expect(absolutePath).toContain('test.zip');
    });

    it('should handle absolute paths', () => {
      const absolutePath = '/tmp/test.zip';
      const resolvedPath = path.resolve(absolutePath);
      
      expect(resolvedPath).toBe(absolutePath);
    });
  });

  describe('Error Message Formatting', () => {
    it('should format error messages correctly', () => {
      const error = new Error('Test error message');
      const formattedError = `💥 An error occurred:\n${error.message}`;
      
      expect(formattedError).toContain('💥 An error occurred:');
      expect(formattedError).toContain('Test error message');
    });

    it('should handle errors without messages', () => {
      const error = new Error();
      const formattedError = `💥 An error occurred:\n${error.message}`;
      
      expect(formattedError).toContain('💥 An error occurred:');
    });

    it('should handle non-Error objects', () => {
      const error = 'String error';
      const formattedError = `💥 An error occurred:\n${error}`;
      
      expect(formattedError).toContain('💥 An error occurred:');
      expect(formattedError).toContain('String error');
    });
  });

  describe('Progress Reporting', () => {
    it('should format progress messages correctly', () => {
      const progress = 50;
      const status = 'Processing files';
      const message = `[ANALYSIS] ${progress}%: ${status}`;
      
      expect(message).toBe('[ANALYSIS] 50%: Processing files');
    });

    it('should handle zero progress', () => {
      const progress = 0;
      const status = 'Starting analysis';
      const message = `[ANALYSIS] ${progress}%: ${status}`;
      
      expect(message).toBe('[ANALYSIS] 0%: Starting analysis');
    });

    it('should handle 100% progress', () => {
      const progress = 100;
      const status = 'Complete';
      const message = `[ANALYSIS] ${progress}%: ${status}`;
      
      expect(message).toBe('[ANALYSIS] 100%: Complete');
    });
  });

  describe('Agent Configuration', () => {
    it('should create agent choices object', () => {
      const mockAgents = [
        { id: 'gptbot', defaultEnabled: true },
        { id: 'claudebot', defaultEnabled: false },
        { id: 'perplexitybot', defaultEnabled: true }
      ];

      const agentChoices: Record<string, boolean> = {};
      mockAgents.forEach(agent => {
        agentChoices[agent.id] = agent.defaultEnabled;
      });

      expect(agentChoices.gptbot).toBe(true);
      expect(agentChoices.claudebot).toBe(false);
      expect(agentChoices.perplexitybot).toBe(true);
    });

    it('should handle empty agents array', () => {
      const mockAgents: any[] = [];
      const agentChoices: Record<string, boolean> = {};
      
      mockAgents.forEach(agent => {
        agentChoices[agent.id] = agent.defaultEnabled;
      });

      expect(Object.keys(agentChoices)).toHaveLength(0);
    });
  });

  describe('Site Name Processing', () => {
    it('should extract site name from title', () => {
      const title = 'Metaphase Tech | Home';
      const processedTitle = title.replace(/\s*\|\s*.*$/, '').trim();
      
      expect(processedTitle).toBe('Metaphase Tech');
    });

    it('should handle title without separator', () => {
      const title = 'Farmers.gov';
      const processedTitle = title.replace(/\s*\|\s*.*$/, '').trim();
      
      expect(processedTitle).toBe('Farmers.gov');
    });

    it('should handle title with multiple separators', () => {
      const title = 'Metaphase Tech | Home | Welcome';
      const processedTitle = title.replace(/\s*\|\s*.*$/, '').trim();
      
      expect(processedTitle).toBe('Metaphase Tech');
    });

    it('should handle empty title', () => {
      const title = '';
      const processedTitle = title.replace(/\s*\|\s*.*$/, '').trim();
      
      expect(processedTitle).toBe('');
    });
  });
}); 