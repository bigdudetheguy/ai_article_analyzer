import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

function UrlInputForm({ value, onChange, onSubmit, isProcessing }) {
  const [localValue, setLocalValue] = useState(value || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (localValue?.trim() && !isProcessing) {
      onSubmit(localValue);
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  const urlCount = localValue?.split('\n').filter(url => url.trim().length > 0).length || 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 mb-8 transition-all duration-200 hover:shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="urls" className="block font-body text-base font-medium text-gray-900 mb-3">
            Article URLs
          </label>
          <div className="relative">
            <textarea
              id="urls"
              value={localValue}
              onChange={handleChange}
              disabled={isProcessing}
              placeholder={`Enter article URLs (one per line):\n\nhttps://example.com/article-1\nhttps://example.com/article-2\nhttps://example.com/article-3\n\nSupports multiple formats and domains`}
              className="w-full h-36 px-5 py-4 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-500 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              rows={6}
            />
            {localValue && !isProcessing && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-gray-700 transition-all duration-200 rounded-lg hover:bg-gray-100"
                title="Clear all URLs"
              >
                <Icon name="X" size={16} strokeWidth={2} />
              </button>
            )}
          </div>
          {urlCount > 0 && (
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-700 flex items-center">
                <Icon name="Link" size={14} className="mr-1.5 text-indigo-600" strokeWidth={2} />
                {urlCount} URL{urlCount !== 1 ? 's' : ''} detected
              </span>
              <span className="text-gray-700 flex items-center">
                <Icon name="Clock" size={14} className="mr-1.5 text-indigo-600" strokeWidth={2} />
                Estimated time: {Math.ceil(urlCount * 1.5)} minutes
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <Icon name="Shield" size={16} className="text-teal-500" strokeWidth={2} />
              <span>CORS proxy enabled</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <Icon name="Zap" size={16} className="text-teal-500" strokeWidth={2} />
              <span>AI-powered analysis</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!localValue?.trim() || isProcessing}
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-gradient-to-br hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 disabled:bg-indigo-300 disabled:cursor-not-allowed font-body font-medium shadow-sm hover:shadow"
          >
            {isProcessing ? (
              <>
                <Icon name="Loader2" size={18} className="animate-spin" strokeWidth={2} />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Icon name="Play" size={18} strokeWidth={2} />
                <span>Analyze Articles</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-indigo-50 rounded-xl border-l-4 border-indigo-600">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="mt-0.5 flex-shrink-0 text-indigo-600" strokeWidth={2} />
          <div className="text-sm text-gray-700">
            <p className="font-medium text-gray-900 mb-1">How it works:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Articles are processed sequentially to prevent rate limiting</li>
              <li>Content is extracted using multiple CORS proxy fallbacks</li>
              <li>AI generates summaries, key terms, and insightful questions</li>
              <li>Results appear incrementally as each article completes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UrlInputForm;