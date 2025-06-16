import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

function FilterControls({ filters, onFiltersChange }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const filterOptions = {
    category: [
      { value: 'all', label: 'All Categories' },
      { value: 'technology', label: 'Technology' },
      { value: 'healthcare', label: 'Healthcare' },
      { value: 'business', label: 'Business' },
      { value: 'environmental', label: 'Environmental' },
      { value: 'education', label: 'Education' },
      { value: 'science', label: 'Science' }
    ],
    sentiment: [
      { value: 'all', label: 'All Sentiments' },
      { value: 'positive', label: 'Positive' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'negative', label: 'Negative' },
      { value: 'optimistic', label: 'Optimistic' }
    ],
    complexity: [
      { value: 'all', label: 'All Levels' },
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
      { value: 'expert', label: 'Expert' }
    ],
    sortBy: [
      { value: 'recent', label: 'Most Recent' },
      { value: 'oldest', label: 'Oldest First' },
      { value: 'title', label: 'Title A-Z' },
      { value: 'readTime', label: 'Reading Time' }
    ]
  };

  const handleFilterChange = (filterType, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearAllFilters = () => {
    onFiltersChange({
      category: 'all',
      sentiment: 'all',
      complexity: 'all',
      sortBy: 'recent'
    });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => 
    key !== 'sortBy' && value !== 'all'
  );

  return (
    <div className="flex items-center space-x-4">
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="lg:hidden flex items-center space-x-2 px-3 py-2 border border-border rounded-element bg-surface text-text-primary hover:bg-background transition-smooth"
      >
        <Icon name="Filter" size={16} strokeWidth={2} />
        <span className="font-body text-sm font-medium">Filters</span>
        {hasActiveFilters && (
          <span className="w-2 h-2 bg-primary rounded-full"></span>
        )}
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          strokeWidth={2} 
        />
      </button>

      {/* Desktop Filters */}
      <div className="hidden lg:flex items-center space-x-4">
        {/* Category Filter */}
        <div className="relative">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="appearance-none bg-surface border border-border rounded-element px-3 py-2 pr-8 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth"
          >
            {filterOptions.category.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Icon 
            name="ChevronDown" 
            size={16} 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" 
            strokeWidth={2}
          />
        </div>

        {/* Sentiment Filter */}
        <div className="relative">
          <select
            value={filters.sentiment}
            onChange={(e) => handleFilterChange('sentiment', e.target.value)}
            className="appearance-none bg-surface border border-border rounded-element px-3 py-2 pr-8 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth"
          >
            {filterOptions.sentiment.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Icon 
            name="ChevronDown" 
            size={16} 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" 
            strokeWidth={2}
          />
        </div>

        {/* Complexity Filter */}
        <div className="relative">
          <select
            value={filters.complexity}
            onChange={(e) => handleFilterChange('complexity', e.target.value)}
            className="appearance-none bg-surface border border-border rounded-element px-3 py-2 pr-8 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth"
          >
            {filterOptions.complexity.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Icon 
            name="ChevronDown" 
            size={16} 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" 
            strokeWidth={2}
          />
        </div>

        {/* Sort By */}
        <div className="relative">
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="appearance-none bg-surface border border-border rounded-element px-3 py-2 pr-8 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth"
          >
            {filterOptions.sortBy.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Icon 
            name="ChevronDown" 
            size={16} 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" 
            strokeWidth={2}
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center space-x-2 px-3 py-2 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-element transition-smooth"
          >
            <Icon name="X" size={16} strokeWidth={2} />
            <span className="font-body text-sm font-medium">Clear</span>
          </button>
        )}
      </div>

      {/* Mobile Expanded Filters */}
      {isExpanded && (
        <div className="lg:hidden absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-card shadow-card z-10 p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block font-body text-sm font-medium text-text-primary mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full appearance-none bg-surface border border-border rounded-element px-3 py-2 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth"
              >
                {filterOptions.category.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sentiment */}
            <div>
              <label className="block font-body text-sm font-medium text-text-primary mb-2">
                Sentiment
              </label>
              <select
                value={filters.sentiment}
                onChange={(e) => handleFilterChange('sentiment', e.target.value)}
                className="w-full appearance-none bg-surface border border-border rounded-element px-3 py-2 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth"
              >
                {filterOptions.sentiment.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Complexity */}
            <div>
              <label className="block font-body text-sm font-medium text-text-primary mb-2">
                Complexity
              </label>
              <select
                value={filters.complexity}
                onChange={(e) => handleFilterChange('complexity', e.target.value)}
                className="w-full appearance-none bg-surface border border-border rounded-element px-3 py-2 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth"
              >
                {filterOptions.complexity.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block font-body text-sm font-medium text-text-primary mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full appearance-none bg-surface border border-border rounded-element px-3 py-2 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth"
              >
                {filterOptions.sortBy.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile Clear Filters */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-border">
              <button
                onClick={() => {
                  clearAllFilters();
                  setIsExpanded(false);
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-element transition-smooth"
              >
                <Icon name="RotateCcw" size={16} strokeWidth={2} />
                <span className="font-body text-sm font-medium">Clear All Filters</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FilterControls;