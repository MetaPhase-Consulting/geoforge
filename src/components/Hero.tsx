import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Github, Terminal } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-white dark:bg-charcoal text-charcoal dark:text-white min-h-[80vh] flex items-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Left content */}
          <div className="space-y-8 mx-auto">
            <h1 className="font-orbitron text-6xl lg:text-7xl font-bold leading-tight">
              <span className="shimmer-text">GEOforge</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-charcoal/70 dark:text-silver font-work-sans leading-relaxed">
              Forge AI-ready sitemaps, manifests & audits in seconds.
            </p>
            

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center">
              <Link
                to="/online"
                className="group bg-gold dark:bg-gold border-2 border-gold shimmer-gold px-4 py-4 rounded-lg font-orbitron font-semibold text-lg text-charcoal transition-all duration-300 hover:bg-gold-light hover:text-charcoal dark:hover:bg-gold-light dark:hover:text-charcoal transform hover:scale-105 hover:shadow-lg hover:shadow-gold/25 inline-flex items-center justify-center w-60"
              >
                <Download className="inline-block w-5 h-5 mr-2" />
                Online Tool
              </Link>
              
              <Link
                to="/command-line"
                className="group bg-transparent border-2 border-silver shimmer-silver px-4 py-4 rounded-lg font-orbitron font-semibold text-lg text-charcoal dark:text-charcoal transition-all duration-300 hover:border-gold hover:text-gold dark:hover:border-gold dark:hover:text-gold transform hover:scale-105 inline-flex items-center justify-center w-60"
              >
                <Terminal className="inline-block w-5 h-5 mr-2" />
                Command Line
              </Link>
              
              <a
                href="https://github.com/geoforge/geoforge"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-transparent border-2 border-silver text-charcoal/70 dark:text-silver px-4 py-4 rounded-lg font-orbitron font-semibold text-lg transition-all duration-300 hover:border-gold hover:text-gold dark:hover:border-gold dark:hover:text-gold transform hover:scale-105 inline-flex items-center justify-center w-60"
              >
                <Github className="inline-block w-5 h-5 mr-2" />
                View Source
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}