import React from 'react';
import { Heart, Github, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative mt-20">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 transform skew-y-3 origin-bottom-right"></div>
      <div className="relative">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-white">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v8" />
                    <path d="m8.5 14 7-4" />
                    <path d="m8.5 10 7 4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">SpinMaster</h2>
              </div>
              <p className="text-white text-opacity-80">
                Create beautiful spinning wheels for giveaways, random selection, and decision making.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="hover:text-white text-white text-opacity-80 transition-colors duration-300">
                  <Github size={24} />
                </a>
                <a href="#" className="hover:text-white text-white text-opacity-80 transition-colors duration-300">
                  <Twitter size={24} />
                </a>
                <a href="#" className="hover:text-white text-white text-opacity-80 transition-colors duration-300">
                  <Instagram size={24} />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-white text-opacity-80 hover:text-white transition-colors duration-300">Home</a>
                </li>
                <li>
                  <a href="#features" className="text-white text-opacity-80 hover:text-white transition-colors duration-300">Features</a>
                </li>
                <li>
                  <a href="#examples" className="text-white text-opacity-80 hover:text-white transition-colors duration-300">Examples</a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-white text-opacity-80 hover:text-white transition-colors duration-300">How It Works</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Resources</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-white text-opacity-80 hover:text-white transition-colors duration-300">Help Center</a>
                </li>
                <li>
                  <a href="#" className="text-white text-opacity-80 hover:text-white transition-colors duration-300">Templates</a>
                </li>
                <li>
                  <a href="#" className="text-white text-opacity-80 hover:text-white transition-colors duration-300">API Documentation</a>
                </li>
                <li>
                  <a href="#" className="text-white text-opacity-80 hover:text-white transition-colors duration-300">Contact Support</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Legal</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-white text-opacity-80 hover:text-white transition-colors duration-300">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="text-white text-opacity-80 hover:text-white transition-colors duration-300">Terms of Service</a>
                </li>
                <li>
                  <a href="#" className="text-white text-opacity-80 hover:text-white transition-colors duration-300">Cookie Policy</a>
                </li>
                <li>
                  <a href="#" className="text-white text-opacity-80 hover:text-white transition-colors duration-300">GDPR Compliance</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white border-opacity-20 text-center text-white text-opacity-80">
            <p className="flex items-center justify-center text-sm">
              Made with <Heart size={16} className="mx-2 text-red-400" /> in 2025 | SpinMaster
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;