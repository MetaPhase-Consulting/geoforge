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
      title: 'Install GEOforge',
      command: 'npm install -g geoforge',
      description: 'Install the CLI globally to use anywhere'
    },
    {
      id: 'init',
      title: 'Initialize Project',
      command: 'geoforge init --site "My Site" --domain https://mysite.com',
      description: 'Create AI-ready files for your website'
    },
    {
      id: 'audit',
      title: 'Run Audit',
      command: 'geoforge audit',
      description: 'Check your site\'s AI optimization status'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-matte-bg py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto bg-gold/10 dark:bg-gold/20 rounded-2xl flex items-center justify-center mb-6">
            <Terminal className="w-10 h-10 text-gold" />
          </div>
          <h1 className="font-orbitron text-5xl font-bold text-charcoal dark:text-white mb-4">
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
                onClick={() => copyToClipboard('npm install -g geoforge', 'install')}
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
            <code className="text-gold font-mono text-lg">npm install -g geoforge</code>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://www.npmjs.com/package/geoforge"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gold hover:text-gold-light dark:hover:text-gold-light transition-colors font-work-sans"
            >
              <Package className="w-5 h-5" />
              <span>View on NPM</span>
            </a>
            <a
              href="https://github.com/geoforge/geoforge"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-charcoal/70 dark:text-silver hover:text-gold dark:hover:text-gold transition-colors font-work-sans"
            >
              <Github className="w-5 h-5" />
              <span>Source Code</span>
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
                  <span>sitemap.xml & sitemap.json</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span>humans.txt with team info</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span>llms.txt with AI directives</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-orbitron font-semibold text-charcoal dark:text-white">Vendor Manifests</h3>
              <ul className="space-y-2 font-work-sans text-charcoal/70 dark:text-silver">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span>openai.json for GPT models</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span>claude.json for Anthropic</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span>gemini.json for Google AI</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span>Custom vendor configs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}