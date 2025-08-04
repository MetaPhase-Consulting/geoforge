import React from 'react';
import { Terminal, Package, Download, Github, Copy, Check } from 'lucide-react';

export default function CLI() {
  const [copiedCommand, setCopiedCommand] = React.useState<string>('');

  const copyToClipboard = (text: string, command: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(command);
    setTimeout(() => setCopiedCommand(''), 2000);
  };

  const commands = [
    {
      id: 'install',
      title: 'Install & Build',
      command: 'git clone https://github.com/brianfunk/geoforge.git && cd geoforge && npm install && npm run build:cli',
      description: 'Clone, install dependencies, and build the CLI'
    },
    {
      id: 'basic',
      title: 'Basic Analysis',
      command: 'node dist/cli/index.js https://example.com',
      description: 'Analyze a website and generate all AI optimization files'
    },
    {
      id: 'selective',
      title: 'Selective Generation',
      command: 'node dist/cli/index.js https://example.com --no-humans --no-ai-txt --compression maximum',
      description: 'Generate specific files with custom options'
    },
    {
      id: 'training',
      title: 'Allow AI Training',
      command: 'node dist/cli/index.js https://example.com --allow-training',
      description: 'Generate files that allow AI training on content'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-matte-bg py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="font-orbitron text-5xl font-bold text-charcoal dark:text-white mb-4 flex items-center justify-center space-x-4">
            <Terminal className="w-12 h-12 text-gold" />
            <span className="shimmer-text">Command Line</span>
          </h1>
          <p className="text-xl text-charcoal/70 dark:text-silver font-work-sans max-w-2xl mx-auto">
            Install GEOforge CLI to generate AI-ready files from your terminal
          </p>
        </div>

        {/* Installation */}
        <div className="bg-white dark:bg-charcoal rounded-2xl p-8 border border-gold/20 dark:border-gold/30 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Package className="w-6 h-6 text-gold" />
            <h2 className="font-orbitron text-2xl font-bold text-charcoal dark:text-white">
              Installation
            </h2>
          </div>

          <div className="bg-matte-bg dark:bg-matte-bg rounded-lg p-6 mb-6 border border-gold/10 dark:border-gold/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-charcoal/60 dark:text-silver/80 font-work-sans text-sm">Terminal</span>
              <button
                onClick={() => copyToClipboard('git clone https://github.com/brianfunk/geoforge.git && cd geoforge && npm install && npm run build:cli', 'install')}
                className="flex items-center space-x-1 text-charcoal/60 dark:text-silver/80 hover:text-gold dark:hover:text-gold transition-colors"
              >
                {copiedCommand === 'install' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-sm">Copy</span>
                  </>
                )}
              </button>
            </div>
            <code className="text-gold font-mono text-lg">git clone https://github.com/brianfunk/geoforge.git && cd geoforge && npm install && npm run build:cli</code>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/brianfunk/geoforge"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gold hover:text-gold-light dark:hover:text-gold-light transition-colors font-work-sans"
            >
              <Github className="w-5 h-5" />
              <span>View Source Code</span>
            </a>
            <a
              href="https://github.com/brianfunk/geoforge/blob/main/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-charcoal/70 dark:text-silver hover:text-gold dark:hover:text-gold transition-colors font-work-sans"
            >
              <Download className="w-5 h-5" />
              <span>Full Documentation</span>
            </a>
          </div>
        </div>

        {/* Commands */}
        <div className="space-y-6">
          <h2 className="font-orbitron text-3xl font-bold text-charcoal dark:text-white text-center mb-8">
            Available Commands
          </h2>

          {commands.map((cmd) => (
            <div key={cmd.id} className="bg-white dark:bg-charcoal rounded-2xl p-6 border border-gold/20 dark:border-gold/30">
              <h3 className="font-orbitron text-xl font-bold text-charcoal dark:text-white mb-3">
                {cmd.title}
              </h3>
              <p className="text-charcoal/70 dark:text-silver font-work-sans mb-4">
                {cmd.description}
              </p>
              
              <div className="bg-matte-bg dark:bg-matte-bg rounded-lg p-4 border border-gold/10 dark:border-gold/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-charcoal/60 dark:text-silver font-work-sans text-sm">Command</span>
                  <button
                    onClick={() => copyToClipboard(cmd.command, cmd.id)}
                    className="flex items-center space-x-1 text-charcoal/60 dark:text-silver hover:text-gold dark:hover:text-gold transition-colors"
                  >
                    {copiedCommand === cmd.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-sm">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-sm">Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <code className="text-gold font-mono">{cmd.command}</code>
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mt-12 bg-white dark:bg-charcoal rounded-2xl p-8 border border-gold/20 dark:border-gold/30">
          <h2 className="font-orbitron text-2xl font-bold text-charcoal dark:text-white mb-6 text-center">
            What Gets Generated
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-orbitron font-semibold text-charcoal dark:text-white">Core Files</h3>
              <ul className="space-y-2 font-work-sans text-charcoal/70 dark:text-silver">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span>robots.txt with AI crawler rules</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span>sitemap.xml with enhanced metadata</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span>humans.txt with team info</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span>geoforge.json with detailed analysis</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-orbitron font-semibold text-charcoal dark:text-white">AI & Web Files</h3>
              <ul className="space-y-2 font-work-sans text-charcoal/70 dark:text-silver">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span>.well-known/ai.txt for AI guidelines</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span>.well-known/security.txt for security</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span>manifest.json for PWA support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span>ads.txt & app-ads.txt for advertising</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}