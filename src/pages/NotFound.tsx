import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, Code, Zap, ArrowLeft, RefreshCw } from 'lucide-react';

const NotFound: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions] = useState([
    'Generate robots.txt',
    'Create sitemap',
    'AI optimization',
    'OpenAI crawlers',
    'Claude training',
    'Perplexity indexing'
  ]);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // You could implement search functionality here
      console.log('Searching for:', searchTerm);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Animated 404 */}
        <div className="mb-8">
          <h1 className={`text-9xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent transition-all duration-1000 ${isAnimating ? 'scale-110 rotate-2' : 'scale-100 rotate-0'}`}>
            404
          </h1>
        </div>

        {/* Floating AI Icons */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex justify-center items-center">
            <div className={`absolute transition-all duration-700 ${isAnimating ? 'animate-bounce' : ''}`} style={{ animationDelay: '0ms' }}>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
            <div className={`absolute transition-all duration-700 ${isAnimating ? 'animate-bounce' : ''}`} style={{ animationDelay: '200ms' }}>
              <Code className="w-8 h-8 text-blue-500" />
            </div>
            <div className={`absolute transition-all duration-700 ${isAnimating ? 'animate-bounce' : ''}`} style={{ animationDelay: '400ms' }}>
              <Search className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
            Oops! Page Not Found
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Looks like this page got lost in the AI training data. Don't worry, 
            we've got plenty of other amazing tools for you to explore!
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for AI tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setSearchTerm(suggestion)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-300 transition-all duration-200 hover:scale-105"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
            
            <Link
              to="/online"
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-300 transform hover:scale-105 transition-all duration-200"
            >
              <Code className="w-5 h-5" />
              Try Our Tools
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>

          {/* Fun Stats */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-blue-600">∞</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">AI Possibilities</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Open Source</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-green-600">🚀</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Always Learning</div>
            </div>
          </div>

          {/* Easter Egg */}
          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            <p>💡 Pro tip: This 404 page is AI-friendly and ready for training!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 