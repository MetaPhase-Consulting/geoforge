import React from 'react';
import { Terminal, Package, Download, Github, Copy, Check, AlertCircle } from 'lucide-react';

export default function CLI() {
  const [copiedCommand, setCopiedCommand] = React.useState<string>('');
  const [copyError, setCopyError] = React.useState<string>('');

  const copyToClipboard = async (text: string, command: string) => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API is unavailable in this browser context.');
      }
      await navigator.clipboard.writeText(text);
      setCopyError('');
      setCopiedCommand(command);
      setTimeout(() => setCopiedCommand(''), 2000);
    } catch (error) {
      setCopyError(error instanceof Error ? error.message : 'Unable to copy command.');
    }
  };

  const commands = [
    {
      id: 'install',
      title: 'Install CLI',
      command: 'npm install -g geoforge-cli',
      description: 'Install GEOforge CLI globally via NPM'
    },
    {
      id: 'basic',
      title: 'Basic Analysis',
      command: 'geoforge https://example.com',
      description: 'Analyze a website and generate all AI optimization files'
    },
    {
      id: 'selective',
      title: 'Selective Generation',
      command: 'geoforge https://example.com --no-humans --no-ai-txt --compression maximum',
      description: 'Generate specific files with custom options'
    },
    {
      id: 'training',
      title: 'Allow AI Training',
      command: 'geoforge https://example.com --allow-training',
      description: 'Generate files that allow AI training on content'
    },
    {
      id: 'custom-output',
      title: 'Custom Output Directory',
      command: 'geoforge https://example.com --output ./my-ai-files',
      description: 'Specify a custom output directory for generated files'
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

        {copyError && (
          <div className="mb-6 p-3 rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{copyError}</span>
          </div>
        )}

        <div className="bg-white dark:bg-charcoal rounded-2xl p-8 border border-gold/20 dark:border-gold/30 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Package className="w-6 h-6 text-gold" />
            <h2 className="font-orbitron text-2xl font-bold text-charcoal dark:text-white">Installation</h2>
          </div>

          <div className="bg-matte-bg dark:bg-matte-bg rounded-lg p-6 mb-6 border border-gold/10 dark:border-gold/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-charcoal/60 dark:text-silver font-work-sans text-sm">Terminal</span>
              <button
                onClick={() => copyToClipboard('npm install -g geoforge-cli', 'install')}
                aria-label="Copy install command"
                className="flex items-center space-x-1 text-charcoal/60 dark:text-silver hover:text-gold"
              >
                {copiedCommand === 'install' ? (
                  <>
                    <Check className="w-4 h-4 text-current" />
                    <span className="text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-current" />
                    <span className="text-sm">Copy</span>
                  </>
                )}
              </button>
            </div>
            <code className="text-gold font-mono text-lg">npm install -g geoforge-cli</code>
          </div>

          <div className="flex items-center space-x-4">
            <a href="https://github.com/MetaPhase-Consulting/geoforge" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-gold">
              <Github className="w-5 h-5" />
              <span>View Source Code</span>
            </a>
            <a href="https://www.npmjs.com/package/geoforge-cli" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-charcoal/70 dark:text-silver hover:text-gold dark:hover:text-gold">
              <Download className="w-5 h-5" />
              <span>NPM Package</span>
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="font-orbitron text-3xl font-bold text-charcoal dark:text-white text-center mb-8">Available Commands</h2>

          {commands.map((cmd) => (
            <div key={cmd.id} className="bg-white dark:bg-charcoal rounded-2xl p-6 border border-gold/20 dark:border-gold/30">
              <h3 className="font-orbitron text-xl font-bold text-charcoal dark:text-white mb-3">{cmd.title}</h3>
              <p className="text-charcoal/70 dark:text-silver font-work-sans mb-4">{cmd.description}</p>

              <div className="bg-matte-bg dark:bg-matte-bg rounded-lg p-4 border border-gold/10 dark:border-gold/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-charcoal/60 dark:text-silver font-work-sans text-sm">Command</span>
                  <button
                    onClick={() => copyToClipboard(cmd.command, cmd.id)}
                    aria-label={`Copy command: ${cmd.title}`}
                    className="flex items-center space-x-1 text-charcoal/60 dark:text-silver hover:text-gold dark:hover:text-gold"
                  >
                    {copiedCommand === cmd.id ? (
                      <>
                        <Check className="w-4 h-4 text-current" />
                        <span className="text-sm">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-current" />
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
      </div>
    </div>
  );
}
