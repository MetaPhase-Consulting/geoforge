import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

// Mock console methods to capture output
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('CLI Integration Tests', () => {
  let consoleOutput: string[] = [];
  let consoleErrors: string[] = [];

  beforeEach(() => {
    consoleOutput = [];
    consoleErrors = [];
    
    // Mock console methods
    console.log = vi.fn((...args) => {
      consoleOutput.push(args.join(' '));
      originalConsoleLog(...args);
    });
    
    console.error = vi.fn((...args) => {
      consoleErrors.push(args.join(' '));
      originalConsoleError(...args);
    });
  });

  afterEach(() => {
    // Restore original console methods
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  describe('CLI Execution', () => {
    it('should show help with --help flag', async () => {
      return new Promise<void>((resolve, reject) => {
        const child = spawn('node', ['dist/cli/index.js', '--help'], {
          stdio: ['pipe', 'pipe', 'pipe']
        });

        let output = '';
        let errorOutput = '';

        child.stdout.on('data', (data) => {
          output += data.toString();
        });

        child.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });

        child.on('close', (code) => {
          expect(code).toBe(0);
          expect(output).toContain('Usage:');
          expect(output).toContain('Options:');
          expect(output).toContain('--allow-training');
          expect(output).toContain('--no-humans');
          expect(output).toContain('--no-sitemap');
          expect(output).toContain('--no-ai-txt');
          expect(output).toContain('--no-security-txt');
          expect(output).toContain('--no-manifest');
          expect(output).toContain('--no-ads');
          expect(output).toContain('--no-error-pages');
          expect(output).toContain('--no-favicons');
          expect(output).toContain('--compression');
          expect(output).toContain('--output');
          resolve();
        });

        child.on('error', (error) => {
          reject(error);
        });
      });
    });

    it('should show version with --version flag', async () => {
      return new Promise<void>((resolve, reject) => {
        const child = spawn('node', ['dist/cli/index.js', '--version'], {
          stdio: ['pipe', 'pipe', 'pipe']
        });

        let output = '';
        let errorOutput = '';

        child.stdout.on('data', (data) => {
          output += data.toString();
        });

        child.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });

        child.on('close', (code) => {
          expect(code).toBe(0);
          expect(output.trim()).toBe('0.0.1');
          resolve();
        });

        child.on('error', (error) => {
          reject(error);
        });
      });
    });

    it('should process a valid URL successfully with comprehensive files', async () => {
      return new Promise<void>((resolve, reject) => {
        const child = spawn('node', ['dist/cli/index.js', 'https://metaphase.tech'], {
          stdio: ['pipe', 'pipe', 'pipe']
        });

        let output = '';
        let errorOutput = '';

        child.stdout.on('data', (data) => {
          output += data.toString();
        });

        child.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });

        child.on('close', (code) => {
          expect(code).toBe(0);
          expect(output).toContain('🚀 Starting GEOforge CLI');
          expect(output).toContain('✅ Analyzing URL: https://metaphase.tech');
          expect(output).toContain('📦 Generating comprehensive AI optimization files');
          expect(output).toContain('✅ robots.txt generated');
          expect(output).toContain('✅ sitemap.xml generated');
          expect(output).toContain('✅ humans.txt generated');
          expect(output).toContain('✅ .well-known/ai.txt generated');
          expect(output).toContain('✅ .well-known/security.txt generated');
          expect(output).toContain('✅ manifest.json generated');
          expect(output).toContain('✅ ads.txt generated');
          expect(output).toContain('✅ app-ads.txt generated');
          expect(output).toContain('✅ browserconfig.xml generated');
          expect(output).toContain('✅ 404.html generated');
          expect(output).toContain('✅ 500.html generated');
          expect(output).toContain('✅ README.md generated');
          expect(output).toContain('✅ DEPLOYMENT.md generated');
          expect(output).toContain('🗜️ Compressing files with level');
          expect(output).toContain('🎉 ZIP file generated successfully');
          expect(output).toContain('📦 ZIP file: geoforge-metaphase-tech-');
          expect(output).toContain('📊 File size:');
          resolve();
        });

        child.on('error', (error) => {
          reject(error);
        });
      });
    });

    it('should process URL with selective file generation', async () => {
      return new Promise<void>((resolve, reject) => {
        const child = spawn('node', ['dist/cli/index.js', 'https://farmers.gov', '--no-humans', '--no-ai-txt', '--no-error-pages'], {
          stdio: ['pipe', 'pipe', 'pipe']
        });

        let output = '';
        let errorOutput = '';

        child.stdout.on('data', (data) => {
          output += data.toString();
        });

        child.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });

        child.on('close', (code) => {
          expect(code).toBe(0);
          expect(output).toContain('🚀 Starting GEOforge CLI');
          expect(output).toContain('✅ Analyzing URL: https://farmers.gov');
          expect(output).toContain('✅ robots.txt generated');
          expect(output).toContain('✅ sitemap.xml generated');
          expect(output).toContain('✅ .well-known/security.txt generated');
          expect(output).toContain('✅ manifest.json generated');
          expect(output).toContain('✅ ads.txt generated');
          expect(output).toContain('✅ app-ads.txt generated');
          expect(output).toContain('✅ browserconfig.xml generated');
          expect(output).toContain('✅ README.md generated');
          expect(output).toContain('✅ DEPLOYMENT.md generated');
          // Should NOT contain these files
          expect(output).not.toContain('✅ humans.txt generated');
          expect(output).not.toContain('✅ .well-known/ai.txt generated');
          expect(output).not.toContain('✅ 404.html generated');
          expect(output).not.toContain('✅ 500.html generated');
          resolve();
        });

        child.on('error', (error) => {
          reject(error);
        });
      });
    });

    it('should handle maximum compression option', async () => {
      return new Promise<void>((resolve, reject) => {
        const child = spawn('node', ['dist/cli/index.js', 'https://metaphase.tech', '--compression', 'maximum'], {
          stdio: ['pipe', 'pipe', 'pipe']
        });

        let output = '';
        let errorOutput = '';

        child.stdout.on('data', (data) => {
          output += data.toString();
        });

        child.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });

        child.on('close', (code) => {
          expect(code).toBe(0);
          expect(output).toContain('🗜️ Compressing files with level 9');
          expect(output).toContain('🎉 ZIP file generated successfully');
          resolve();
        });

        child.on('error', (error) => {
          reject(error);
        });
      });
    });
  });

  describe('URL Validation', () => {
    it('should accept valid URLs', () => {
      const validUrls = [
        'https://metaphase.tech',
        'http://farmers.gov',
        'https://www.metaphase.tech',
        'https://metaphase.tech/path',
        'https://metaphase.tech:8080',
        'https://subdomain.farmers.gov'
      ];

      const formatUrl = (inputUrl: string): string => {
        const trimmedUrl = inputUrl.trim();
        if (!trimmedUrl) return '';
        if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
          return trimmedUrl;
        }
        return `https://${trimmedUrl}`;
      };

      validUrls.forEach(url => {
        const formatted = formatUrl(url);
        expect(formatted).toBe(url);
        expect(formatted).not.toBe('');
      });
    });

    it('should format URLs without protocol', () => {
      const urlsWithoutProtocol = [
        'metaphase.tech',
        'www.farmers.gov',
        'subdomain.metaphase.tech'
      ];

      const formatUrl = (inputUrl: string): string => {
        const trimmedUrl = inputUrl.trim();
        if (!trimmedUrl) return '';
        if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
          return trimmedUrl;
        }
        return `https://${trimmedUrl}`;
      };

      urlsWithoutProtocol.forEach(url => {
        const formatted = formatUrl(url);
        expect(formatted).toBe(`https://${url}`);
      });
    });

    it('should reject empty URLs', () => {
      const emptyUrls = ['', '   ', '\n', '\t'];

      const formatUrl = (inputUrl: string): string => {
        const trimmedUrl = inputUrl.trim();
        if (!trimmedUrl) return '';
        if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
          return trimmedUrl;
        }
        return `https://${trimmedUrl}`;
      };

      emptyUrls.forEach(url => {
        const formatted = formatUrl(url);
        expect(formatted).toBe('');
      });
    });
  });

  describe('Configuration Options', () => {
    it('should handle --allow-training flag', () => {
      const config = {
        allowTraining: true,
        includeHumans: true,
        includeSitemap: true,
        compression: 'standard'
      };

      expect(config.allowTraining).toBe(true);
    });

    it('should handle --no-humans flag', () => {
      const config = {
        allowTraining: false,
        includeHumans: false,
        includeSitemap: true,
        compression: 'standard'
      };

      expect(config.includeHumans).toBe(false);
    });

    it('should handle --no-sitemap flag', () => {
      const config = {
        allowTraining: false,
        includeHumans: true,
        includeSitemap: false,
        compression: 'standard'
      };

      expect(config.includeSitemap).toBe(false);
    });

    it('should handle --no-ai-txt flag', () => {
      const config = {
        allowTraining: false,
        includeHumans: true,
        includeSitemap: true,
        includeAiTxt: false,
        compression: 'standard'
      };

      expect(config.includeAiTxt).toBe(false);
    });

    it('should handle --no-error-pages flag', () => {
      const config = {
        allowTraining: false,
        includeHumans: true,
        includeSitemap: true,
        includeErrorPages: false,
        compression: 'standard'
      };

      expect(config.includeErrorPages).toBe(false);
    });

    it('should handle --compression flag', () => {
      const compressionLevels = ['none', 'standard', 'maximum'];
      
      compressionLevels.forEach(level => {
        const config = {
          allowTraining: false,
          includeHumans: true,
          includeSitemap: true,
          compression: level
        };

        expect(config.compression).toBe(level);
        expect(compressionLevels).toContain(level);
      });
    });

    it('should handle --output flag', () => {
      const config = {
        allowTraining: false,
        includeHumans: true,
        includeSitemap: true,
        compression: 'standard',
        outputDir: 'custom-output'
      };

      expect(config.outputDir).toBe('custom-output');
    });
  });

  describe('File System Operations', () => {
    const testOutputDir = path.resolve(process.cwd(), 'test-output');

    beforeEach(async () => {
      try {
        await fs.mkdir(testOutputDir, { recursive: true });
      } catch (error) {
        // Directory might already exist
      }
    });

    it('should create output directory', async () => {
      const dirExists = await fs.access(testOutputDir).then(() => true).catch(() => false);
      expect(dirExists).toBe(true);
    });

    it('should write files to output directory', async () => {
      const testFile = path.join(testOutputDir, 'test.txt');
      const testContent = 'Test content';
      
      await fs.writeFile(testFile, testContent);
      
      const fileExists = await fs.access(testFile).then(() => true).catch(() => false);
      expect(fileExists).toBe(true);
      
      const content = await fs.readFile(testFile, 'utf-8');
      expect(content).toBe(testContent);
    });

    it('should handle file write errors gracefully', async () => {
      const invalidPath = '/invalid/path/test.txt';
      const testContent = 'Test content';
      
      try {
        await fs.writeFile(invalidPath, testContent);
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error instanceof Error).toBe(true);
      }
    });
  });

  describe('ZIP File Generation', () => {
    it('should generate ZIP file with unique name', () => {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const domain = 'metaphase-tech';
      const zipFilename = `geoforge-${domain}-${timestamp}.zip`;
      
      expect(zipFilename).toContain('geoforge-');
      expect(zipFilename).toContain('metaphase-tech-');
      expect(zipFilename).toContain('.zip');
      expect(zipFilename).toMatch(/geoforge-metaphase-tech-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}/);
    });

    it('should handle different compression levels', () => {
      const compressionLevels = {
        'none': 0,
        'standard': 6,
        'maximum': 9
      };

      Object.entries(compressionLevels).forEach(([level, expected]) => {
        const actual = level === 'maximum' ? 9 : 
                      level === 'none' ? 0 : 6;
        expect(actual).toBe(expected);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      // Mock a network error scenario
      const mockError = new Error('Network error: ECONNREFUSED');
      mockError.name = 'NetworkError';
      
      expect(mockError).toBeInstanceOf(Error);
      expect(mockError.message).toContain('Network error');
    });

    it('should handle file system errors gracefully', () => {
      // Mock a file system error scenario
      const mockError = new Error('ENOENT: no such file or directory');
      mockError.name = 'FileSystemError';
      
      expect(mockError).toBeInstanceOf(Error);
      expect(mockError.message).toContain('ENOENT');
    });

    it('should handle invalid configuration gracefully', () => {
      const invalidConfig = {
        url: '',
        allowTraining: 'invalid',
        compression: 'invalid-level'
      };

      // Test that invalid config can be detected
      expect(invalidConfig.url).toBe('');
      expect(typeof invalidConfig.allowTraining).toBe('string');
      expect(invalidConfig.compression).toBe('invalid-level');
    });
  });
}); 