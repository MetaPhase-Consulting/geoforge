import React, { useState } from 'react';
import { Globe, Download, CheckCircle, AlertCircle, Loader2, Settings, FileText, Zap, X } from 'lucide-react';
import { WebsiteAnalyzer, type AnalysisConfig, type AnalysisResult } from '../services/websiteAnalyzer';
import { ZipGenerator } from '../services/zipGenerator';
import { AGENTS, getAgentsByType, getTypeBadge, type Agent, type AgentType } from '../config/agents';

// Create default agent choices from AGENTS configuration
const createDefaultAgentChoices = (): Record<string, boolean> => {
  const choices: Record<string, boolean> = {};
  AGENTS.forEach(agent => {
    choices[agent.id] = agent.defaultEnabled;
  });
  return choices;
};

export default function Online() {
  const [config, setConfig] = useState<AnalysisConfig>({
    url: '',
    siteName: '',
    allowTraining: false,
    agents: createDefaultAgentChoices(),
    includeHumans: true,
    includeSitemap: true,
    includeAssets: {
      html: true,
      css: true,
      js: true,
      images: false,
      fonts: false
    },
    compression: 'standard'
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [analysisProgress, setAnalysisProgress] = useState({ progress: 0, status: '' });
  const [generationProgress, setGenerationProgress] = useState({ progress: 0, status: '' });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [analyzer, setAnalyzer] = useState<WebsiteAnalyzer | null>(null);
  const [originalUrl, setOriginalUrl] = useState('');

  const formatUrl = (url: string): string => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return '';
    
    // Check if URL already has protocol
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      return trimmedUrl;
    }
    
    // Default to HTTPS for security
    return `https://${trimmedUrl}`;
  };

  const handleUrlChange = (inputUrl: string) => {
    setOriginalUrl(inputUrl);
    const formattedUrl = formatUrl(inputUrl);
    setConfig(prev => ({ ...prev, url: formattedUrl }));
  };
  const handleAnalyze = async () => {
    if (!config.url) {
      setError('Please enter a valid URL');
      return;
    }

    // Validate URL format
    try {
      new URL(config.url);
    } catch {
      setError('Please enter a valid URL (including http:// or https://)');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setAnalysisResult(null);
    setAnalysisProgress({ progress: 0, status: 'Starting analysis...' });

    const websiteAnalyzer = new WebsiteAnalyzer(config);
    setAnalyzer(websiteAnalyzer);

    try {
      const result = await websiteAnalyzer.analyze((progress, status) => {
        setAnalysisProgress({ progress, status });
      });
      
      setAnalysisResult(result);
      
      // Always override site name with page title
      if (result.metadata.title) {
        const cleanTitle = result.metadata.title.replace(/\s*\|\s*.*$/, '').trim(); // Remove " | Site Name" suffixes
        console.log('📝 Setting site name from page title:', cleanTitle);
        setConfig(prev => ({ ...prev, siteName: cleanTitle }));
      } else {
        console.log('⚠️ No page title found, keeping existing site name');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed. Please check the URL and try again.';
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
      setAnalyzer(null);
    }
  };

  const handleGenerate = async () => {
    console.log('🚀 Starting ZIP generation...');
    console.log('📋 Config:', config);
    console.log('📊 Analysis Result:', analysisResult);
    
    if (!analysisResult) {
      const errorMsg = 'Please analyze your website first';
      console.error('❌ No analysis result available:', errorMsg);
      setError(errorMsg);
      return;
    }

    setIsGenerating(true);
    setError('');
    setGenerationProgress({ progress: 0, status: 'Preparing files...' });

    try {
      console.log('📦 Creating ZipGenerator instance...');
      const zipGenerator = new ZipGenerator(config, analysisResult);
      
      console.log('⚙️ Starting generateAndDownload...');
      await zipGenerator.generateAndDownload((progress, status) => {
        console.log(`📈 Progress: ${progress}% - ${status}`);
        setGenerationProgress({ progress, status });
      });
      
      console.log('✅ ZIP generation completed successfully!');
    } catch (err) {
      console.error('💥 ZIP generation failed:', err);
      console.error('🔍 Error details:', {
        name: err instanceof Error ? err.name : 'Unknown',
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : 'No stack trace'
      });
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate files. Please try again.';
      console.error('📝 Setting error message:', errorMessage);
      setError(errorMessage);
    } finally {
      console.log('🏁 ZIP generation process finished');
      setIsGenerating(false);
    }
  };

  const handleCancel = () => {
    if (analyzer) {
      analyzer.abort();
      setIsAnalyzing(false);
      setAnalyzer(null);
    }
  };

  const updateAgent = (id: string, enabled: boolean) => {
    setConfig(prev => ({
      ...prev,
      agents: { ...prev.agents, [id]: enabled }
    }));
  };

  const getAnalysisStatusColor = (status: string) => {
    if (status === 'success') return 'text-green-600 dark:text-green-400';
    if (status === 'error') return 'text-red-600 dark:text-red-400';
    return 'text-charcoal dark:text-white';
  };

  const renderAgentSection = (title: string, agents: Agent[], description?: string) => (
    <div className="mb-8">
      <h3 className="font-orbitron font-semibold text-charcoal dark:text-white mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-charcoal/60 dark:text-silver/80 mb-4">{description}</p>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {agents.map((agent) => {
          const badge = getTypeBadge(agent.type);
          return (
            <div key={agent.id} className="flex items-start space-x-3 p-4 border border-silver/20 dark:border-silver/30 rounded-lg bg-white dark:bg-matte-bg">
              <input
                type="checkbox"
                id={agent.id}
                checked={config.agents[agent.id] ?? agent.defaultEnabled}
                onChange={(e) => updateAgent(agent.id, e.target.checked)}
                className="mt-1 w-5 h-5 text-gold bg-white dark:bg-matte-bg border-gold/30 dark:border-gold/40 rounded focus:ring-gold focus:ring-2"
                style={{ accentColor: '#FFD700' }}
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <label htmlFor={agent.id} className="block font-work-sans font-medium text-charcoal dark:text-white cursor-pointer">
                    {agent.label}
                  </label>
                  <span className={`px-2 py-1 text-xs font-mono font-bold rounded ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>
                <p className="text-sm text-charcoal/70 dark:text-silver">{agent.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-matte-bg py-12">
      <div className="container mx-auto px-6 max-w-5xl">
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-orbitron text-2xl font-bold text-charcoal dark:text-white">
                Website Analysis
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-work-sans font-medium text-charcoal dark:text-white mb-2">
                    Website URL *
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-silver dark:text-silver" />
                    <input
                      type="url"
                      value={config.url}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full pl-12 pr-4 py-3 border border-silver/30 dark:border-silver/40 rounded-lg bg-white dark:bg-matte-bg text-charcoal dark:text-white font-work-sans focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-colors placeholder:text-charcoal/50 dark:placeholder:text-silver/60"
                      disabled={isAnalyzing}
                    />
                  </div>
                  
                  {/* URL Format Indicator */}
                  {originalUrl && originalUrl !== config.url && (
                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
                      <div className="text-sm font-work-sans">
                        <div className="text-blue-700 dark:text-blue-200">
                          <span className="font-medium">Original:</span> {originalUrl}
                        </div>
                        <div className="text-blue-700 dark:text-blue-200">
                          <span className="font-medium">Updated:</span> {config.url}
                        </div>
                        <div className="text-blue-600 dark:text-blue-300 text-xs mt-1">
                          ✓ Added HTTPS protocol for security
                        </div>
                      </div>
                    </div>
                  )}
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
                    disabled={isAnalyzing}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !config.url}
                  className="px-8 py-3 bg-gold text-charcoal dark:text-charcoal font-orbitron font-semibold rounded-lg hover:bg-gold-light dark:hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Analyze Website</span>
                    </>
                  )}
                </button>

                {isAnalyzing && (
                  <button
                    onClick={handleCancel}
                    className="px-4 py-3 bg-red-600 text-white font-work-sans font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>

              {/* Analysis Progress */}
              {isAnalyzing && (
                <div className="mt-4 p-4 bg-gold/10 dark:bg-gold/20 border border-gold/30 dark:border-gold/40 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-work-sans text-sm text-charcoal dark:text-white">
                      {analysisProgress.status}
                    </span>
                    <span className="font-work-sans text-sm text-charcoal dark:text-white">
                      {analysisProgress.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-silver/20 dark:bg-silver/30 rounded-full h-2">
                    <div 
                      className="bg-gold h-2 rounded-full transition-all duration-300"
                      style={{ width: `${analysisProgress.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <div className="text-red-700 dark:text-red-200 font-work-sans">
                  <div className="font-semibold mb-1">Analysis Failed</div>
                  <div className="text-sm whitespace-pre-line">{error}</div>
                </div>
              </div>
            )}

            {/* Analysis Results */}
            {analysisResult && (
              <div className="mt-6 p-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="font-orbitron font-semibold text-green-700 dark:text-green-200">Analysis Complete</span>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm font-work-sans">
                  <div className="bg-white dark:bg-charcoal p-3 rounded-lg">
                    <div className="text-charcoal/70 dark:text-silver">Status Code</div>
                    <div className={`font-semibold ${analysisResult.technical.statusCode === 200 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {analysisResult.technical.statusCode}
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-charcoal p-3 rounded-lg">
                    <div className="text-charcoal/70 dark:text-silver">Response Time</div>
                    <div className="font-semibold text-charcoal dark:text-white">
                      {Math.round(analysisResult.technical.responseTime)}ms
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-charcoal p-3 rounded-lg">
                    <div className="text-charcoal/70 dark:text-silver">SSL Enabled</div>
                    <div className={`font-semibold ${analysisResult.technical.sslEnabled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {analysisResult.technical.sslEnabled ? 'Yes' : 'No'}
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-charcoal p-3 rounded-lg">
                    <div className="text-charcoal/70 dark:text-silver text-sm">Content Length</div>
                    <div className="font-semibold text-charcoal dark:text-white">
                      {Math.round(analysisResult.technical.contentLength / 1024)}KB
                    </div>
                  </div>
                </div>

                {analysisResult.metadata.title && (
                  <div className="mt-4 p-3 bg-white dark:bg-charcoal rounded-lg">
                    <div className="text-charcoal/70 dark:text-silver text-sm">Page Title</div>
                    <div className="font-semibold text-charcoal dark:text-white">{analysisResult.metadata.title}</div>
                  </div>
                )}

                {/* Existing Files Check */}
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-white dark:bg-charcoal rounded-lg">
                    <div className="text-charcoal/70 dark:text-silver text-sm">Robots.txt</div>
                    <div className={`font-semibold ${analysisResult.technical.hasRobots ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                      {analysisResult.technical.hasRobots ? (
                        <a href={analysisResult.existingFiles.robotsTxt.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Found - View File
                        </a>
                      ) : (
                        'Not Found'
                      )}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white dark:bg-charcoal rounded-lg">
                    <div className="text-charcoal/70 dark:text-silver text-sm">Sitemap.xml</div>
                    <div className={`font-semibold ${analysisResult.technical.hasSitemap ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                      {analysisResult.technical.hasSitemap ? (
                        <a href={analysisResult.existingFiles.sitemap.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Found - View File
                        </a>
                      ) : (
                        'Not Found'
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Configuration Section */}
          <div className="bg-white dark:bg-charcoal rounded-2xl p-8 border border-gold/20 dark:border-gold/30">
            <h2 className="font-orbitron text-2xl font-bold text-charcoal dark:text-white mb-6">
              Configuration
            </h2>

            <div className="space-y-6">
              {/* Agent Configuration */}
              {renderAgentSection(
                "AI Crawlers", 
                [...getAgentsByType("training-crawler"), ...getAgentsByType("live-search-indexer")],
                "Automated crawlers that index and train on your content"
              )}
              
              {renderAgentSection(
                "On-Demand Fetchers", 
                getAgentsByType("on-demand-fetch"),
                "User-triggered fetchers that may bypass robots.txt"
              )}
              
              {renderAgentSection(
                "Policy Tokens", 
                getAgentsByType("policy-token"),
                "Special robots.txt tokens that control AI training usage"
              )}

              {/* Basic Options */}
              <div className="border-t border-silver/20 dark:border-silver/30 pt-6">
                <h3 className="font-orbitron font-semibold text-charcoal dark:text-white mb-4">Options</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={config.allowTraining}
                        onChange={(e) => setConfig(prev => ({ ...prev, allowTraining: e.target.checked }))}
                        className="w-5 h-5 text-gold bg-white dark:bg-matte-bg border-gold/30 dark:border-gold/40 rounded focus:ring-gold focus:ring-2"
                        style={{ accentColor: '#FFD700' }}
                      />
                      <span className="font-work-sans text-charcoal dark:text-white">Allow AI training on content</span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={config.includeHumans}
                        onChange={(e) => setConfig(prev => ({ ...prev, includeHumans: e.target.checked }))}
                        className="w-5 h-5 text-gold bg-white dark:bg-matte-bg border-gold/30 dark:border-gold/40 rounded focus:ring-gold focus:ring-2"
                        style={{ accentColor: '#FFD700' }}
                      />
                      <span className="font-work-sans text-charcoal dark:text-white">Include humans.txt</span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={config.includeSitemap}
                        onChange={(e) => setConfig(prev => ({ ...prev, includeSitemap: e.target.checked }))}
                        className="w-5 h-5 text-gold bg-white dark:bg-matte-bg border-gold/30 dark:border-gold/40 rounded focus:ring-gold focus:ring-2"
                        style={{ accentColor: '#FFD700' }}
                      />
                      <span className="font-work-sans text-charcoal dark:text-white">Generate enhanced sitemap</span>
                    </label>
                  </div>

                  <div className="space-y-4">
                  </div>
                </div>
              </div>

              {/* Advanced Settings Toggle */}
              <div className="border-t border-silver/20 dark:border-silver/30 pt-6">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center space-x-2 text-gold hover:text-gold-light dark:hover:text-gold-light transition-colors font-work-sans"
                >
                  <Settings className="w-5 h-5" />
                  <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Settings</span>
                </button>
              </div>

              {/* Advanced Options */}
              {showAdvanced && (
                <div className="pt-4">
                  <h3 className="font-orbitron font-semibold text-charcoal dark:text-white mb-4">Advanced Settings</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-work-sans font-medium text-charcoal dark:text-white mb-3">Include Assets</h4>
                      <div className="space-y-2">
                        {Object.entries(config.includeAssets).map(([key, value]) => (
                          <label key={key} className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => setConfig(prev => ({
                                ...prev,
                                includeAssets: { ...prev.includeAssets, [key]: e.target.checked }
                              }))}
                              className="w-4 h-4 text-gold bg-white dark:bg-matte-bg border-gold/30 dark:border-gold/40 rounded focus:ring-gold focus:ring-2"
                              style={{ accentColor: '#FFD700' }}
                            />
                            <span className="font-work-sans text-sm text-charcoal dark:text-white capitalize">{key}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-work-sans font-medium text-charcoal dark:text-white mb-2">
                        Compression Level
                      </label>
                      <select
                        value={config.compression}
                        onChange={(e) => setConfig(prev => ({ ...prev, compression: e.target.value as 'none' | 'standard' | 'maximum' }))}
                        className="w-full px-4 py-2 border border-silver/30 dark:border-silver/40 rounded-lg bg-white dark:bg-matte-bg text-charcoal dark:text-white font-work-sans focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                      >
                        <option value="none">None (Fastest)</option>
                        <option value="standard">Standard (Balanced)</option>
                        <option value="maximum">Maximum (Smallest)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
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
                  <FileText className="w-6 h-6" />
                  <span>Generate & Download ZIP</span>
                </>
              )}
            </button>
            
            {/* Generation Progress */}
            {isGenerating && (
              <div className="mt-6 max-w-md mx-auto p-4 bg-gold/10 dark:bg-gold/20 border border-gold/30 dark:border-gold/40 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-work-sans text-sm text-charcoal dark:text-white">
                    {generationProgress.status}
                  </span>
                  <span className="font-work-sans text-sm text-charcoal dark:text-white">
                    {generationProgress.progress}%
                  </span>
                </div>
                <div className="w-full bg-silver/20 dark:bg-silver/30 rounded-full h-2">
                  <div 
                    className="bg-gold h-2 rounded-full transition-all duration-300"
                    style={{ width: `${generationProgress.progress}%` }}
                  />
                </div>
              </div>
            )}
            
            {/* Error Display */}
            {error && (
              <div className="mt-4 max-w-md mx-auto p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-work-sans font-medium text-red-800 dark:text-red-200">
                      Generation Error
                    </h3>
                    <p className="mt-1 text-sm text-red-700 dark:text-red-300 font-work-sans">
                      {error}
                    </p>
                    <button
                      onClick={() => setError('')}
                      className="mt-2 text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 font-work-sans underline"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {!analysisResult && !isAnalyzing && (
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