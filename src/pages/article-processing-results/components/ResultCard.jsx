// src/pages/article-processing-results/components/ResultCard.jsx
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

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
  const [showFullSummary, setShowFullSummary] = useState(false);
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
    { id: 'details', label: 'Details', icon: 'Info' }
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

  // Error display for failed articles
  if (article?.status === 'error') {
    return (
      <motion.div 
        className="bg-red-50 border border-red-200 rounded-card p-6 shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Icon name="AlertCircle" size={24} color="var(--color-error)" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-lg font-semibold text-red-900 mb-2">
              Processing Failed
            </h3>
            <p className="font-mono text-sm text-red-700 mb-2 break-all">
              {article?.url}
            </p>
            <p className="font-body text-red-800 mb-3">
              {article?.error?.message || 'An unknown error occurred during processing'}
            </p>
            {article?.error?.code && (
              <div className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-mono">
                Error Code: {article.error.code}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  const cardContent = (
    <>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            {/* Selection Checkbox */}
            <div className="flex items-center pt-1">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(article?.id)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-2xl font-bold text-text-primary mb-2 line-clamp-2 hover:text-primary transition-colors">
                {article?.title || 'Article Title'}
              </h3>
              <p className="font-mono text-sm text-primary truncate mb-3">
                {article?.url || 'https://example.com/article'}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                <span className="flex items-center space-x-1">
                  <Icon name="Clock" size={14} className="text-primary" strokeWidth={2} />
                  <span>{article?.metadata?.readTime || '5 min read'}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Icon name="Calendar" size={14} className="text-primary" strokeWidth={2} />
                  <span>{article?.metadata?.publishDate || 'Today'}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Icon name="User" size={14} className="text-primary" strokeWidth={2} />
                  <span>{article?.metadata?.author || 'Author'}</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => onKeyTermClick(article?.title)}
              className="p-2 text-text-secondary hover:text-primary transition-all duration-200 rounded-element hover:bg-surface"
              title="Bookmark Article"
            >
              <Icon name="Bookmark" size={18} strokeWidth={2} />
            </button>
            <button
              className="p-2 text-text-secondary hover:text-primary transition-all duration-200 rounded-element hover:bg-surface"
              title="Share Article"
            >
              <Icon name="Share2" size={18} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 font-body text-sm font-medium transition-smooth border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary text-primary bg-primary/5' :'border-transparent text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              <Icon name={tab.icon} size={16} className={activeTab === tab.id ? "text-primary" : "text-text-secondary"} strokeWidth={2} />
              <span>{tab.label}</span>
              {tab.id === 'keyterms' && article?.keyTerms?.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-background text-text-secondary rounded-full border">
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
            <div className="flex items-center justify-between p-4 bg-surface rounded-element border border-border">
              <div className="flex items-center space-x-4">
                <span className="font-body text-sm font-medium text-text-primary">
                  Summary Level:
                </span>
                <select
                  value={rewriteLevel}
                  onChange={(e) => setRewriteLevel(e.target.value)}
                  className="font-body text-sm border border-border rounded-element px-3 py-1 bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth"
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
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-element hover:bg-primary/90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
            <div className="prose prose-sm max-w-none bg-background p-4 rounded-element border border-border">
              {article?.summary ? (
                <div 
                  className="font-body text-text-primary leading-relaxed cursor-text"
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
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Icon name="FileText" size={32} className="text-text-secondary mb-4" strokeWidth={1.5} />
                  <p className="text-text-secondary mb-2">No summary available</p>
                  <button
                    onClick={handleRewrite}
                    className="flex items-center space-x-2 px-4 py-2 mt-2 bg-primary text-white rounded-element hover:bg-primary/90 transition-smooth shadow-sm"
                  >
                    <Icon name="RefreshCw" size={16} strokeWidth={2} />
                    <span className="font-body text-sm font-medium">Generate Summary</span>
                  </button>
                </div>
              )}
              
              {/* Key Terms Legend */}
              {article?.keyTerms?.length > 0 && article?.summary && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-text-secondary mb-2 flex items-center">
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
              <h4 className="font-heading font-medium text-text-primary">
                Generated Questions
              </h4>
              <button
                onClick={() => onGenerateQuestions(article?.id)}
                disabled={isLoading}
                className="flex items-center space-x-2 px-3 py-2 text-primary hover:bg-primary/5 rounded-element transition-smooth disabled:opacity-50"
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
              {article?.questions?.length > 0 ? (
                article.questions.map((question, index) => (
                  <motion.div 
                    key={index} 
                    className="p-4 bg-accent/10 rounded-element border-l-4 border-accent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <p className="font-body text-text-primary">{question}</p>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Icon name="HelpCircle" size={32} className="text-text-secondary mb-4" strokeWidth={1.5} />
                  <p className="text-text-secondary mb-2">No questions generated yet</p>
                  <button
                    onClick={() => onGenerateQuestions(article?.id)}
                    className="flex items-center space-x-2 px-4 py-2 mt-2 bg-primary text-white rounded-element hover:bg-primary/90 transition-smooth shadow-sm"
                  >
                    <Icon name="Plus" size={16} strokeWidth={2} />
                    <span className="font-body text-sm font-medium">Generate Questions</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'keyterms' && (
          <div className="space-y-4">
            <h4 className="font-heading font-medium text-text-primary">
              Key Terms & Concepts
            </h4>
            {article?.keyTerms?.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {article.keyTerms.map((termObj, index) => {
                  const term = typeof termObj === 'string' ? termObj : termObj.term;
                  const definition = typeof termObj === 'object' ? termObj.definition : null;
                  const example = typeof termObj === 'object' ? termObj.example : null;
                  
                  return (
                    <motion.div 
                      key={index}
                      className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-element border border-accent/20 hover:border-accent/40 transition-all duration-200 cursor-pointer group"
                      onClick={() => onKeyTermClick(term)}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-body font-semibold text-text-primary mb-1 group-hover:text-accent transition-colors">
                            {term}
                          </h5>
                          {definition && (
                            <p className="font-body text-sm text-text-secondary mb-2 leading-relaxed">
                              {definition}
                            </p>
                          )}
                          {example && (
                            <p className="font-body text-xs text-text-secondary bg-background/70 px-2 py-1 rounded border">
                              <span className="font-medium">Example:</span> {example}
                            </p>
                          )}
                        </div>
                        <Icon name="ExternalLink" size={14} className="text-text-secondary group-hover:text-accent transition-colors mt-1 ml-2" strokeWidth={2} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Icon name="Tag" size={32} className="text-text-secondary mb-4" strokeWidth={1.5} />
                <p className="text-text-secondary mb-2">No key terms extracted yet</p>
                <p className="text-text-secondary text-sm max-w-md">
                  Key terms are automatically extracted when an article is analyzed. They help identify important concepts in the text.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-3 bg-surface rounded-element border border-border">
                  <label className="font-body text-sm font-medium text-text-secondary block mb-1">Word Count</label>
                  <p className="font-mono text-text-primary text-lg">{article?.metadata?.wordCount?.toLocaleString() || 'N/A'}</p>
                </div>
                <div className="p-3 bg-surface rounded-element border border-border">
                  <label className="font-body text-sm font-medium text-text-secondary block mb-1">Language</label>
                  <p className="font-body text-text-primary text-lg">{article?.metadata?.language || 'N/A'}</p>
                </div>
                <div className="p-3 bg-surface rounded-element border border-border">
                  <label className="font-body text-sm font-medium text-text-secondary block mb-1">Sentiment</label>
                  <p className="font-body text-text-primary text-lg">{article?.metadata?.sentiment || 'N/A'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-surface rounded-element border border-border">
                  <label className="font-body text-sm font-medium text-text-secondary block mb-1">Category</label>
                  <p className="font-body text-text-primary text-lg">{article?.metadata?.category || 'N/A'}</p>
                </div>
                <div className="p-3 bg-surface rounded-element border border-border">
                  <label className="font-body text-sm font-medium text-text-secondary block mb-1">Complexity</label>
                  <p className="font-body text-text-primary text-lg">{article?.metadata?.complexity || 'N/A'}</p>
                </div>
                <div className="p-3 bg-surface rounded-element border border-border">
                  <label className="font-body text-sm font-medium text-text-secondary block mb-1">Processed</label>
                  <p className="font-mono text-text-primary text-lg">
                    {article?.metadata?.processedAt ? new Date(article.metadata.processedAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <motion.div 
      className="bg-surface rounded-card border border-border shadow-card hover:shadow-card-hover transition-smooth"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      {cardContent}
      
      {/* Enhanced Tooltip */}
      {tooltipPosition && (
        <div
          className="fixed z-50 px-4 py-3 bg-gray-900 text-white rounded-element shadow-floating font-body text-sm animate-fade-in pointer-events-none max-w-xs transition-opacity"
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
    </motion.div>
  );
}

export default ResultCard;