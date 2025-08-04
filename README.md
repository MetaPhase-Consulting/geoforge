# GEOforge

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://opensource.org/)
[![CivicTech](https://img.shields.io/badge/Civic-Tech-1f7a8c)](https://github.com/brianfunk/geoforge)
[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/projects/geoforge/deploys)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-green)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Security](https://img.shields.io/badge/Security-SOC%202-blue)](https://netlify.com/security)

**Generative Engine Optimization for LLM Discovery**

GEOforge is an open-source tool that generates AI-ready optimization files for websites, including robots.txt, sitemaps, and vendor-specific AI manifests. Built for the modern web where AI crawlers and search engines need structured, accessible content.

![GEOforge Interface](public/logo_mpc_header_color.svg)

## 🎯 Project Purpose

GEOforge bridges the gap between traditional SEO and AI discovery by providing tools to optimize websites for both human users and AI systems. It generates standardized files that help AI crawlers understand your content while maintaining control over how your data is used for training.

## ✨ Features

### 🤖 AI Crawler Management
- **Granular Control**: Specify which AI systems can access your content
- **Vendor-Specific Rules**: Customize rules for different AI platforms
- **Training vs. Search**: Distinguish between training crawlers and live search indexers
- **Policy Tokens**: Implement special robots.txt tokens for AI training control

### 📄 Vendor Manifests
- **Standardized JSON**: Generate manifests for major AI platforms
- **Platform-Specific**: Tailored configurations for GPT, Claude, Perplexity, and more
- **Automated Generation**: Create manifests from your existing site structure
- **Version Control**: Track changes and updates to AI configurations

### 🗺️ Enhanced Sitemaps
- **XML & JSON Formats**: Support for both traditional and modern sitemap formats
- **AI-Optimized**: Enhanced metadata for AI crawler understanding
- **Automated Discovery**: Generate sitemaps from your existing content
- **Real-time Updates**: Keep sitemaps current with your content

### 🔧 Developer Tools
- **Web Interface**: User-friendly online tool for easy configuration
- **CLI Support**: Command-line interface for developers and automation
- **API Integration**: Programmatic access for custom workflows
- **Bulk Operations**: Process multiple sites or domains efficiently

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Online Tool
Visit [geoforge.dev](https://geoforge.dev) to use the web interface.

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/brianfunk/geoforge.git
   cd geoforge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Command Line Usage
```bash
# Install globally
npm install -g geoforge

# Initialize project
npx geoforge init --site "My Site" --domain https://mysite.com

# Run audit
npx geoforge audit

# Generate files
npx geoforge generate --output ./ai-files
```

## 🏗️ Project Structure

```
geoforge/
├── public/                 # Static assets
│   ├── logo_mpc_header_color.svg
│   ├── logo_mpc_header_white.svg
│   ├── favicon.ico        # Favicon and icons
│   ├── manifest.json      # PWA manifest
│   ├── robots.txt         # Search engine directives
│   ├── sitemap.xml        # Site structure
│   ├── humans.txt         # Human-readable site info
│   └── .well-known/       # Special directories
│       └── ai.txt         # AI interaction guidelines
├── src/
│   ├── components/        # React components
│   │   ├── CodeExample.tsx
│   │   ├── FeatureBlocks.tsx
│   │   ├── Footer.tsx
│   │   └── Header.tsx
│   ├── contexts/          # React contexts
│   │   └── ThemeContext.tsx
│   ├── pages/             # Page components
│   │   ├── Home.tsx       # Landing page
│   │   ├── About.tsx      # About page
│   │   └── CommandLine.tsx # CLI documentation
│   ├── services/          # Business logic
│   │   ├── websiteAnalyzer.ts
│   │   └── zipGenerator.ts
│   ├── assets/            # Static assets
│   └── main.tsx           # Application entry point
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 🤖 Supported AI Agents

| Label | Type | robots User-Agent | Description |
|-------|------|-------------------|-------------|
| GPTBot | Training crawler | GPTBot | OpenAI's training data crawler |
| ChatGPT-User | On-demand fetch | ChatGPT-User | User-triggered content fetching |
| OAI-SearchBot | Live indexer | OAI-SearchBot | OpenAI's search indexing bot |
| ClaudeBot | Training crawler | ClaudeBot, anthropic-ai | Anthropic's training crawler |
| Claude-SearchBot | Live indexer | Claude-SearchBot | Anthropic's search indexing |
| Claude-User | On-demand fetch | Claude-User | User-triggered Claude requests |
| PerplexityBot | Live indexer | PerplexityBot | Perplexity's search indexing |
| Perplexity-User | On-demand fetch | Perplexity-User | User-triggered Perplexity requests |
| BingBot | Training crawler | Bingbot | Microsoft's training crawler |
| Google-Extended | Policy token | Google-Extended | Google's AI training control |
| Applebot-Extended | Policy token | Applebot-Extended | Apple's AI training control |

## 📄 Generated Files

### Core Files
- **`robots.txt`** - AI crawler directives and policies
- **`sitemap.xml`** - Enhanced XML sitemap with AI metadata
- **`sitemap.json`** - JSON sitemap for modern crawlers
- **`humans.txt`** - Human-readable site information
- **`llms.txt`** - Large Language Model directives

### AI-Specific Files
- **`.well-known/ai.txt`** - AI interaction guidelines
- **`ai-manifest.json`** - Standardized AI platform manifest
- **`vendor-specific/`** - Platform-specific configurations
  - `openai-manifest.json`
  - `anthropic-manifest.json`
  - `perplexity-manifest.json`

### Advanced Features
- **ZIP Downloads** - Complete AI optimization packages
- **Bulk Generation** - Process multiple sites simultaneously
- **Version Control** - Track changes to AI configurations
- **Analytics Integration** - Monitor AI crawler activity

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

### Adding New AI Platforms

1. Create platform configuration in `src/config/platforms/`
2. Add user-agent patterns and capabilities
3. Implement manifest generation logic
4. Update the platform selector component

### Code Quality

This project uses:
- **ESLint** for code linting
- **TypeScript** for type safety
- **Prettier** for code formatting (recommended)
- **Accessibility** testing with built-in WCAG compliance

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contributing Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 🔒 Security

Security is important to us. Please review our [Security Policy](SECURITY.md) for information on reporting vulnerabilities.

Key security features:
- Input sanitization and XSS protection
- File upload validation and size limits
- CSP headers for additional protection
- Regular dependency updates

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** - For pioneering AI training and search
- **Anthropic** - For Claude and responsible AI development
- **Perplexity** - For AI-powered search innovation
- **React** - User interface framework
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server

## 📞 Support

- **Documentation**: Check our [Wiki](../../wiki) for detailed guides
- **Issues**: Report bugs or request features via [GitHub Issues](../../issues)
- **Discussions**: Join conversations in [GitHub Discussions](../../discussions)
- **Contact**: For private inquiries, use our contact form

## 🗺️ Roadmap

- [ ] Add support for more AI platforms (Cohere, AI21, etc.)
- [ ] Implement real-time AI crawler monitoring
- [ ] Add collaboration features for teams
- [ ] Create VS Code extension
- [ ] Add API for programmatic access
- [ ] Mobile app for on-the-go configuration
- [ ] Integration with popular CMS platforms
- [ ] Advanced analytics and reporting

---

**Built with ❤️ for the AI-first web**

[Website](https://geoforge.dev) • [Issues](../../issues) • [Contributing](CONTRIBUTING.md) • [Changelog](CHANGELOG.md)
