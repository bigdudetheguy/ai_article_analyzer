import React from 'react';
import Icon from '../../../components/AppIcon';

function ErrorDisplay({ errors, onDismiss }) {
  if (!errors || errors.length === 0) return null;

  const getErrorIcon = (code) => {
    switch (code) {
      case 'FETCH-001':
        return 'WifiOff';
      case 'EXT-002':
        return 'FileX';
      case 'LLM-004':
        return 'Brain';
      case 'NET-005':
        return 'AlertTriangle';
      default:
        return 'AlertCircle';
    }
  };

  const getErrorTitle = (code) => {
    switch (code) {
      case 'FETCH-001':
        return 'Content Fetch Failed';
      case 'EXT-002':
        return 'Text Extraction Error';
      case 'LLM-004':
        return 'AI Analysis Failed';
      case 'NET-005':
        return 'Network Error';
      default:
        return 'Processing Error';
    }
  };

  const getErrorDescription = (code) => {
    switch (code) {
      case 'FETCH-001':
        return 'Unable to retrieve article content. The URL may be inaccessible or blocked by CORS policy.';
      case 'EXT-002':
        return 'Failed to extract readable text from the article. The page structure may be incompatible.';
      case 'LLM-004':
        return 'AI analysis service encountered an error. Please try again or contact support.';
      case 'NET-005':
        return 'Network connectivity issue. Please check your connection and try again.';
      default:
        return 'An unexpected error occurred during processing.';
    }
  };

  return (
    <div className="mb-8 space-y-4">
      {errors.map((error, index) => (
        <div key={index} className="bg-red-100 border border-red-200 rounded-xl p-4 shadow-sm transition-all duration-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              <Icon 
                name={getErrorIcon(error?.code)} 
                size={20} 
                className="text-red-700"
                strokeWidth={2} 
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-heading font-semibold text-red-700">
                  {getErrorTitle(error?.code)}
                </h4>
                {error?.code && (
                  <span className="font-mono text-xs text-red-700 bg-red-50 px-2 py-1 rounded-lg">
                    {error.code}
                  </span>
                )}
              </div>
              
              <p className="font-body text-sm text-gray-900 mb-2">
                {getErrorDescription(error?.code)}
              </p>
              
              {error?.url && (
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <Icon name="Link" size={14} strokeWidth={2} />
                  <span className="font-mono truncate">{error.url}</span>
                </div>
              )}
              
              {error?.message && error.message !== getErrorDescription(error?.code) && (
                <div className="mt-2 p-3 bg-red-50 rounded-lg">
                  <p className="font-mono text-xs text-red-700">
                    {error.message}
                  </p>
                </div>
              )}
            </div>
            
            <button
              onClick={onDismiss}
              className="flex-shrink-0 p-1.5 text-gray-700 hover:text-red-700 transition-all duration-200 rounded-lg hover:bg-red-50"
              title="Dismiss error"
            >
              <Icon name="X" size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      ))}
      
      {errors.length > 1 && (
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <Icon name="AlertTriangle" size={16} className="text-red-700" strokeWidth={2} />
            <span>{errors.length} errors occurred during processing</span>
          </div>
          <button
            onClick={onDismiss}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-lg hover:bg-gray-50 font-body text-sm font-medium"
          >
            <Icon name="X" size={14} strokeWidth={2} />
            <span>Dismiss All</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ErrorDisplay;