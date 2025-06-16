import React from 'react';
import Icon from '../AppIcon';

function ProgressIndicator({ 
  processingArticles = [], 
  currentStep = 0, 
  totalSteps = 4,
  isVisible = false 
}) {
  const steps = [
    { label: 'Fetching Content', icon: 'Download' },
    { label: 'Analyzing Text', icon: 'Brain' },
    { label: 'Generating Summary', icon: 'FileText' },
    { label: 'Processing Complete', icon: 'CheckCircle' }
  ];

  if (!isVisible) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md animate-slide-up mb-8 transition-all duration-200">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-heading font-semibold text-xl text-gray-900">
          Processing Articles
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse-subtle"></div>
          <span className="font-body text-sm text-gray-700">
            {processingArticles?.length} article{processingArticles?.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="space-y-5">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div key={step.label} className="flex items-center space-x-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                isCompleted 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : isActive 
                    ? 'bg-indigo-600 text-white shadow-sm' :'bg-gray-100 border border-gray-200 text-gray-500'
              }`}>
                {isCompleted ? (
                  <Icon name="Check" size={18} strokeWidth={2} />
                ) : (
                  <Icon 
                    name={step.icon} 
                    size={18} 
                    strokeWidth={2}
                    className={isActive ? 'animate-pulse-subtle' : ''}
                  />
                )}
              </div>
              
              <div className="flex-1">
                <p className={`font-body font-medium transition-all duration-200 ${
                  isActive 
                    ? 'text-indigo-600 text-lg' 
                    : isCompleted 
                      ? 'text-emerald-600 text-base' :'text-gray-700 text-base'
                }`}>
                  {step.label}
                </p>
                {isActive && (
                  <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-indigo-600 h-1.5 rounded-full transition-all duration-1000 animate-pulse-subtle w-3/4"></div>
                  </div>
                )}
              </div>

              {isActive && (
                <div className="flex-shrink-0">
                  <Icon 
                    name="Loader2" 
                    size={18} 
                    className="animate-spin text-indigo-600" 
                    strokeWidth={2}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Article List */}
      {processingArticles?.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="font-body font-medium text-gray-900 mb-3">
            Processing Queue
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
            {processingArticles.map((article, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100 transition-all duration-200">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse-subtle"></div>
                <span className="font-mono text-xs text-gray-700 truncate flex-1">
                  {article?.url || `Article ${index + 1}`}
                </span>
                <span className={`font-caption text-xs px-2 py-1 rounded-lg ${
                  article?.status === 'processing' ?'bg-indigo-100 text-indigo-700' 
                    : article?.status === 'completed' ?'bg-emerald-100 text-emerald-700' :'bg-gray-100 text-gray-700'
                }`}>
                  {article?.status || 'queued'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgressIndicator;