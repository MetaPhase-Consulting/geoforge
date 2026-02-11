import React, { useMemo, useState } from 'react';
import { Globe, Download, CheckCircle, AlertCircle, Loader2, Settings, FileText, Zap, X } from 'lucide-react';
import { WebsiteAnalyzer, type AnalysisConfig, type AnalysisResult } from '../services/websiteAnalyzer';
import { ZipGenerator } from '../services/zipGenerator';
import { AGENTS, getAgentsByType, getTypeBadge, type Agent } from '../config/agents';
import type { GeneratedArtifact, GenerationProfile } from '../shared/types';

const createDefaultAgentChoices = (): Record<string, boolean> => {
  const choices: Record<string, boolean> = {};
  AGENTS.forEach((agent) => {
    choices[agent.id] = agent.defaultEnabled;
  });
  return choices;
};

const PROFILE_OPTIONS: { value: GenerationProfile; label: string; description: string }[] = [
  { value: 'strict-privacy', label: 'Strict Privacy', description: 'Blocks training and policy-token agents by default.' },
  { value: 'balanced', label: 'Balanced', description: 'Default mix of crawl controls for most sites.' },
  { value: 'open-discovery', label: 'Open Discovery', description: 'Allows broad indexing/training where possible.' }
];

const PREVIEW_FILES = ['robots.txt', 'sitemap.xml', '.well-known/ai.txt', '.well-known/security.txt'] as const;

function applyProfile(profile: GenerationProfile, currentAgents: Record<string, boolean>) {
  if (profile === 'strict-privacy') {
    return {
      allowTraining: false,
      agents: Object.keys(currentAgents).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as Record<string, boolean>)
    };
  }

  if (profile === 'open-discovery') {
    return {
      allowTraining: true,
      agents: Object.keys(currentAgents).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as Record<string, boolean>)
    };
  }

  return {
    allowTraining: false,
    agents: createDefaultAgentChoices()
  };
}

