import React from 'react';
import { Hammer, Target, Users, Zap, Shield, AlertTriangle, User } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Target,
      title: 'Mission',
      description: 'Make every website discoverable and optimized for AI systems through standardized, open-source tooling.'
    },
    {
      icon: Zap,
      title: 'Vision',
      description: 'A web where AI can efficiently discover, understand, and respect website content and policies.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Built by developers, for developers. Open source and community-driven from day one.'
    }
  ];

  const team = [
    {
      name: 'MetaPhase',
      role: 'Creator & Maintainer',
      description: 'Passionate about AI optimization and web standards.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-matte-bg py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto bg-gold/10 dark:bg-gold/20 rounded-2xl flex items-center justify-center mb-6">
            <Hammer className="w-10 h-10 text-gold" />
          </div>
          <h1 className="font-orbitron text-5xl font-bold text-charcoal dark:text-white mb-4">
            <span className="shimmer-text">About GEOforge</span>
          </h1>
          <p className="text-xl text-charcoal/70 dark:text-silver font-work-sans max-w-2xl mx-auto">
            Forging the future of AI-web interaction through open standards
          </p>
        </div>

        {/* Story */}
        <div className="bg-white dark:bg-charcoal rounded-2xl p-8 border border-gold/20 dark:border-gold/30 mb-8">
          <h2 className="font-orbitron text-2xl font-bold text-charcoal dark:text-white mb-6">
            The Story
          </h2>
          <div className="space-y-4 font-work-sans text-charcoal/80 dark:text-silver leading-relaxed">
            <p>
              As AI systems became more prevalent in web discovery and content analysis, we noticed a growing gap between what websites offered and what AI systems needed to understand them effectively.
            </p>
            <p>
              Traditional SEO focused on human search engines, but AI systems have different requirements. They need structured data, clear policies, and standardized formats to respect website owners' intentions while efficiently processing content.
            </p>
            <p>
              GEOforge was born to bridge this gap—creating a standardized, open-source approach to Generative Engine Optimization (GEO) that benefits both website owners and AI systems.
            </p>
          </div>
        </div>

        {/* Mission, Vision, Community */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white dark:bg-charcoal rounded-2xl p-6 border border-gold/20 dark:border-gold/30 text-center">
                <div className="w-16 h-16 mx-auto bg-gold/10 dark:bg-gold/20 rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-gold dark:text-gold" />
                </div>
                <h3 className="font-orbitron text-xl font-bold text-charcoal dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="font-work-sans text-charcoal/70 dark:text-silver leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* What is GEO */}
        <div className="bg-white dark:bg-charcoal rounded-2xl p-8 border border-gold/20 dark:border-gold/30 mb-8">
          <h2 className="font-orbitron text-2xl font-bold text-charcoal dark:text-white mb-6">
            What is Generative Engine Optimization (GEO)?
          </h2>
          <div className="space-y-4 font-work-sans text-charcoal/80 dark:text-silver leading-relaxed">
            <p>
              <strong className="text-gold">Generative Engine Optimization (GEO)</strong> is the practice of optimizing websites for AI systems and large language models (LLMs) that generate content based on web data.
            </p>
            <p>
              Unlike traditional SEO which focuses on ranking in search results, GEO ensures that:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>AI systems can efficiently discover and understand your content</li>
              <li>Your content policies and training preferences are clearly communicated</li>
              <li>Structured data is provided in formats AI systems expect</li>
              <li>Your website's relationship with AI crawlers is properly defined</li>
            </ul>
            <p>
              GEOforge automates this process by generating the necessary files and configurations that make your website "AI-ready" while respecting your preferences and policies.
            </p>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white dark:bg-charcoal rounded-2xl p-8 border border-gold/20 dark:border-gold/30 mb-8">
          <h2 className="font-orbitron text-2xl font-bold text-charcoal dark:text-white mb-6 text-center">
            Team
          </h2>
          <div className="max-w-md mx-auto">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gold/10 dark:bg-gold/20 rounded-2xl flex items-center justify-center">
                  <div className="w-16 h-16 relative">
                    <img 
                      src="/logo_mpc_header_color.svg" 
                      alt="MetaPhase Logo"
                      className="w-full h-full object-contain dark:hidden"
                    />
                    <img 
                      src="/logo_mpc_header_white.svg" 
                      alt="MetaPhase Logo"
                      className="w-full h-full object-contain hidden dark:block"
                    />
                  </div>
                </div>
                <h3 className="font-orbitron text-xl font-bold text-charcoal dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-gold font-work-sans font-medium mb-2">
                  {member.role}
                </p>
                <p className="font-work-sans text-charcoal/70 dark:text-silver">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Source */}
        <div className="bg-gradient-to-r from-gold/10 to-gold-light/10 dark:from-gold/15 dark:to-gold-light/15 rounded-2xl p-8 border border-gold/20 dark:border-gold/30 text-center">
          <h2 className="font-orbitron text-2xl font-bold text-charcoal dark:text-white mb-4">
            Open Source & Community Driven
          </h2>
          <p className="font-work-sans text-charcoal/80 dark:text-silver leading-relaxed mb-6 max-w-2xl mx-auto">
            GEOforge is completely open source and welcomes contributions from the community. 
            Together, we're building the standards and tools that will shape how AI systems 
            interact with the web.
          </p>
          <a
            href="https://github.com/geoforge/geoforge"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-charcoal dark:bg-gold border-2 border-gold dark:border-charcoal text-gold dark:text-charcoal px-6 py-3 rounded-lg font-orbitron font-semibold transition-all duration-300 hover:bg-gold hover:text-charcoal dark:hover:bg-charcoal dark:hover:text-gold"
          >
            Contribute on GitHub
          </a>
        </div>

        {/* Terms & Conditions */}
        <div className="mt-12">
          <h2 className="font-orbitron text-3xl font-bold text-charcoal dark:text-white mb-8 text-center">
            Terms & Conditions
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-charcoal rounded-2xl p-6 border border-gold/20 dark:border-gold/30 text-center">
              <div className="w-16 h-16 mx-auto bg-blue-500 rounded-2xl flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-orbitron text-xl font-bold text-charcoal dark:text-white mb-3">
                Open Source License
              </h3>
              <p className="font-work-sans text-charcoal/70 dark:text-silver leading-relaxed text-sm">
                This project is provided under an open source license. You are free to use, modify, and distribute the code.
              </p>
            </div>

            <div className="bg-white dark:bg-charcoal rounded-2xl p-6 border border-gold/20 dark:border-gold/30 text-center">
              <div className="w-16 h-16 mx-auto bg-blue-500 rounded-2xl flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-orbitron text-xl font-bold text-charcoal dark:text-white mb-3">
                No Warranty
              </h3>
              <p className="font-work-sans text-charcoal/70 dark:text-silver leading-relaxed text-sm">
                This software is provided "as is" without warranty of any kind, express or implied. Use at your own risk.
              </p>
            </div>

            <div className="bg-white dark:bg-charcoal rounded-2xl p-6 border border-gold/20 dark:border-gold/30 text-center">
              <div className="w-16 h-16 mx-auto bg-blue-500 rounded-2xl flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-orbitron text-xl font-bold text-charcoal dark:text-white mb-3">
                User Responsibility
              </h3>
              <p className="font-work-sans text-charcoal/70 dark:text-silver leading-relaxed text-sm">
                Users are responsible for ensuring compliance with all applicable licenses and regulations when using GEOforge.
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-charcoal rounded-2xl p-8 border border-gold/20 dark:border-gold/30">
            <h3 className="font-orbitron text-2xl font-bold text-charcoal dark:text-white mb-4 text-center">
              Important Notice
            </h3>
            <p className="font-work-sans text-charcoal/80 dark:text-silver leading-relaxed text-center max-w-4xl mx-auto">
              By using GEOforge, you acknowledge that this is open source software provided free of charge. While we strive for 
              quality and reliability, users assume full responsibility for testing, validation, and compliance with all applicable 
              software licenses and regulations. We recommend reviewing the terms of any AI platforms or services you choose to 
              optimize for in your projects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}