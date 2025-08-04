import React, { useState } from 'react';
import { Download, Terminal, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { WebsiteAnalyzer, type AnalysisConfig, type AnalysisResult } from '../services/websiteAnalyzer';
import { ZipGenerator } from '../services/zipGenerator';

interface Config {
  llms: {
    gptbot: boolean;
    claudebot: boolean;
    perplexitybot: boolean;
    googleExtended: boolean;
    applebotExtended: boolean;
    bingbot: boolean;
  };
  allowTraining: boolean;
  includeHumans: boolean;
  includeSitemap: boolean;
  auditMode: 'basic' | 'full';
  includeAssets: {
    html: boolean;
    css: boolean;
    js: boolean;
    images: boolean;
    fonts: boolean;
  };
  maxDepth: number;
  compression: 'none' | 'standard' | 'maximum';
}

const defaultConfig: Config = {
  llms: {
    gptbot: true,
    claudebot: true,
    perplexitybot: true,
    googleExtended: false,
    bingbot: true,
    applebotExtended: false,
  },
  allowTraining: false,
  includeHumans: true,
  includeSitemap: true,
  auditMode: 'basic',
  includeAssets: {
    html: true,
    css: true,
    js: true,
    images: true,
    fonts: true,
  },
  maxDepth: 3,
  compression: 'standard',
};

const Online: React.FC = () => {
  const [url, setUrl] = useState('');
  const [formattedUrl, setFormattedUrl] = useState('');
  const [urlChanged, setUrlChanged] = useState(false);
  const [siteName, setSiteName] = useState('');
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [generationStatus, setGenerationStatus] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatUrl = (inputUrl: string): string => {
    if (!inputUrl.trim()) return '';
    
    const trimmed = inputUrl.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    
    return `https://${trimmed}`;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);
    
    const formatted = formatUrl(inputUrl);
    setFormattedUrl(formatted);
    setUrlChanged(inputUrl.trim() !== '' && formatted !== inputUrl);
  };

  const handleConfigChange = (key: keyof Config, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleLLMChange = (llm: keyof Config['llms'], enabled: boolean) => {
    setConfig(prev => ({
      ...prev,
      llms: { ...prev.llms, [llm]: enabled }
    }));
  };

  const handleAssetChange = (asset: keyof Config['includeAssets'], enabled: boolean) => {
    setConfig(prev => ({
      ...prev,
      includeAssets: { ...prev.includeAssets, [asset]: enabled }
    }));
  };

  const analyzeWebsite = async () => {
    if (!formattedUrl) {
      setError('Please enter a valid URL');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisProgress(0);
    setAnalysisStatus('Starting analysis...');

    try {
      const analysisConfig: AnalysisConfig = {
        url: formattedUrl,
        siteName: siteName || 'Website',
        allowTraining: config.allowTraining,
        llms: [
          { id: 'gptbot', name: 'GPTBot', description: 'OpenAI ChatGPT', enabled: config.llms.gptbot },
          { id: 'claudebot', name: 'ClaudeBot', description: 'Anthropic Claude', enabled: config.llms.claudebot },
          { id: 'perplexitybot', name: 'PerplexityBot', description: 'Perplexity AI', enabled: config.llms.perplexitybot },
          { id: 'google-extended', name: 'Google-Extended', description: 'Google Bard/Gemini', enabled: config.llms.googleExtended },
          { id: 'applebot-extended', name: 'Applebot-Extended', description: 'Apple AI', enabled: config.llms.applebotExtended },
          { id: 'bingbot', name: 'BingBot', description: 'Microsoft Bing', enabled: config.llms.bingbot },
        ],
        includeHumans: config.includeHumans,
        includeSitemap: config.includeSitemap,
        auditMode: config.auditMode,
        includeAssets: config.includeAssets,
        maxDepth: config.maxDepth,
        compression: config.compression,
      };

      const analyzer = new WebsiteAnalyzer(analysisConfig);
      
      const result = await analyzer.analyze((progress, status) => {
        setAnalysisProgress(progress);
        setAnalysisStatus(status);
      });
      
      setAnalysisResult(result);
      setSiteName(result.metadata.title || siteName || 'Website');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => {
        setAnalysisProgress(0);
        setAnalysisStatus('');
      }, 2000);
    }
  };

  const generateZip = async () => {
    if (!analysisResult) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationStatus('Preparing files...');

    try {
      const analysisConfig: AnalysisConfig = {
        url: formattedUrl,
        siteName: siteName || analysisResult.metadata.title || 'Website',
        allowTraining: config.allowTraining,
        llms: [
          { id: 'gptbot', name: 'GPTBot', description: 'OpenAI ChatGPT', enabled: config.llms.gptbot },
          { id: 'claudebot', name: 'ClaudeBot', description: 'Anthropic Claude', enabled: config.llms.claudebot },
          { id: 'perplexitybot', name: 'PerplexityBot', description: 'Perplexity AI', enabled: config.llms.perplexitybot },
          { id: 'google-extended', name: 'Google-Extended', description: 'Google Bard/Gemini', enabled: config.llms.googleExtended },
          { id: 'applebot-extended', name: 'Applebot-Extended', description: 'Apple AI', enabled: config.llms.applebotExtended },
          { id: 'bingbot', name: 'BingBot', description: 'Microsoft Bing', enabled: config.llms.bingbot },
        ],
        includeHumans: config.includeHumans,
        includeSitemap: config.includeSitemap,
        auditMode: config.auditMode,
        includeAssets: config.includeAssets,
        maxDepth: config.maxDepth,
        compression: config.compression,
      };

      const generator = new ZipGenerator(analysisConfig, analysisResult);
      
      await generator.generateAndDownload((progress, status) => {
        setGenerationProgress(progress);
        setGenerationStatus(status);
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ZIP generation failed');
    } finally {
      setIsGenerating(false);
      setTimeout(() => {
        setGenerationProgress(0);
        setGenerationStatus('');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-matte-bg py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-orbitron text-5xl font-bold text-charcoal dark:text-white mb-4 flex items-center justify-center space-x-4">
            <Download className="w-12 h-12 text-gold" />
            <span className="shimmer-text">Online Tool</span>
          </h1>
          <p className="text-xl text-charcoal/70 dark:text-silver font-work-sans max-w-3xl mx-auto">
            Analyze any website and generate comprehensive AI optimization files. 
            Get robots.txt, sitemap.xml, and AI crawler configurations in one downloadable package.
          </p>
        </div>

        {/* URL Input */}
        <div className="bg-white dark:bg-charcoal rounded-2xl p-8 border border-gold/20 dark:border-gold/30 mb-8">
          <label className="block text-lg font-semibold mb-3 text-gold font-orbitron">
            Website URL
          </label>
          <input
            type="url"
            value={url}
            onChange={handleUrlChange}
            placeholder="Enter website URL (e.g., example.com)"
            className="w-full px-4 py-3 bg-white dark:bg-matte-bg border border-gold/30 dark:border-gold/40 rounded-lg text-charcoal dark:text-white placeholder-charcoal/50 dark:placeholder-silver/50 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold font-work-sans"
          />
          
          {urlChanged && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300 font-work-sans">
                <strong>Original:</strong> {url}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 font-work-sans">
                <strong>Updated:</strong> {formattedUrl}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-work-sans">
                ✓ Added HTTPS protocol for security
              </p>
            </div>
          )}
        </div>

        {/* Site Name */}
        <div className="bg-white dark:bg-charcoal rounded-2xl p-8 border border-gold/20 dark:border-gold/30 mb-8">
          <label className="block text-lg font-semibold mb-3 text-gold font-orbitron">
            Site Name
          </label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="Enter site name (will be auto-filled from analysis)"
            className="w-full px-4 py-3 bg-white dark:bg-matte-bg border border-gold/30 dark:border-gold/40 rounded-lg text-charcoal dark:text-white placeholder-charcoal/50 dark:placeholder-silver/50 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold font-work-sans"
          />
        </div>

        {/* Configuration */}
        <div className="bg-white dark:bg-charcoal rounded-2xl p-8 border border-gold/20 dark:border-gold/30 mb-8">
          <h3 className="text-xl font-semibold mb-6 text-gold font-orbitron">Configuration</h3>
          
          {/* AI Crawlers */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-4 text-charcoal dark:text-white font-orbitron">AI Crawlers</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries({
                gptbot: { name: 'GPTBot', desc: "OpenAI's web crawler for ChatGPT training" },
                claudebot: { name: 'ClaudeBot', desc: "Anthropic's web crawler for Claude training" },
                perplexitybot: { name: 'PerplexityBot', desc: 'Perplexity AI search crawler' },
                googleExtended: { name: 'Google-Extended', desc: "Google's AI training crawler (Bard/Gemini)" },
                applebotExtended: { name: 'Applebot-Extended', desc: "Apple's AI crawler for training" },
                bingbot: { name: 'BingBot', desc: "Microsoft's search and AI crawler" },
              }).map(([key, info]) => (
                <div key={key} className="border border-gold/20 dark:border-gold/30 rounded-lg p-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.llms[key as keyof Config['llms']]}
                      onChange={(e) => handleLLMChange(key as keyof Config['llms'], e.target.checked)}
                      className="mt-1 border-2 border-gold/60 rounded focus:ring-gold/50"
                      style={{ 
                        accentColor: '#F5DFA2',
                        filter: 'hue-rotate(10deg) saturate(1.2)'
                      }}
                    />
                    <div>
                      <div className="font-medium text-charcoal dark:text-white font-work-sans">{info.name}</div>
                      <div className="text-sm text-charcoal/70 dark:text-silver font-work-sans">{info.desc}</div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Basic Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.allowTraining}
                onChange={(e) => handleConfigChange('allowTraining', e.target.checked)}
                className="border-2 border-gold/60 rounded focus:ring-gold/50"
                style={{ 
                  accentColor: '#F5DFA2',
                  filter: 'hue-rotate(10deg) saturate(1.2)'
                }}
              />
              <span className="text-charcoal dark:text-white font-work-sans">Allow AI Training</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.includeHumans}
                onChange={(e) => handleConfigChange('includeHumans', e.target.checked)}
                className="border-2 border-gold/60 rounded focus:ring-gold/50"
                style={{ 
                  accentColor: '#F5DFA2',
                  filter: 'hue-rotate(10deg) saturate(1.2)'
                }}
              />
              <span className="text-charcoal dark:text-white font-work-sans">Include humans.txt</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.includeSitemap}
                onChange={(e) => handleConfigChange('includeSitemap', e.target.checked)}
                className="border-2 border-gold/60 rounded focus:ring-gold/50"
                style={{ 
                  accentColor: '#F5DFA2',
                  filter: 'hue-rotate(10deg) saturate(1.2)'
                }}
              />
              <span className="text-charcoal dark:text-white font-work-sans">Generate sitemap.xml</span>
            </label>
          </div>

          {/* Show/Hide Advanced Settings */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="mb-4 px-4 py-2 bg-charcoal/10 dark:bg-matte-bg hover:bg-charcoal/20 dark:hover:bg-matte-bg/80 border border-gold/30 dark:border-gold/40 rounded-lg text-charcoal dark:text-white transition-colors font-work-sans"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
          </button>

          {/* Advanced Settings */}
          {showAdvanced && (
            <div className="space-y-6 pt-4 border-t border-gold/20 dark:border-gold/30">
              {/* Audit Mode */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gold font-orbitron">Analysis Mode</label>
                <select
                  value={config.auditMode}
                  onChange={(e) => handleConfigChange('auditMode', e.target.value as 'basic' | 'full')}
                  className="w-full px-3 py-2 bg-white dark:bg-matte-bg border border-gold/30 dark:border-gold/40 rounded-lg text-charcoal dark:text-white focus:outline-none focus:border-gold font-work-sans"
                >
                  <option value="basic">Basic (Single Page)</option>
                  <option value="full">Full Site Audit</option>
                </select>
              </div>

              {/* Max Depth */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gold font-orbitron">Max Crawl Depth</label>
                <select
                  value={config.maxDepth}
                  onChange={(e) => handleConfigChange('maxDepth', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-matte-bg border border-gold/30 dark:border-gold/40 rounded-lg text-charcoal dark:text-white focus:outline-none focus:border-gold font-work-sans"
                >
                  <option value={1}>1 Level</option>
                  <option value={2}>2 Levels</option>
                  <option value={3}>3 Levels</option>
                  <option value={5}>5 Levels</option>
                </select>
              </div>

              {/* Asset Inclusion */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gold font-orbitron">Include Assets</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {Object.entries({
                    html: 'HTML',
                    css: 'CSS Files',
                    js: 'JavaScript',
                    images: 'Images',
                    fonts: 'Fonts',
                  }).map(([key, label]) => (
                    <label key={key} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.includeAssets[key as keyof Config['includeAssets']]}
                        onChange={(e) => handleAssetChange(key as keyof Config['includeAssets'], e.target.checked)}
                        className="border-2 border-gold/60 rounded focus:ring-gold/50"
                        style={{ 
                          accentColor: '#F5DFA2',
                          filter: 'hue-rotate(10deg) saturate(1.2)'
                        }}
                      />
                      <span className="text-sm text-charcoal dark:text-white font-work-sans">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Compression */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gold font-orbitron">ZIP Compression</label>
                <select
                  value={config.compression}
                  onChange={(e) => handleConfigChange('compression', e.target.value as Config['compression'])}
                  className="w-full px-3 py-2 bg-white dark:bg-matte-bg border border-gold/30 dark:border-gold/40 rounded-lg text-charcoal dark:text-white focus:outline-none focus:border-gold font-work-sans"
                >
                  <option value="none">No Compression</option>
                  <option value="standard">Standard Compression</option>
                  <option value="maximum">Maximum Compression</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={analyzeWebsite}
            disabled={isAnalyzing || !formattedUrl}
            className="flex-1 px-6 py-3 bg-gold hover:bg-gold-light disabled:bg-charcoal/20 dark:disabled:bg-silver/20 disabled:cursor-not-allowed text-charcoal font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2 font-orbitron"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-charcoal"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Terminal className="w-5 h-5" />
                <span>Analyze Website</span>
              </>
            )}
          </button>

          <button
            onClick={generateZip}
            disabled={isGenerating || !analysisResult}
            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-charcoal/20 dark:disabled:bg-silver/20 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2 font-orbitron"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download ZIP</span>
              </>
            )}
          </button>
        </div>

        {/* Progress Bars */}
        {(isAnalyzing || isGenerating) && (
          <div className="bg-white dark:bg-charcoal rounded-2xl p-6 border border-gold/20 dark:border-gold/30 mb-8">
            {isAnalyzing && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gold font-orbitron">Analyzing Website</span>
                  <span className="text-sm text-charcoal/70 dark:text-silver font-work-sans">{analysisProgress}%</span>
                </div>
                <div className="w-full bg-charcoal/10 dark:bg-silver/20 rounded-full h-2">
                  <div 
                    className="bg-gold h-2 rounded-full transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
                {analysisStatus && (
                  <p className="text-sm text-charcoal/70 dark:text-silver mt-2 font-work-sans">{analysisStatus}</p>
                )}
              </div>
            )}
            
            {isGenerating && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-green-600 font-orbitron">Generating ZIP Package</span>
                  <span className="text-sm text-charcoal/70 dark:text-silver font-work-sans">{generationProgress}%</span>
                </div>
                <div className="w-full bg-charcoal/10 dark:bg-silver/20 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                {generationStatus && (
                  <p className="text-sm text-charcoal/70 dark:text-silver mt-2 font-work-sans">{generationStatus}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-2xl p-4 mb-8">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
              <span className="text-red-700 dark:text-red-300 font-work-sans">{error}</span>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="bg-white dark:bg-charcoal rounded-2xl p-8 border border-gold/20 dark:border-gold/30">
            <h3 className="text-2xl font-semibold mb-6 text-gold font-orbitron">Analysis Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-charcoal/70 dark:text-silver font-orbitron">Site Title</label>
                  <p className="text-charcoal dark:text-white font-work-sans">{analysisResult.metadata.title || 'No title found'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-charcoal/70 dark:text-silver font-orbitron">Description</label>
                  <p className="text-charcoal dark:text-white text-sm font-work-sans">{analysisResult.metadata.description || 'No description found'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-charcoal/70 dark:text-silver font-orbitron">Content Length</label>
                  <p className="text-charcoal dark:text-white font-work-sans">{analysisResult.technical.contentLength.toLocaleString()} bytes</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-charcoal/70 dark:text-silver font-orbitron">Response Time</label>
                  <p className="text-charcoal dark:text-white font-work-sans">{analysisResult.technical.responseTime}ms</p>
                </div>
              </div>

              {/* File Status */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  {analysisResult.technical.hasRobots ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-green-600 dark:text-green-400 font-work-sans">robots.txt - Found</span>
                      {analysisResult.existingFiles.robotsTxt.url && (
                        <a 
                          href={analysisResult.existingFiles.robotsTxt.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-400 text-sm underline font-work-sans"
                        >
                          View File
                        </a>
                      )}
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-yellow-500" />
                      <span className="text-yellow-600 dark:text-yellow-400 font-work-sans">robots.txt - Not Found</span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {analysisResult.technical.hasSitemap ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-green-600 dark:text-green-400 font-work-sans">sitemap.xml - Found</span>
                      {analysisResult.existingFiles.sitemap.url && (
                        <a 
                          href={analysisResult.existingFiles.sitemap.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-400 text-sm underline font-work-sans"
                        >
                          View File
                        </a>
                      )}
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-yellow-500" />
                      <span className="text-yellow-600 dark:text-yellow-400 font-work-sans">sitemap.xml - Not Found</span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {analysisResult.technical.sslEnabled ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-green-600 dark:text-green-400 font-work-sans">HTTPS Enabled</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span className="text-red-600 dark:text-red-400 font-work-sans">HTTPS Not Enabled</span>
                    </>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-charcoal/70 dark:text-silver font-orbitron">Discovered Pages</label>
                  <p className="text-charcoal dark:text-white font-work-sans">{analysisResult.crawledPages.length} pages found</p>
                </div>
              </div>
            </div>

            {/* Assets Summary */}
            <div className="mt-8 pt-6 border-t border-gold/20 dark:border-gold/30">
              <h4 className="text-lg font-medium mb-4 text-gold font-orbitron">Discovered Assets</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500 font-orbitron">{analysisResult.assets.stylesheets.length}</div>
                  <div className="text-sm text-charcoal/70 dark:text-silver font-work-sans">CSS Files</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500 font-orbitron">{analysisResult.assets.scripts.length}</div>
                  <div className="text-sm text-charcoal/70 dark:text-silver font-work-sans">JS Files</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500 font-orbitron">{analysisResult.assets.images.length}</div>
                  <div className="text-sm text-charcoal/70 dark:text-silver font-work-sans">Images</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500 font-orbitron">{analysisResult.assets.fonts.length}</div>
                  <div className="text-sm text-charcoal/70 dark:text-silver font-work-sans">Fonts</div>
                </div>
              </div>
            </div>

            {/* Errors */}
            {analysisResult.errors.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gold/20 dark:border-gold/30">
                <h4 className="text-lg font-medium mb-4 text-red-500 font-orbitron">Issues Found</h4>
                <ul className="space-y-2">
                  {analysisResult.errors.map((error, index) => (
                    <li key={index} className="text-sm text-red-600 dark:text-red-400 font-work-sans">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Online;