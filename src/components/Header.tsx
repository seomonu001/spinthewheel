import React, { useState, useEffect } from 'react';
import { Menu, X, HelpCircle, Share2, Github } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled ? 'glass-card backdrop-blur-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg animate-float">
              <div className="text-white">
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v8" />
                  <path d="m8.5 14 7-4" />
                  <path d="m8.5 10 7 4" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
              SpinMaster
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#features" 
              className="text-gray-700 hover:text-primary-600 transition-colors duration-300"
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="text-gray-700 hover:text-primary-600 transition-colors duration-300"
            >
              How It Works
            </a>
            <a 
              href="#examples" 
              className="text-gray-700 hover:text-primary-600 transition-colors duration-300"
            >
              Examples
            </a>
            <button 
              className="btn-secondary flex items-center space-x-2"
            >
              <HelpCircle size={18} />
              <span>Help</span>
            </button>
            <button 
              className="btn-primary flex items-center space-x-2"
            >
              <Share2 size={18} />
              <span>Share</span>
            </button>
          </nav>

          <button 
            className="md:hidden text-gray-700 hover:text-primary-600 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-4 mt-4 glass-card rounded-xl p-4">
            <a 
              href="#features" 
              className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a 
              href="#examples" 
              className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Examples
            </a>
            <button 
              className="flex items-center space-x-2 py-2 text-gray-700 hover:text-primary-600 transition-colors w-full"
            >
              <HelpCircle size={18} />
              <span>Help</span>
            </button>
            <button 
              className="flex items-center space-x-2 py-2 text-gray-700 hover:text-primary-600 transition-colors w-full"
            >
              <Share2 size={18} />
              <span>Share</span>
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;