export default function Online() {
  const [config, setConfig] = useState<AnalysisConfig>({
    url: '',
    siteName: '',
    allowTraining: false,
    profile: 'balanced',
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
  const [error, setError] = useState('');
  const [analysisProgress, setAnalysisProgress] = useState({ progress: 0, status: '' });
  const [generationProgress, setGenerationProgress] = useState({ progress: 0, status: '' });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [analyzer, setAnalyzer] = useState<WebsiteAnalyzer | null>(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [siteNameTouched, setSiteNameTouched] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<string>('robots.txt');
  const [selectedDownloads, setSelectedDownloads] = useState<Record<string, boolean>>({});

  const formatUrl = (url: string): string => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return '';
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) return trimmedUrl;
    return `https://${trimmedUrl}`;
  };

  const handleUrlChange = (inputUrl: string) => {
    setOriginalUrl(inputUrl);
    const formattedUrl = formatUrl(inputUrl);
    setConfig((prev) => ({ ...prev, url: formattedUrl }));
  };

  const handleProfileChange = (profile: GenerationProfile) => {
    const profileResult = applyProfile(profile, config.agents);
    setConfig((prev) => ({
      ...prev,
      profile,
      allowTraining: profileResult.allowTraining,
      agents: profileResult.agents
    }));
  };

  const handleAnalyze = async () => {
    if (!config.url) {
      setError('Please enter a valid URL');
      return;
    }

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

      if (!siteNameTouched && result.metadata.title) {
        const cleanTitle = result.metadata.title.replace(/\s*\|\s*.*$/, '').trim();
        setConfig((prev) => ({ ...prev, siteName: cleanTitle }));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed. Please check the URL and try again.';
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
      setAnalyzer(null);
    }
  };

  const generator = useMemo(() => {
    if (!analysisResult) return null;
    return new ZipGenerator(config, analysisResult);
  }, [analysisResult, config]);

  const artifacts = useMemo<GeneratedArtifact[]>(() => {
    if (!generator) return [];
    return generator.getArtifacts();
  }, [generator]);

  const previewArtifact = useMemo(() => artifacts.find((item) => item.name === selectedPreview), [artifacts, selectedPreview]);

  const existingContent = useMemo(() => {
    if (!analysisResult) return '';
    if (selectedPreview === 'robots.txt') return analysisResult.existingFiles.robotsTxt.content || '';
    if (selectedPreview === 'sitemap.xml') return analysisResult.existingFiles.sitemap.content || '';
    return '';
  }, [analysisResult, selectedPreview]);

  const handleGenerateZip = async () => {
    if (!generator) {
      setError('Please analyze your website first');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGenerationProgress({ progress: 0, status: 'Preparing files...' });

    try {
      await generator.generateAndDownload((progress, status) => {
        setGenerationProgress({ progress, status });
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate files. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSingleDownload = async (fileName: string) => {
    if (!generator) return;

    try {
      await generator.downloadSingleFile(fileName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download file.');
    }
  };

  const handleDownloadSelected = async () => {
    if (!generator) return;
    const fileNames = Object.entries(selectedDownloads)
      .filter(([, enabled]) => enabled)
      .map(([name]) => name);

    try {
      await generator.downloadSelectedFiles(fileNames);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download selected files.');
    }
  };

  const handleCancel = () => {
    if (!analyzer) return;
    analyzer.abort();
    setIsAnalyzing(false);
    setAnalyzer(null);
  };

  const updateAgent = (id: string, enabled: boolean) => {
    setConfig((prev) => ({
      ...prev,
      agents: { ...prev.agents, [id]: enabled }
    }));
  };

  const renderAgentSection = (title: string, agents: Agent[], description?: string) => (
    <div className="mb-8">
      <h3 className="font-orbitron font-semibold text-charcoal dark:text-white mb-2">{title}</h3>
      {description && <p className="text-sm text-charcoal/60 dark:text-silver mb-4">{description}</p>}
      <div className="grid md:grid-cols-2 gap-4">
        {agents.map((agent) => {
          const badge = getTypeBadge(agent.type);
          return (
            <div
              key={agent.id}
              className="flex items-start space-x-3 p-4 border border-silver/20 dark:border-silver/30 rounded-lg bg-white dark:bg-matte-bg"
            >
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
                  <span className={`px-2 py-1 text-xs font-mono font-bold rounded ${badge.color}`}>{badge.label}</span>
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
          <p className="text-xl text-charcoal/70 dark:text-silver font-work-sans">Analyze your website and forge AI-ready optimization files</p>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-charcoal rounded-2xl p-8 border border-gold/20 dark:border-gold/30">
            <h2 className="font-orbitron text-2xl font-bold text-charcoal dark:text-white mb-6">Website Analysis</h2>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="website-url" className="block text-sm font-work-sans font-medium text-charcoal dark:text-white mb-2">
                    Website URL *
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-silver dark:text-silver" />
                    <input
                      id="website-url"
                      type="url"
                      value={config.url}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full pl-12 pr-4 py-3 border border-silver/30 dark:border-silver/40 rounded-lg bg-white dark:bg-matte-bg text-charcoal dark:text-white"
                      disabled={isAnalyzing}
                    />
                  </div>
                  {originalUrl && originalUrl !== config.url && (
                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-xs text-blue-700 dark:text-blue-200">
                      Added HTTPS protocol for security: <code>{config.url}</code>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="site-name" className="block text-sm font-work-sans font-medium text-charcoal dark:text-white mb-2">
                    Site Name
                  </label>
                  <input
                    id="site-name"
                    type="text"
                    value={config.siteName}
                    onChange={(e) => {
                      setSiteNameTouched(true);
                      setConfig((prev) => ({ ...prev, siteName: e.target.value }));
                    }}
                    placeholder="My Awesome Website"
                    className="w-full px-4 py-3 border border-silver/30 dark:border-silver/40 rounded-lg bg-white dark:bg-matte-bg text-charcoal dark:text-white"
                    disabled={isAnalyzing}
                  />
                </div>
              </div>

              <div>
                <p className="block text-sm font-work-sans font-medium text-charcoal dark:text-white mb-2">Generation Profile</p>
                <div className="grid md:grid-cols-3 gap-3">
                  {PROFILE_OPTIONS.map((profile) => (
                    <button
                      key={profile.value}
                      type="button"
                      onClick={() => handleProfileChange(profile.value)}
                      id={`generation-profile-${profile.value}`}
                      aria-pressed={config.profile === profile.value}
                      className={`text-left p-3 rounded-lg border ${config.profile === profile.value ? 'border-gold bg-gold/10' : 'border-silver/30'}`}
                    >
                      <div className="font-semibold text-charcoal dark:text-white">{profile.label}</div>
                      <div className="text-xs text-charcoal/70 dark:text-silver">{profile.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !config.url}
                  className="px-8 py-3 bg-gold text-charcoal font-orbitron font-semibold rounded-lg disabled:opacity-50 flex items-center space-x-2"
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
                  <button onClick={handleCancel} className="px-4 py-3 bg-red-600 text-white rounded-lg flex items-center space-x-2">
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>

              {isAnalyzing && (
                <div aria-live="polite" className="mt-4 p-4 bg-gold/10 border border-gold/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span>{analysisProgress.status}</span>
                    <span>{analysisProgress.progress}%</span>
                  </div>
                  <div className="w-full bg-silver/20 rounded-full h-2">
                    <div className="bg-gold h-2 rounded-full" style={{ width: `${analysisProgress.progress}%` }} />
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div role="alert" aria-live="assertive" className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <div className="text-red-700 dark:text-red-200 font-work-sans text-sm whitespace-pre-line">{error}</div>
              </div>
            )}

            {analysisResult && (
              <div className="mt-6 p-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="font-orbitron font-semibold text-green-700 dark:text-green-200">Analysis Complete</span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm font-work-sans">
                  <div className="bg-white dark:bg-charcoal p-3 rounded-lg">
                    <div className="text-charcoal/70 dark:text-silver">Status Code</div>
                    <div className="font-semibold text-charcoal dark:text-white">{analysisResult.technical.statusCode}</div>
                  </div>
                  <div className="bg-white dark:bg-charcoal p-3 rounded-lg">
                    <div className="text-charcoal/70 dark:text-silver">Response Time</div>
                    <div className="font-semibold text-charcoal dark:text-white">{Math.round(analysisResult.technical.responseTime)}ms</div>
                  </div>
                  <div className="bg-white dark:bg-charcoal p-3 rounded-lg">
                    <div className="text-charcoal/70 dark:text-silver">SSL Enabled</div>
                    <div className="font-semibold text-charcoal dark:text-white">{analysisResult.technical.sslEnabled ? 'Yes' : 'No'}</div>
                  </div>
                  <div className="bg-white dark:bg-charcoal p-3 rounded-lg">
                    <div className="text-charcoal/70 dark:text-silver">Load Metric</div>
                    <div className="font-semibold text-charcoal dark:text-white">
                      {analysisResult.performance.loadTime ? `${Math.round(analysisResult.performance.loadTime)}ms` : 'Not measured'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-charcoal rounded-2xl p-8 border border-gold/20 dark:border-gold/30">
            <h2 className="font-orbitron text-2xl font-bold text-charcoal dark:text-white mb-6">Configuration</h2>
            <div className="space-y-6">
              {renderAgentSection('AI Crawlers', [...getAgentsByType('training-crawler'), ...getAgentsByType('live-search-indexer')])}
              {renderAgentSection('On-Demand Fetchers', getAgentsByType('on-demand-fetch'))}
              {renderAgentSection('Policy Tokens', getAgentsByType('policy-token'))}

              <div className="border-t border-silver/20 dark:border-silver/30 pt-6">
                <h3 className="font-orbitron font-semibold text-charcoal dark:text-white mb-4">Options</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" checked={config.allowTraining} onChange={(e) => setConfig((prev) => ({ ...prev, allowTraining: e.target.checked }))} />
                      <span className="font-work-sans text-charcoal dark:text-white">Allow AI training on content</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" checked={config.includeHumans} onChange={(e) => setConfig((prev) => ({ ...prev, includeHumans: e.target.checked }))} />
                      <span className="font-work-sans text-charcoal dark:text-white">Include humans.txt</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" checked={config.includeSitemap} onChange={(e) => setConfig((prev) => ({ ...prev, includeSitemap: e.target.checked }))} />
                      <span className="font-work-sans text-charcoal dark:text-white">Generate enhanced sitemap</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-silver/20 dark:border-silver/30 pt-6">
                <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center space-x-2 text-gold">
                  <Settings className="w-5 h-5" />
                  <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Settings</span>
                </button>
              </div>

              {showAdvanced && (
                <div className="pt-4">
                  <label className="block text-sm font-work-sans font-medium text-charcoal dark:text-white mb-2">Compression Level</label>
                  <select
                    value={config.compression}
                    onChange={(e) => setConfig((prev) => ({ ...prev, compression: e.target.value as 'none' | 'standard' | 'maximum' }))}
                    className="w-full px-4 py-2 border border-silver/30 rounded-lg bg-white dark:bg-matte-bg"
                  >
                    <option value="none">None (Fastest)</option>
                    <option value="standard">Standard (Balanced)</option>
                    <option value="maximum">Maximum (Smallest)</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {analysisResult && (
            <div className="bg-white dark:bg-charcoal rounded-2xl p-8 border border-gold/20 dark:border-gold/30">
              <h2 className="font-orbitron text-2xl font-bold text-charcoal dark:text-white mb-4">Preview and Diff</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {PREVIEW_FILES.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedPreview(name)}
                    className={`px-3 py-2 rounded-lg border text-sm ${selectedPreview === name ? 'border-gold bg-gold/10' : 'border-silver/30'}`}
                  >
                    {name}
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Existing file</h3>
                  <textarea value={existingContent || 'No existing file detected'} readOnly className="w-full h-64 p-3 border rounded-lg bg-matte-bg/20" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Generated file</h3>
                  <textarea value={previewArtifact?.content || 'No generated content for this file'} readOnly className="w-full h-64 p-3 border rounded-lg bg-matte-bg/20" />
                </div>
              </div>
              <p className="text-sm text-charcoal/70 dark:text-silver mt-3">Guidance: replace if file is missing/outdated, merge manually if both include custom directives.</p>

              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSingleDownload(selectedPreview)}
                  className="px-4 py-2 rounded-lg border border-gold text-gold hover:bg-gold/10"
                >
                  Download Current File
                </button>
                <button type="button" onClick={handleDownloadSelected} className="px-4 py-2 rounded-lg border border-gold text-gold hover:bg-gold/10">
                  Download Selected Files (ZIP)
                </button>
              </div>

              <div className="mt-4 grid md:grid-cols-2 gap-2">
                {artifacts.map((artifact) => (
                  <label key={artifact.name} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      aria-label={`Select ${artifact.name} for download`}
                      checked={Boolean(selectedDownloads[artifact.name])}
                      onChange={(e) => setSelectedDownloads((prev) => ({ ...prev, [artifact.name]: e.target.checked }))}
                    />
                    <span>{artifact.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={handleGenerateZip}
              disabled={isGenerating || !analysisResult}
              className="group bg-charcoal dark:bg-gold border-2 border-gold text-gold dark:text-charcoal px-12 py-4 rounded-lg font-orbitron font-semibold text-lg disabled:opacity-50 flex items-center space-x-3 mx-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Forging Files...</span>
                </>
              ) : (
                <>
                  <FileText className="w-6 h-6" />
                  <span>Generate and Download ZIP</span>
                </>
              )}
            </button>

            {isGenerating && (
              <div aria-live="polite" className="mt-6 max-w-md mx-auto p-4 bg-gold/10 border border-gold/30 rounded-lg">
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span>{generationProgress.status}</span>
                  <span>{generationProgress.progress}%</span>
                </div>
                <div className="w-full bg-silver/20 rounded-full h-2">
                  <div className="bg-gold h-2 rounded-full" style={{ width: `${generationProgress.progress}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
