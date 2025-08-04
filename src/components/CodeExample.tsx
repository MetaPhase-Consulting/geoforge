import React from 'react';
import { Copy, Check, Download, Terminal } from 'lucide-react';

export default function CodeExample() {
  return (
    <section className="py-20 bg-white dark:bg-charcoal text-charcoal dark:text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-orbitron text-4xl font-bold mb-4">
              <span className="shimmer-text">Get Started</span>
            </h2>
            <p className="text-xl text-charcoal/70 dark:text-silver font-work-sans">
              Choose your preferred method to forge your AI-ready foundation
            </p>
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
              <a
                href="/online"
                className="group bg-gold dark:bg-gold border-2 border-gold shimmer-gold px-4 py-4 rounded-lg font-orbitron font-semibold text-lg text-charcoal transition-all duration-300 hover:bg-gold-light hover:text-charcoal dark:hover:bg-gold-light dark:hover:text-charcoal transform hover:scale-105 hover:shadow-lg hover:shadow-gold/25 inline-flex items-center justify-center w-60"
              >
                <Download className="w-5 h-5 mr-2" />
                Online Tool
              </a>
              
              <a
                href="/command-line"
                className="group bg-transparent border-2 border-silver shimmer-silver px-4 py-4 rounded-lg font-orbitron font-semibold text-lg text-charcoal dark:text-charcoal transition-all duration-300 hover:border-gold hover:text-gold dark:hover:border-gold dark:hover:text-gold transform hover:scale-105 inline-flex items-center justify-center w-60"
              >
                <Terminal className="w-5 h-5 mr-2" />
                Command Line
              </a>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-charcoal/70 dark:text-silver font-work-sans">
              Generates robots.txt, sitemaps, manifests & more—ready for AI discovery.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}