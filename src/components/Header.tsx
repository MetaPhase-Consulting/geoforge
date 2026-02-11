import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Download, Terminal, BookOpen, Menu, X } from 'lucide-react';
import { useTheme } from '../contexts/useTheme';

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { path: '/online', label: 'Online Tool', icon: Download },
    { path: '/command-line', label: 'Command Line', icon: Terminal },
    { path: '/about', label: 'About', icon: BookOpen }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-sm border-b border-gold/30 dark:border-gold/40">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <span className="font-orbitron text-2xl font-bold shimmer-text">GEOforge</span>
          </Link>

          <div className="flex items-center space-x-3 md:space-x-8">
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

            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-lg bg-gold/10 hover:bg-gold/20 dark:bg-matte-bg dark:hover:bg-matte-bg/80 flex items-center justify-center border border-gold/30 dark:border-gold/50"
              aria-label="Toggle theme"
            >
              {!isDark ? <Moon className="w-5 h-5 text-gold" /> : <Sun className="w-5 h-5 text-gold" />}
            </button>

            <button
              type="button"
              className="md:hidden w-10 h-10 rounded-lg border border-gold/30 text-gold flex items-center justify-center"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="mobile-nav" className="md:hidden mt-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-lg ${location.pathname === item.path ? 'bg-gold/20 text-gold' : 'text-charcoal dark:text-silver'}`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
