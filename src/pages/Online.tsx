import React, { useState } from 'react';
import { Download, Terminal, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { WebsiteAnalyzer } from '../services/websiteAnalyzer';
import { ZipGenerator } from '../services/zipGenerator';

interface AnalysisResult {
  url: string;
  siteName: string;
  title: string;
  description: string;
  hasRobots: boolean;
  robotsContent?: string;
  robotsUrl?: string;
  hasSitemap: boolean;
  sitemapContent?: string;
  sitemapUrl?: string;
  contentLength: number;
  responseTime: number;
  isSecure: boolean;
  discoveredPages: string[];
  assets: {
    css: string[];
    js: string[];
    images: string[];
    fonts: string[];
  };
}

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
    css: boolean;
    js: boolean;
    images: boolean;
    fonts: boolean;
  };
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
    css: true,
    js: true,
    images: true,
    fonts: true,
  },
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

    try {
      const analyzer = new WebsiteAnalyzer();
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await analyzer.analyze(formattedUrl, config);
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      setAnalysisResult(result);
      setSiteName(result.siteName || result.title || 'Website');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setAnalysisProgress(0), 1000);
    }
  };

  const generateZip = async () => {
    if (!analysisResult) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const generator = new ZipGenerator();
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 15, 90));
      }, 300);

      await generator.generateAndDownload(analysisResult, config, siteName);
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ZIP generation failed');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Download className="w-12 h-12 text-gold" />
            <h1 className="text-5xl font-bold text-gold">Online Tool</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Analyze any website and generate comprehensive AI optimization files. 
            Get robots.txt, sitemap.xml, and AI crawler configurations in one downloadable package.
          </p>
        </div>

        {/* URL Input */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <label className="block text-lg font-semibold mb-3 text-gold">
              Website URL
            </label>
            <input
              type="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="Enter website URL (e.g., example.com)"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            />
            
            {urlChanged && (
              <div className="mt-3 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
                <p className="text-sm text-blue-300">
                  <strong>Original:</strong> {url}
                </p>
                <p className="text-sm text-blue-300">
                  <strong>Updated:</strong> {formattedUrl}
                </p>
                <p className="text-xs text-blue-400 mt-1">
                  ✓ Added HTTPS protocol for security
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Site Name */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <label className="block text-lg font-semibold mb-3 text-gold">
              Site Name
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Enter site name (will be auto-filled from analysis)"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            />
          </div>
        </div>

        {/* Configuration */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-xl font-semibold mb-6 text-gold">Configuration</h3>
            
            {/* AI Crawlers */}
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-4 text-white">AI Crawlers</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries({
                  gptbot: { name: 'GPTBot', desc: "OpenAI's web crawler for ChatGPT training" },
                  claudebot: { name: 'ClaudeBot', desc: "Anthropic's web crawler for Claude training" },
                  perplexitybot: { name: 'PerplexityBot', desc: 'Perplexity AI search crawler' },
                  googleExtended: { name: 'Google-Extended', desc: "Google's AI training crawler (Bard/Gemini)" },
                  applebotExtended: { name: 'Applebot-Extended', desc: "Apple's AI crawler for training" },
                  bingbot: { name: 'BingBot', desc: "Microsoft's search and AI crawler" },
                }).map(([key, info]) => (
                  <div key={key} className="border border-gray-700 rounded-lg p-4">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.llms[key as keyof Config['llms']]}
                        onChange={(e) => handleLLMChange(key as keyof Config['llms'], e.target.checked)}
                        className="mt-1 border-2 border-gold/50 rounded focus:ring-gold/50"
                        style={{ 
                          accentColor: '#F5DFA2',
                          filter: 'hue-rotate(10deg) saturate(1.2)'
                        }}
                      />
                      <div>
                        <div className="font-medium text-white">{info.name}</div>
                        <div className="text-sm text-gray-400">{info.desc}</div>
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
                  className="border-2 border-gold/50 rounded focus:ring-gold/50"
                  style={{ 
                    accentColor: '#F5DFA2',
                    filter: 'hue-rotate(10deg) saturate(1.2)'
                  }}
                />
                <span className="text-white">Allow AI Training</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeHumans}
                  onChange={(e) => handleConfigChange('includeHumans', e.target.checked)}
                  className="border-2 border-gold/50 rounded focus:ring-gold/50"
                  style={{ 
                    accentColor: '#F5DFA2',
                    filter: 'hue-rotate(10deg) saturate(1.2)'
                  }}
                />
                <span className="text-white">Include humans.txt</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeSitemap}
                  onChange={(e) => handleConfigChange('includeSitemap', e.target.checked)}
                  className="border-2 border-gold/50 rounded focus:ring-gold/50"
                  style={{ 
                    accentColor: '#F5DFA2',
                    filter: 'hue-rotate(10deg) saturate(1.2)'
                  }}
                />
                <span className="text-white">Generate sitemap.xml</span>
              </label>
            </div>

            {/* Show/Hide Advanced Settings */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="mb-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-white transition-colors"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
            </button>

            {/* Advanced Settings */}
            {showAdvanced && (
              <div className="space-y-6 pt-4 border-t border-gray-700">
                {/* Audit Mode */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gold">Analysis Mode</label>
                  <select
                    value={config.auditMode}
                    onChange={(e) => handleConfigChange('auditMode', e.target.value as 'basic' | 'full')}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gold"
                  >
                    <option value="basic">Basic (Single Page)</option>
                    <option value="full">Full Site Audit</option>
                  </select>
                </div>

                {/* Asset Inclusion */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-gold">Include Assets</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries({
                      css: 'CSS Files',
                      js: 'JavaScript Files',
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
                        <span className="text-sm text-white">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Compression */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gold">ZIP Compression</label>
                  <select
                    value={config.compression}
                    onChange={(e) => handleConfigChange('compression', e.target.value as Config['compression'])}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gold"
                  >
                    <option value="none">No Compression</option>
                    <option value="standard">Standard Compression</option>
                    <option value="maximum">Maximum Compression</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={analyzeWebsite}
              disabled={isAnalyzing || !formattedUrl}
              className="flex-1 px-6 py-3 bg-gold hover:bg-gold/90 disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
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
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
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
        </div>

        {/* Progress Bars */}
        {(isAnalyzing || isGenerating) && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              {isAnalyzing && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gold">Analyzing Website</span>
                    <span className="text-sm text-gray-400">{analysisProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gold h-2 rounded-full transition-all duration-300"
                      style={{ width: `${analysisProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {isGenerating && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-green-400">Generating ZIP Package</span>
                    <span className="text-sm text-gray-400">{generationProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-300">{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-6 text-gold">Analysis Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Site Title</label>
                    <p className="text-white">{analysisResult.title}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-400">Description</label>
                    <p className="text-white text-sm">{analysisResult.description || 'No description found'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-400">Content Length</label>
                    <p className="text-white">{analysisResult.contentLength.toLocaleString()} characters</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-400">Response Time</label>
                    <p className="text-white">{analysisResult.responseTime}ms</p>
                  </div>
                </div>

                {/* File Status */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    {analysisResult.hasRobots ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-400">robots.txt</span>
                        <a 
                          href={analysisResult.robotsUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm underline"
                        >
                          View File
                        </a>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-yellow-400" />
                        <span className="text-yellow-400">robots.txt - Not Found</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {analysisResult.hasSitemap ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-400">sitemap.xml</span>
                        <a 
                          href={analysisResult.sitemapUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm underline"
                        >
                          View File
                        </a>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-yellow-400" />
                        <span className="text-yellow-400">sitemap.xml - Not Found</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {analysisResult.isSecure ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-400">HTTPS Enabled</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-400" />
                        <span className="text-red-400">HTTPS Not Enabled</span>
                      </>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-400">Discovered Pages</label>
                    <p className="text-white">{analysisResult.discoveredPages.length} pages found</p>
                  </div>
                </div>
              </div>

              {/* Assets Summary */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="text-lg font-medium mb-4 text-gold">Discovered Assets</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{analysisResult.assets.css.length}</div>
                    <div className="text-sm text-gray-400">CSS Files</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{analysisResult.assets.js.length}</div>
                    <div className="text-sm text-gray-400">JS Files</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{analysisResult.assets.images.length}</div>
                    <div className="text-sm text-gray-400">Images</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{analysisResult.assets.fonts.length}</div>
                    <div className="text-sm text-gray-400">Fonts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Online;