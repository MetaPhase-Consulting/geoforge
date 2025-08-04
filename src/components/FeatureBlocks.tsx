import React from 'react';
import { Bot, FileText, Zap, Shield, Globe, CheckCircle } from 'lucide-react';

export default function FeatureBlocks() {
  const features = [
    {
      icon: Bot,
      title: 'AI Crawler Management',
      description: 'Control which AI systems can access your content with granular bot management and training permissions.',
      items: [
        'GPTBot (OpenAI) - Allow/deny ChatGPT training',
        'ClaudeBot (Anthropic) - Control Claude model access', 
        'PerplexityBot - Manage search AI indexing',
        'Google-Extended - Block Bard/Gemini training',
        'Custom crawler rules for emerging AI bots'
      ]
    },
    {
      icon: FileText,
      title: 'Vendor Manifests',
      description: 'Generate standardized JSON manifests that tell AI systems exactly how to interact with your content.',
      items: [
        'openai.json - Training permissions & usage policies',
        'claude.json - Content access & attribution rules',
        'gemini.json - Google AI interaction guidelines',
        'Custom vendor configs for new AI platforms',
        'Unified schema across all manifest files'
      ]
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-charcoal">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-orbitron text-4xl font-bold text-charcoal dark:text-white mb-4">
            Complete AI Optimization
          </h2>
          <p className="text-xl text-charcoal/70 dark:text-silver font-work-sans max-w-3xl mx-auto">
            Essential tools to make your website AI-ready
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <div
                key={index}
                className="group bg-white dark:bg-matte-bg border border-gold/20 dark:border-gold/30 rounded-2xl p-8 transition-all duration-300 hover:border-gold/40 dark:hover:border-gold/50 hover:shadow-lg hover:shadow-gold/10 dark:hover:shadow-gold/20 transform hover:scale-105"
              >
                {/* Icon and Title */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gold/10 dark:bg-gold/20 rounded-2xl flex items-center justify-center group-hover:bg-gold/20 dark:group-hover:bg-gold/30 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="font-orbitron text-2xl font-bold text-charcoal dark:text-white">
                    {feature.title}
                  </h3>
                </div>
                
                <p className="font-work-sans text-charcoal/70 dark:text-silver leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Feature Items */}
                <div className="space-y-3">
                  {feature.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" />
                      <span className="font-work-sans text-sm text-charcoal/80 dark:text-silver">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Decorative Background Elements */}
                <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none overflow-hidden rounded-2xl">
                  <div className="absolute top-4 right-4 w-12 h-12 border border-gold/30 rounded-full animate-pulse" />
                  <div className="absolute bottom-6 left-6 w-16 h-16 border border-gold/20 rounded-2xl rotate-12" />
                  <div className="absolute top-1/2 right-8 w-6 h-6 bg-gold/20 rounded-full" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}