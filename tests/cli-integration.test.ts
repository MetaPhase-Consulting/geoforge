import { describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';
import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

describe('CLI Integration Tests', () => {
  const outputDir = path.resolve(process.cwd(), 'test-output');
  const cliEntry = path.resolve(process.cwd(), 'dist/cli/index.js');

  beforeAll(async () => {
    try {
      await fs.access(cliEntry);
    } catch {
      execSync('npm run build:cli', { stdio: 'pipe' });
    }
  });

  beforeEach(async () => {
    await fs.mkdir(outputDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(outputDir, { recursive: true, force: true });
  });

  function runCli(args: string[]): Promise<{ code: number | null; output: string; error: string }> {
    return new Promise((resolve, reject) => {
      const start = async () => {
        try {
          await fs.access(cliEntry);
        } catch {
          execSync('npm run build:cli', { stdio: 'pipe' });
        }

        const child = spawn('node', [cliEntry, ...args], {
          stdio: ['pipe', 'pipe', 'pipe'],
          cwd: path.resolve(process.cwd()),
          env: { ...process.env, GEOFORGE_MOCK_ANALYSIS: '1' }
        });

        let output = '';
        let errorOutput = '';

        child.stdout.on('data', (data) => {
          output += data.toString();
        });

        child.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });

        child.on('close', (code) => resolve({ code, output, error: errorOutput }));
        child.on('error', reject);
      };

      void start();
    });
  }

  it('shows help with --help', async () => {
    const result = await runCli(['--help']);
    expect(result.code).toBe(0);
    expect(result.output).toContain('Usage:');
    expect(result.output).toContain('--profile');
    expect(result.output).toContain('--json-summary');
  });

  it('shows version with --version', async () => {
    const result = await runCli(['--version']);
    expect(result.code).toBe(0);
    expect(result.output.trim()).toBe('0.0.1');
  });

  it('generates files deterministically in mock mode', async () => {
    const result = await runCli(['https://example.com', '--output', outputDir, '--profile', 'balanced']);
    if (result.code !== 0) {
      throw new Error(`CLI failed: ${result.error}`);
    }
    expect(result.code).toBe(0);
    expect(result.output).toContain('✅ robots.txt generated');
    expect(result.output).toContain('✅ geoforge.json generated');
    expect(result.output).toContain('🎉 ZIP file generated successfully');

    const files = await fs.readdir(outputDir);
    expect(files.some((name) => name.endsWith('.zip'))).toBe(true);
  });

  it('supports JSON summary output', async () => {
    const result = await runCli(['https://example.com', '--output', outputDir, '--json-summary', '--profile', 'strict-privacy']);
    if (result.code !== 0) {
      throw new Error(`CLI failed: ${result.error}`);
    }
    expect(result.code).toBe(0);

    const lines = result.output
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const summaryLine = lines.find((line) => line.startsWith('{') && line.endsWith('}'));
    expect(summaryLine).toBeTruthy();

    const summary = JSON.parse(summaryLine || '{}');
    expect(summary.status).toBe('success');
    expect(summary.profile).toBe('strict-privacy');
    expect(Array.isArray(summary.artifacts)).toBe(true);
  });

  it('handles compression option', async () => {
    const result = await runCli(['https://example.com', '--output', outputDir, '--compression', 'maximum']);
    if (result.code !== 0) {
      throw new Error(`CLI failed: ${result.error}`);
    }
    expect(result.code).toBe(0);
    expect(result.output).toContain('🗜️ Compressing files with level 9');
  });
});
