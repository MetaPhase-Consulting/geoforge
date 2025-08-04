import { beforeAll, afterAll, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';

// Global test setup
beforeAll(async () => {
  // Create test output directory
  const testOutputDir = path.resolve(process.cwd(), 'test-output');
  try {
    await fs.mkdir(testOutputDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
});

// Clean up after each test
afterEach(async () => {
  // Clean up any test files
  const testOutputDir = path.resolve(process.cwd(), 'test-output');
  try {
    const files = await fs.readdir(testOutputDir);
    for (const file of files) {
      if (file.endsWith('.zip') || file.endsWith('.txt') || file.endsWith('.xml') || file.endsWith('.json')) {
        await fs.unlink(path.join(testOutputDir, file));
      }
    }
  } catch (error) {
    // Directory might not exist
  }
});

// Global test teardown
afterAll(async () => {
  // Clean up test output directory
  const testOutputDir = path.resolve(process.cwd(), 'test-output');
  try {
    await fs.rm(testOutputDir, { recursive: true, force: true });
  } catch (error) {
    // Directory might not exist
  }
}); 