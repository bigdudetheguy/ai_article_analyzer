import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/AppIcon';

function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="FileQuestion" size={48} color="var(--color-primary)" strokeWidth={1.5} />
          </div>
          <h1 className="font-heading text-4xl font-semibold text-text-primary mb-4">
            404
          </h1>
          <h2 className="font-heading text-xl font-medium text-text-primary mb-2">
            Page Not Found
          </h2>
          <p className="font-body text-text-secondary mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/article-analysis-dashboard"
            className="inline-flex items-center justify-center space-x-2 w-full px-6 py-3 bg-primary text-white rounded-element hover:bg-primary/90 transition-smooth font-body font-medium"
          >
            <Icon name="Home" size={20} strokeWidth={2} />
            <span>Go to Dashboard</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center space-x-2 w-full px-6 py-3 border border-border text-text-primary rounded-element hover:bg-background transition-smooth font-body font-medium"
          >
            <Icon name="ArrowLeft" size={20} strokeWidth={2} />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;