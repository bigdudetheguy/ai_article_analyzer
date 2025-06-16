// src/components/ui/ResultCard.jsx
import React, { useState, useMemo } from 'react';
import Icon from '../AppIcon';

function ResultCard({ 
  article = {},
  onRewriteSummary = () => {},
  onGenerateQuestions = () => {},
  onKeyTermClick = () => {},
  onSelect = () => {},
  isSelected = false,
  isLoading = false,
  viewMode = 'cards'
}) {
  const [activeTab, setActiveTab] = useState('summary');
  const [rewriteLevel, setRewriteLevel] = useState('normal');
  const [expandedSections, setExpandedSections] = useState({});
  const [tooltipPosition, setTooltipPosition] = useState(null);

  const rewriteLevels = [
    { value: 'simple', label: 'Simple', description: 'Easy to understand' },
    { value: 'normal', label: 'Normal', description: 'Balanced detail' },
    { value: 'detailed', label: 'Detailed', description: 'Comprehensive' },
    { value: 'extra', label: 'Extra Detailed', description: 'In-depth analysis' }
  ];

  const tabs = [
    { id: 'summary', label: 'Summary', icon: 'FileText' },
    { id: 'questions', label: 'Questions', icon: 'HelpCircle' },
    { id: 'keyterms', label: 'Key Terms', icon: 'Tag' },
    { id: 'metadata', label: 'Details', icon: 'Info' }
  ];

  // Function to highlight key terms in text
  const highlightKeyTerms = useMemo(() => {
    return (text, keyTerms) => {
      if (!text || !keyTerms?.length) return text;
      
      let highlightedText = text;
      
      keyTerms.forEach(termObj => {
        const term = typeof termObj === 'string' ? termObj : termObj.term;
        if (!term) return;
        
        // Create a case-insensitive regex for the term
        const regex = new RegExp(`\\b(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'gi');
        
        highlightedText = highlightedText.replace(regex, (match) => {
          return `<mark class="bg-yellow-200 text-yellow-900 px-1 py-0.5 rounded-sm font-medium transition-all duration-200 hover:bg-yellow-300 cursor-pointer" data-term="${match}">${match}</mark>`;
        });
      });
      
      return highlightedText;
    };
  }, []);

  // Enhanced summary with highlighted key terms
  const highlightedSummary = useMemo(() => {
    return highlightKeyTerms(article?.summary || '', article?.keyTerms || []);
  }, [article?.summary, article?.keyTerms, highlightKeyTerms]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleRewrite = () => {
    onRewriteSummary(article?.id, rewriteLevel);
  };

  const handleKeyTermHover = (term, event) => {
    const rect = event.target.getBoundingClientRect();
    const termObj = article?.keyTerms?.find(t => 
      (typeof t === 'string' ? t : t.term)?.toLowerCase() === term.toLowerCase()
    );
    
    setTooltipPosition({
      term,
      definition: typeof termObj === 'object' ? termObj.definition : null,
      example: typeof termObj === 'object' ? termObj.example : null,
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const handleKeyTermLeave = () => {
    setTooltipPosition(null);
  };

  // Handle click events on highlighted terms in summary
  const handleSummaryClick = (event) => {
    const clickedElement = event.target;
    if (clickedElement.tagName === 'MARK' && clickedElement.dataset.term) {
      const term = clickedElement.dataset.term;
      onKeyTermClick(term);
      handleKeyTermHover(term, event);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            {/* Selection Checkbox */}
            <div className="flex items-center pt-1">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(article?.id)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                {article?.title || 'Article Title'}
              </h3>
              <p className="font-mono text-sm text-indigo-600 truncate mb-3">
                {article?.url || 'https://example.com/article'}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                <span className="flex items-center space-x-1">
                  <Icon name="Clock" size={14} className="text-indigo-500" strokeWidth={2} />
                  <span>{article?.metadata?.readTime || '5 min read'}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Icon name="Calendar" size={14} className="text-indigo-500" strokeWidth={2} />
                  <span>{article?.metadata?.publishDate || 'Today'}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Icon name="User" size={14} className="text-indigo-500" strokeWidth={2} />
                  <span>{article?.metadata?.author || 'Author'}</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => onKeyTermClick(article?.id)}
              className="p-2 text-gray-700 hover:text-indigo-600 transition-all duration-200 rounded-lg hover:bg-indigo-50"
              title="Bookmark Article"
            >
              <Icon name="Bookmark" size={18} strokeWidth={2} />
            </button>
            <button
              className="p-2 text-gray-700 hover:text-indigo-600 transition-all duration-200 rounded-lg hover:bg-indigo-50"
              title="Share Article"
            >
              <Icon name="Share2" size={18} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 font-body text-sm font-medium transition-all duration-200 border-b-2 ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50' :'border-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon name={tab.icon} size={16} className={activeTab === tab.id ? "text-indigo-500" : "text-gray-700"} strokeWidth={2} />
              <span>{tab.label}</span>
              {tab.id === 'keyterms' && article?.keyTerms?.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">
                  {article.keyTerms.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'summary' && (
          <div className="space-y-4">
            {/* Rewrite Controls */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-4">
                <span className="font-body text-sm font-medium text-gray-900">
                  Summary Level:
                </span>
                <select
                  value={rewriteLevel}
                  onChange={(e) => setRewriteLevel(e.target.value)}
                  className="font-body text-sm border border-gray-200 rounded-lg px-3 py-1 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                >
                  {rewriteLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label} - {level.description}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleRewrite}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isLoading ? (
                  <Icon name="Loader2" size={16} className="animate-spin" strokeWidth={2} />
                ) : (
                  <Icon name="RefreshCw" size={16} strokeWidth={2} />
                )}
                <span className="font-body text-sm font-medium">Rewrite</span>
              </button>
            </div>

            {/* Summary Content with Highlighted Key Terms */}
            <div className="prose prose-sm max-w-none bg-white p-4 rounded-xl border border-gray-100">
              <div 
                className="font-body text-gray-700 leading-relaxed cursor-text"
                dangerouslySetInnerHTML={{ __html: highlightedSummary }}
                onClick={handleSummaryClick}
                onMouseOver={(e) => {
                  if (e.target.tagName === 'MARK' && e.target.dataset.term) {
                    handleKeyTermHover(e.target.dataset.term, e);
                  }
                }}
                onMouseOut={(e) => {
                  if (e.target.tagName === 'MARK') {
                    handleKeyTermLeave();
                  }
                }}
              />
              
              {/* Key Terms Legend */}
              {article?.keyTerms?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2 flex items-center">
                    <Icon name="Info" size={12} className="mr-1" strokeWidth={2} />
                    Highlighted terms are clickable for more information
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-medium text-gray-900">
                Generated Questions
              </h4>
              <button
                onClick={() => onGenerateQuestions(article?.id)}
                disabled={isLoading}
                className="flex items-center space-x-2 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <Icon name="Loader2" size={16} className="animate-spin" strokeWidth={2} />
                ) : (
                  <Icon name="Plus" size={16} strokeWidth={2} />
                )}
                <span className="font-body text-sm font-medium">Generate More</span>
              </button>
            </div>

            <div className="space-y-3">
              {(article?.questions || [
                'What are the main benefits of AI-powered content analysis?',
                'How does machine learning improve text processing efficiency?',
                'What challenges exist in automated content analysis?'
              ]).map((question, index) => (
                <div key={index} className="p-4 bg-teal-50 rounded-xl border-l-4 border-teal-500">
                  <p className="font-body text-gray-700">{question}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'keyterms' && (
          <div className="space-y-4">
            <h4 className="font-heading font-medium text-gray-900">
              Key Terms & Concepts
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              {(article?.keyTerms || [
                { term: 'Artificial Intelligence', definition: 'Computer systems able to perform tasks that typically require human intelligence', example: 'Used in medical imaging to detect cancer cells' },
                { term: 'Machine Learning', definition: 'A subset of AI that enables computers to learn and improve from experience', example: 'Predicting customer behavior from data' },
                { term: 'Content Analysis', definition: 'Systematic analysis of communication content', example: 'Analyzing social media posts for sentiment' },
                { term: 'Text Processing', definition: 'Computational processing of textual data', example: 'Extracting keywords from documents' },
                { term: 'Data Mining', definition: 'Process of discovering patterns in large datasets', example: 'Finding trends in customer purchase data' },
                { term: 'Natural Language Processing', definition: 'AI technology for understanding human language', example: 'Language translation and chatbots' }
              ]).map((termObj, index) => {
                const term = typeof termObj === 'string' ? termObj : termObj.term;
                const definition = typeof termObj === 'object' ? termObj.definition : null;
                const example = typeof termObj === 'object' ? termObj.example : null;
                
                return (
                  <div 
                    key={index}
                    className="p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-200 hover:border-teal-300 transition-all duration-200 cursor-pointer group"
                    onClick={() => onKeyTermClick(term)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-body font-semibold text-gray-900 mb-1 group-hover:text-teal-700 transition-colors">
                          {term}
                        </h5>
                        {definition && (
                          <p className="font-body text-sm text-gray-600 mb-2 leading-relaxed">
                            {definition}
                          </p>
                        )}
                        {example && (
                          <p className="font-body text-xs text-gray-500 bg-white/70 px-2 py-1 rounded border">
                            <span className="font-medium">Example:</span> {example}
                          </p>
                        )}
                      </div>
                      <Icon name="ExternalLink" size={14} className="text-gray-400 group-hover:text-teal-500 transition-colors mt-1 ml-2" strokeWidth={2} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'metadata' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <label className="font-body text-sm font-medium text-gray-500 block mb-1">Word Count</label>
                  <p className="font-mono text-gray-900 text-lg">{article?.metadata?.wordCount?.toLocaleString() || '1,250'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <label className="font-body text-sm font-medium text-gray-500 block mb-1">Language</label>
                  <p className="font-body text-gray-900 text-lg">{article?.metadata?.language || 'English'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <label className="font-body text-sm font-medium text-gray-500 block mb-1">Sentiment</label>
                  <p className="font-body text-gray-900 text-lg">{article?.metadata?.sentiment || 'Neutral'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <label className="font-body text-sm font-medium text-gray-500 block mb-1">Category</label>
                  <p className="font-body text-gray-900 text-lg">{article?.metadata?.category || 'Technology'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <label className="font-body text-sm font-medium text-gray-500 block mb-1">Complexity</label>
                  <p className="font-body text-gray-900 text-lg">{article?.metadata?.complexity || 'Intermediate'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <label className="font-body text-sm font-medium text-gray-500 block mb-1">Processed</label>
                  <p className="font-mono text-gray-900 text-lg">
                    {article?.metadata?.processedAt ? new Date(article.metadata.processedAt).toLocaleString() : 'Just now'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Tooltip */}
      {tooltipPosition && (
        <div
          className="fixed z-50 px-4 py-3 bg-gray-900 text-white rounded-lg shadow-2xl font-body text-sm animate-fade-in pointer-events-none max-w-xs transition-opacity"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translateX(-50%) translateY(-100%)'
          }}
        >
          <div className="text-center">
            <div className="font-semibold mb-1">{tooltipPosition.term}</div>
            {tooltipPosition.definition && (
              <div className="text-xs text-gray-300 mb-2">{tooltipPosition.definition}</div>
            )}
            {tooltipPosition.example && (
              <div className="text-xs text-blue-200">
                <span className="font-medium">Example:</span> {tooltipPosition.example}
              </div>
            )}
            <div className="text-xs text-gray-400 mt-2">Click to search</div>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}

export default ResultCard;