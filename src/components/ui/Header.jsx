import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

function Header() {
  const location = useLocation();

  const Logo = () => (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-sm">
        <Icon name="Brain" size={22} color="white" strokeWidth={2} />
      </div>
      <div className="flex flex-col">
        <span className="font-heading font-bold text-xl text-gray-900">
          ArticleAI
        </span>
        <span className="font-caption text-xs text-gray-700 -mt-1">
          Content Analysis
        </span>
      </div>
    </div>
  );

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/article-analysis-dashboard" className="flex-shrink-0">
            <Logo />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/article-analysis-dashboard"
              className={`font-body text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                isActive('/article-analysis-dashboard')
                  ? 'text-indigo-600 bg-indigo-50' :'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/article-processing-results"
              className={`font-body text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                isActive('/article-processing-results')
                  ? 'text-indigo-600 bg-indigo-50' :'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Results
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Help */}
            <button
              className="p-2 text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-lg hover:bg-gray-50"
              title="Help & Documentation"
            >
              <Icon name="HelpCircle" size={20} className="text-teal-500" strokeWidth={2} />
            </button>

            {/* Settings */}
            <button
              className="p-2 text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-lg hover:bg-gray-50"
              title="Settings"
            >
              <Icon name="Settings" size={20} className="text-teal-500" strokeWidth={2} />
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                <Icon name="User" size={16} className="text-teal-700" strokeWidth={2} />
              </div>
              <span className="hidden lg:block font-body text-sm font-medium text-gray-900">
                Researcher
              </span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-lg hover:bg-gray-50"
            title="Menu"
          >
            <Icon name="Menu" size={20} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 bg-white">
        <div className="px-4 py-2 space-y-1">
          <Link
            to="/article-analysis-dashboard"
            className={`block px-3 py-2 rounded-lg font-body text-sm font-medium transition-all duration-200 ${
              isActive('/article-analysis-dashboard')
                ? 'text-indigo-600 bg-indigo-50' :'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/article-processing-results"
            className={`block px-3 py-2 rounded-lg font-body text-sm font-medium transition-all duration-200 ${
              isActive('/article-processing-results')
                ? 'text-indigo-600 bg-indigo-50' :'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Results
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;