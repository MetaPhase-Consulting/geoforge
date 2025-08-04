import React, { useState } from 'react';
import { Globe, Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface LLMConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface GenerationConfig {
  url: string;
  siteName: string;
  allowTraining: boolean;
  llms: LLMConfig[];
  includeHumans: boolean;
  includeSitemap: boolean;
  auditMode: 'basic' | 'full';
}

const defaultLLMs: LLMConfig[] = [
  { id: 'gptbot', name: 'GPTBot', description: 'OpenAI\'s web crawler', enabled: true },
  { id: 'claudebot', name: 'ClaudeBot', description: 'Anthropic\'s web crawler', enabled: true },
  { id: 'perplexitybot', name: 'PerplexityBot', description: 'Perplexity AI crawler', enabled: true },
  { id: 'google-extended', name: 'Google-Extended', description: 'Google\'s AI training crawler', enabled: false },
  { id: 'applebot-extended', name: 'Applebot-Extended', description: 'Apple\'s AI crawler', enabled: false },
  { id: 'bingbot', name: 'BingBot', description: 'Microsoft\'s search crawler', enabled: true },
];

export default function Generate() {
  const [config, setConfig] = useState<GenerationConfig>({
    url: '',
    siteName: '',
    allowTraining: false,
    llms: defaultLLMs,
    includeHumans: true,
    includeSitemap: true,
    auditMode: 'basic'
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleAnalyze = async () => {
    if (!config.url) {
      setError('Please enter a valid URL');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    
    try {
      // Simulate URL analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAnalysisResult({
        hasRobots: Math.random() > 0.5,
        hasSitemap: Math.random() > 0.3,
        currentBots: ['googlebot', 'bingbot'],
        sslEnabled: true,
        responseTime: Math.floor(Math.random() * 500) + 200,
        coreWebVitals: {
          lcp: Math.random() * 3 + 1,
          fid: Math.random() * 100 + 50,
          cls: Math.random() * 0.2
        }
      });
    } catch (err) {
      setError('Failed to analyze URL. Please check the URL and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate generation process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create a mock ZIP file download
      const blob = new Blob(['Mock GEO files generated'], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${config.siteName || 'geoforge'}-geo-files.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to generate files. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const updateLLM = (id: string, enabled: boolean) => {
    setConfig(prev => ({
      ...prev,
      llms: prev.llms.map(llm => 
        llm.id === id ? { ...llm, enabled } : llm
      )
    }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-matte-bg py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="font-orbitron text-5xl font-bold text-charcoal dark:text-white mb-4 flex items-center justify-center space-x-4">
            <Download className="w-12 h-12 text-gold" />
            <span className="shimmer-text">Online Tool</span>
          </h1>
          <p className="text-xl text-charcoal/70 dark:text-silver font-work-sans">
            Analyze your website and forge AI-ready optimization files
          </p>
        </div>

        <div className="space-y-8">
          {/* URL Input Section */}
          <div className="bg-white dark:bg-charcoal rounded-2xl p-8 border border-gold/20 dark:border-gold/30">
            <h2 className="font-orbitron text-2xl font-bold text-charcoal dark:text-white mb-6">
              Website Analysis
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-work-sans font-medium text-charcoal dark:text-white mb-2">
                  Website URL
                </label>
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-silver dark:text-silver" />
                    <input
                      type="url"
                      value={config.url}
                      onChange={(e) => setConfig(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://example.com"
                      className="w-full pl-12 pr-4 py-3 border border-silver/30 dark:border-silver/40 rounded-lg bg-white dark:bg-matte-bg text-charcoal dark:text-white font-work-sans focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-colors placeholder:text-charcoal/50 dark:placeholder:text-silver/60"
                    />
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !config.url}
                    className="px-6 py-3 bg-gold text-charcoal dark:text-charcoal font-orbitron font-semibold rounded-lg hover:bg-gold-light dark:hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <span>Analyze</span>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-work-sans font-medium text-charcoal dark:text-white mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={config.siteName}
                  onChange={(e) => setConfig(prev => ({ ...prev, siteName: e.target.value }))}
                  placeholder="My Awesome Website"
                  className="w-full px-4 py-3 border border-silver/30 dark:border-silver/40 rounded-lg bg-white dark:bg-matte-bg text-charcoal dark:text-white font-work-sans focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-colors placeholder:text-charcoal/50 dark:placeholder:text-silver/60"
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-red-700 dark:text-red-200 font-work-sans">{error}</span>
              </div>
            )}

            {analysisResult && (
              <div className="mt-6 p-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="font-orbitron font-semibold text-green-700 dark:text-green-200">Analysis Complete</span>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm font-work-sans">
                  <div>
                    <span className="text-charcoal dark:text-white">Current robots.txt: </span>
                    <span className={analysisResult.hasRobots ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {analysisResult.hasRobots ? 'Found' : 'Missing'}
                    </span>
                  </div>
                  <div>
                    <span className="text-charcoal dark:text-white">Sitemap: </span>
                    <span className={analysisResult.hasSitemap ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {analysisResult.hasSitemap ? 'Found' : 'Missing'}
                    </span>
                  </div>
                  <div>
                    <span className="text-charcoal dark:text-white">SSL: </span>
                    <span className="text-green-600 dark:text-green-400">Enabled</span>
                  </div>
                  <div>
                    <span className="text-charcoal dark:text-white">Response Time: </span>
                    <span className="text-charcoal dark:text-white">{analysisResult.responseTime}ms</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Configuration Section */}
          <div className="bg-white dark:bg-charcoal rounded-2xl p-8 border border-gold/20 dark:border-gold/30">
            <h2 className="font-orbitron text-2xl font-bold text-charcoal dark:text-white mb-6">
              LLM Configuration
            </h2>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {config.llms.map((llm) => (
                  <div key={llm.id} className="flex items-start space-x-3 p-4 border border-silver/20 dark:border-silver/30 rounded-lg bg-white dark:bg-matte-bg">
                    <input
                      type="checkbox"
                      id={llm.id}
                      checked={llm.enabled}
                      onChange={(e) => updateLLM(llm.id, e.target.checked)}
                      className="mt-1 w-5 h-5 text-gold border-silver/30 dark:border-silver/40 rounded focus:ring-gold focus:ring-2 bg-white dark:bg-matte-bg"
                    />
                    <div className="flex-1">
                      <label htmlFor={llm.id} className="block font-work-sans font-medium text-charcoal dark:text-white cursor-pointer">
                        {llm.name}
                      </label>
                      <p className="text-sm text-charcoal/70 dark:text-silver mt-1">{llm.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-silver/20 dark:border-silver/30 pt-6">
                <h3 className="font-orbitron font-semibold text-charcoal dark:text-white mb-4">Additional Options</h3>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={config.allowTraining}
                      onChange={(e) => setConfig(prev => ({ ...prev, allowTraining: e.target.checked }))}
                      className="w-5 h-5 text-gold border-silver/30 dark:border-silver/40 rounded focus:ring-gold focus:ring-2 bg-white dark:bg-matte-bg"
                    />
                    <span className="font-work-sans text-charcoal dark:text-white">Allow AI training on content</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={config.includeHumans}
                      onChange={(e) => setConfig(prev => ({ ...prev, includeHumans: e.target.checked }))}
                      className="w-5 h-5 text-gold border-silver/30 dark:border-silver/40 rounded focus:ring-gold focus:ring-2 bg-white dark:bg-matte-bg"
                    />
                    <span className="font-work-sans text-charcoal dark:text-white">Include humans.txt</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={config.includeSitemap}
                      onChange={(e) => setConfig(prev => ({ ...prev, includeSitemap: e.target.checked }))}
                      className="w-5 h-5 text-gold border-silver/30 dark:border-silver/40 rounded focus:ring-gold focus:ring-2 bg-white dark:bg-matte-bg"
                    />
                    <span className="font-work-sans text-charcoal dark:text-white">Generate enhanced sitemap</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Generate Section */}
          <div className="text-center">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !analysisResult}
              className="group bg-charcoal dark:bg-gold border-2 border-gold dark:border-charcoal text-gold dark:text-charcoal px-12 py-4 rounded-lg font-orbitron font-semibold text-lg transition-all duration-300 hover:bg-gold hover:text-charcoal dark:hover:bg-charcoal dark:hover:text-gold transform hover:scale-105 hover:shadow-lg hover:shadow-gold/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-3 mx-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Forging Files...</span>
                </>
              ) : (
                <>
                  <Download className="w-6 h-6" />
                  <span>Generate & Download ZIP</span>
                </>
              )}
            </button>
            
            {!analysisResult && (
              <p className="mt-4 text-sm text-charcoal/70 dark:text-silver font-work-sans">
                Please analyze your website first to enable generation
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}