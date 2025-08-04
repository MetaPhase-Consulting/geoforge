import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Download, Terminal, BookOpen } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { path: '/online', label: 'Online Tool', icon: Download },
    { path: '/command-line', label: 'Command Line', icon: Terminal },
    { path: '/about', label: 'About', icon: BookOpen }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-sm border-b border-gold/30 dark:border-gold/40">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <span className="font-orbitron text-2xl font-bold shimmer-text">
              GEOforge
            </span>
          </Link>

          {/* Right side - Navigation and Theme Toggle */}
          <div className="flex items-center space-x-8">
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-work-sans font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    location.pathname === item.path
                      ? 'text-gold'
                      : 'text-charcoal dark:text-silver hover:text-gold dark:hover:text-gold'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-lg bg-gold/10 hover:bg-gold/20 dark:bg-matte-bg dark:hover:bg-matte-bg/80 flex items-center justify-center transition-colors duration-200 border border-gold/30 dark:border-gold/50"
              aria-label="Toggle theme"
            >
              {!isDark ? (
                <Moon className="w-5 h-5 text-gold" />
              ) : (
                <Sun className="w-5 h-5 text-gold" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}