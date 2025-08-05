# Deployment Guide

This guide covers deploying GEOforge to various platforms.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- Access to deployment platform

## Local Development

### Setup
```bash
# Clone repository
git clone https://github.com/MetaPhase-Consulting/geoforge.git
cd geoforge

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables
Create a `.env` file in the root directory:
```env
# Development settings
VITE_APP_ENV=development
VITE_API_URL=http://localhost:3000
```

## Production Build

### Build Process
```bash
# Install dependencies
npm ci

# Build for production
npm run build

# Preview production build
npm run preview
```

### Build Output
The build creates a `dist/` directory with:
- Static HTML files
- Optimized JavaScript bundles
- Compressed CSS
- Assets and images

## Deployment Platforms

### Netlify (Recommended)

#### Automatic Deployment
1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 20.x

#### Manual Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

#### Environment Variables
Set in Netlify dashboard:
- `VITE_APP_ENV=production`
- `VITE_API_URL=https://api.geoforge.dev`

### Vercel

#### Automatic Deployment
1. Connect your GitHub repository to Vercel
2. Vercel will auto-detect Vite configuration
3. Deploy automatically on push to main branch

#### Manual Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### GitHub Pages

#### Setup
1. Add to `package.json`:
```json
{
  "homepage": "https://brianfunk.github.io/geoforge",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

2. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Deploy:
```bash
npm run deploy
```

### Docker Deployment

#### Build Image
```bash
# Build Docker image
docker build -t geoforge .

# Run container
docker run -p 5173:5173 geoforge
```

#### Docker Compose
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

## Environment Configuration

### Development
```env
VITE_APP_ENV=development
VITE_API_URL=http://localhost:3000
VITE_DEBUG=true
```

### Staging
```env
VITE_APP_ENV=staging
VITE_API_URL=https://staging-api.geoforge.dev
VITE_DEBUG=false
```

### Production
```env
VITE_APP_ENV=production
VITE_API_URL=https://api.geoforge.dev
VITE_DEBUG=false
```

## Performance Optimization

### Build Optimization
- Enable code splitting
- Optimize bundle size
- Compress assets
- Enable caching

### CDN Configuration
- Configure CDN for static assets
- Set proper cache headers
- Enable gzip compression

### Monitoring
- Set up error tracking (Sentry)
- Configure analytics
- Monitor performance metrics

## Security Considerations

### HTTPS
- Always use HTTPS in production
- Configure HSTS headers
- Set up SSL certificates

### Headers
Configure security headers:
```nginx
# Content Security Policy
add_header Content-Security-Policy "default-src 'self'";

# X-Frame-Options
add_header X-Frame-Options "SAMEORIGIN";

# X-Content-Type-Options
add_header X-Content-Type-Options "nosniff";
```

### Environment Variables
- Never commit sensitive data
- Use environment variables for secrets
- Rotate keys regularly

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache
npm run clean
rm -rf node_modules
npm install

# Check Node version
node --version
```

#### Deployment Issues
- Check build logs
- Verify environment variables
- Test locally first

#### Performance Issues
- Optimize bundle size
- Enable compression
- Use CDN for assets

### Support
- Check [GitHub Issues](../../issues)
- Review [Documentation](../README.md)
- Contact us through our support form

## Monitoring and Maintenance

### Health Checks
- Set up uptime monitoring
- Configure error alerting
- Monitor performance metrics

### Updates
- Keep dependencies updated
- Monitor security advisories
- Test updates in staging

### Backup
- Version control for code
- Database backups (if applicable)
- Configuration backups

---

**For additional help, see our [Contributing Guide](CONTRIBUTING.md) or contact the team.** 