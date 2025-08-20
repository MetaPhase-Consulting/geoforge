# GEOforge CLI Testing Guide

This document describes the testing setup and procedures for the GEOforge CLI tool.

## Test URLs

The test suite uses reliable test URLs:
- **Primary**: `https://metaphase.tech` - A real, accessible website
- **Secondary**: `https://farmers.gov` - Government website for testing
- **Fallback**: Various subdomains and paths for comprehensive testing

## Running Tests

### All Tests
```bash
npm test
```

### Run Tests Once (No Watch Mode)
```bash
npm run test:run
```

### Run Tests with UI
```bash
npm run test:ui
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

## Test Configuration

### Vitest Configuration (`vitest.config.ts`)
- **Environment**: Node.js
- **Coverage**: V8 provider with HTML, JSON, and text reporters
- **Setup**: Global test setup in `tests/setup.ts`
- **Aliases**: `@` resolves to `./src`

### Test Setup (`tests/setup.ts`)
- Creates test output directory
- Cleans up test files after each test
- Removes test directory after all tests

## CLI Build Process

### Build Configuration (`tsconfig.cli.json`)
- **Target**: ES2022
- **Module**: ESNext
- **Output**: `./dist`
- **Includes**: CLI files and config
- **Excludes**: Complex analyzer files

### Build Command
```bash
npm run build:cli
```

## Test Coverage

The test suite covers:

### ✅ Core Functionality
- URL formatting and validation
- Configuration object creation
- File content generation
- Command-line argument parsing
- Error handling and reporting
- ZIP file generation with unique names
- Compression level handling

### ✅ Integration Testing
- CLI execution with real arguments
- File system operations
- Process spawning and output capture
- Error scenario testing
- Comprehensive file generation
- Selective file generation with flags

### ✅ Unit Testing
- Individual function testing
- Edge case handling
- Input validation
- Output formatting
- ZIP file naming and compression

## Test Results

Current test status:
- **Test Files**: 3 passed (3)
- **Tests**: 67 passed (67)
- **Coverage**: Comprehensive coverage of CLI functionality

## Adding New Tests

### For New CLI Features
1. Add unit tests in `tests/cli-unit.test.ts`
2. Add integration tests in `tests/cli-integration.test.ts`
3. Add core functionality tests in `tests/cli.test.ts`

### Test Patterns
```typescript
describe('Feature Name', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = functionToTest(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### Async Tests
```typescript
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

### CLI Process Testing
```typescript
it('should execute CLI command', async () => {
  return new Promise<void>((resolve, reject) => {
    const child = spawn('node', ['dist/cli/index.js', '--help']);
    
    child.on('close', (code) => {
      expect(code).toBe(0);
      resolve();
    });
    
    child.on('error', reject);
  });
});
```

## CLI Features Tested

### ✅ File Generation
- **robots.txt** - AI crawler directives
- **sitemap.xml** - Enhanced XML sitemap
- **humans.txt** - Human-readable site information
- **.well-known/ai.txt** - AI interaction guidelines
- **.well-known/security.txt** - Security contact information
- **manifest.json** - Progressive Web App manifest
- **browserconfig.xml** - Microsoft tile configuration
- **ads.txt** - Authorized digital sellers
- **app-ads.txt** - Mobile app advertising
- **404.html** - Custom 404 error page
- **500.html** - Custom 500 error page
- **README.md** - Package documentation
- **DEPLOYMENT.md** - Deployment guide

### ✅ Command Line Options
- **--allow-training** - Allow AI training on content
- **--no-humans** - Skip humans.txt generation
- **--no-sitemap** - Skip sitemap.xml generation
- **--no-ai-txt** - Skip ai.txt generation
- **--no-security-txt** - Skip security.txt generation
- **--no-manifest** - Skip manifest.json generation
- **--no-ads** - Skip ads.txt and app-ads.txt generation
- **--no-error-pages** - Skip 404.html and 500.html generation
- **--no-favicons** - Skip favicon files
- **--compression** - Set compression level (none, standard, maximum)
- **--output** - Set output directory

### ✅ ZIP File Features
- **Unique naming** - `geoforge-{domain}-{timestamp}.zip`
- **Compression levels** - none (0), standard (6), maximum (9)
- **File organization** - Proper directory structure in ZIP
- **File size reporting** - Shows compressed file size

## Troubleshooting

### Common Issues

1. **CLI Build Fails**
   - Check `tsconfig.cli.json` configuration
   - Ensure all dependencies are installed
   - Run `npm run build:cli` to see specific errors

2. **Tests Fail**
   - Check test output directory exists
   - Ensure CLI is built before running tests
   - Run `npm run test:run` for detailed output

3. **Integration Tests Timeout**
   - Increase timeout in test configuration
   - Check if CLI process is hanging
   - Verify CLI arguments are correct

4. **ZIP File Issues**
   - Check JSZip dependency is installed
   - Verify file permissions for output directory
   - Check available disk space

### Debug Commands

```bash
# Build CLI
npm run build:cli

# Test CLI manually
geoforge --help
geoforge https://metaphase.tech
geoforge https://farmers.gov --no-humans

# Run specific test file
npm test tests/cli.test.ts

# Run tests with verbose output
npm run test:run -- --reporter=verbose

# Check ZIP file contents
unzip -l geoforge-output/*.zip
```

## Continuous Integration

The test suite is designed to run in CI environments:
- Fast execution (< 1 second)
- No external dependencies
- Comprehensive coverage
- Clear error reporting
- ZIP file validation

## Future Enhancements

- [ ] Add performance tests
- [ ] Add memory usage tests
- [ ] Add security tests
- [ ] Add accessibility tests
- [ ] Add cross-platform compatibility tests
- [ ] Add file content validation tests
- [ ] Add compression ratio tests
- [ ] Add large file handling tests 