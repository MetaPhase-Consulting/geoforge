import React from 'react';

export default function TaglineBanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-gold-light/20 to-gold/20 dark:from-gold/15 dark:to-gold-light/15 border-y border-gold/30 dark:border-gold/40">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <div className="font-work-sans text-2xl font-semibold text-charcoal dark:text-white tracking-wider">
            <div className="mb-2">
              <span className="shimmer-text font-orbitron font-bold">GEOforge</span> creates{' '}
              <span className="shimmer-text font-orbitron font-bold">GOLD</span>:
            </div>
            <div className="shimmer-text italic font-work-sans text-xl">
              Generative Optimization for LLM Discovery
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}