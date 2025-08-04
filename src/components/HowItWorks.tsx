import React from 'react';
import { Globe, Hammer, FolderOpen } from 'lucide-react';

const steps = [
  {
    icon: Globe,
    title: 'Input',
    description: 'Use online tool or CLI to configure your site'
  },
  {
    icon: Hammer,
    title: 'Forge',
    description: 'Automatically create all GEO files'
  },
  {
    icon: FolderOpen,
    title: 'Deploy',
    description: 'Download ZIP file and copy contents to website root'
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white dark:bg-matte-bg">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-orbitron text-4xl font-bold text-charcoal dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-charcoal/70 dark:text-silver font-work-sans max-w-2xl mx-auto">
            Three simple steps to make your website AI-discovery ready
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="group text-center p-8 rounded-2xl transition-all duration-300 hover:bg-gold/5 dark:hover:bg-charcoal/50 hover:shadow-lg transform hover:scale-105 border border-transparent hover:border-gold/20"
              >
                <div className="mb-6 relative">
                  <div className="w-20 h-20 mx-auto bg-gold/10 dark:bg-gold/20 rounded-full flex items-center justify-center group-hover:bg-gold/20 dark:group-hover:bg-gold/30 transition-colors duration-300">
                    <Icon className="w-10 h-10 text-gold group-hover:text-gold transition-colors duration-300" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold rounded-full flex items-center justify-center text-charcoal dark:text-charcoal font-orbitron font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                
                <h3 className="font-orbitron text-2xl font-bold text-charcoal dark:text-white mb-4 transition-colors duration-300">
                  {step.title}
                </h3>
                
                <p className="font-work-sans text-charcoal/70 dark:text-silver leading-relaxed transition-colors duration-300">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}