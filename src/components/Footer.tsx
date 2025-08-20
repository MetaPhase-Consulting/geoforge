import React from 'react';
import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-black text-charcoal dark:text-white py-12 border-t border-gold/20 dark:border-gold/30">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start space-y-6 md:space-y-0">
          {/* Left - Logo and Tagline */}
          <div className="space-y-2">
            <div className="font-orbitron text-2xl font-bold text-charcoal dark:text-white">
              <span className="shimmer-text">GEOforge</span>
            </div>
            <p className="text-charcoal/70 dark:text-silver font-work-sans text-sm max-w-xs">
              Generative Optimization for LLM Discovery
            </p>
          </div>
          
          {/* Right - Credits and Copyright */}
          <div className="text-right space-y-2">
            <div className="flex items-center space-x-4 text-charcoal/70 dark:text-silver font-work-sans text-sm">
              <div className="flex items-center space-x-2">
                <Github className="w-4 h-4" />
                <a href="https://github.com/MetaPhase-Consulting/geoforge" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">Open Source</a>
              </div>
              <span className="text-charcoal/70 dark:text-silver">|</span>
              <span className="text-charcoal/70 dark:text-silver">
                Built by{' '}
                <a 
                  href="https://metaphase.tech" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-gold hover:underline transition-all duration-300 font-semibold shimmer-text"
                >
                  MetaPhase
                </a>
              </span>
            </div>
            <div className="text-charcoal/70 dark:text-silver font-work-sans text-sm">
              © 2025 GEOforge
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}