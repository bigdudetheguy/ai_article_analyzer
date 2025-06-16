// src/pages/article-processing-results/index.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ResultCard from './components/ResultCard';
import FilterControls from './components/FilterControls';
import Icon from '../../components/AppIcon';

function ArticleProcessingResults() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    sentiment: 'all',
    complexity: 'all',
    sortBy: 'recent'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'list'
  const [errors, setErrors] = useState([]);

  // Enhanced mock data generator
  const generateMockData = () => {
    const mockResults = [
      {
        id: 'article-1',
        title: 'The Future of Artificial Intelligence in Healthcare: Transforming Patient Care Through Machine Learning',
        url: 'https://techjournal.com/ai-healthcare-future',
        summary: `Artificial intelligence is revolutionizing healthcare by enabling more accurate diagnoses, personalized treatment plans, and predictive analytics. Machine learning algorithms can analyze vast amounts of medical data to identify patterns that human doctors might miss, leading to earlier detection of diseases and more effective treatments. The integration of AI in healthcare systems is not just improving patient outcomes but also reducing costs and increasing efficiency across medical institutions.\n\nThe technology is particularly promising in areas such as medical imaging, where AI can detect anomalies in X-rays, MRIs, and CT scans with remarkable precision. Additionally, AI-powered drug discovery is accelerating the development of new medications, potentially reducing the time from research to market by several years.\n\nHowever, the implementation of AI in healthcare also presents challenges, including data privacy concerns, the need for regulatory approval, and ensuring that AI systems are interpretable and trustworthy. Healthcare professionals must be trained to work alongside AI systems, and patients need to be educated about how AI is being used in their care.`,
        keyTerms: [
          { term: 'Machine Learning', definition: 'A subset of AI that enables computers to learn and improve from experience without being explicitly programmed', example: 'Used in medical imaging to detect cancer cells' },
          { term: 'Predictive Analytics', definition: 'The use of data, statistical algorithms and machine learning techniques to identify future outcomes', example: 'Predicting patient readmission rates' },
          { term: 'Medical Imaging', definition: 'Technique of creating visual representations of the interior of a body for clinical analysis', example: 'X-rays, MRIs, CT scans' },
          { term: 'Drug Discovery', definition: 'The process of finding new medications through research and development', example: 'AI identifying potential compounds for COVID-19 treatment' },
          { term: 'Personalized Treatment', definition: 'Medical care tailored to individual patient characteristics and needs', example: 'Custom cancer therapy based on genetic markers' }
        ],
        questions: [
          'How might AI-powered diagnostics change the role of healthcare professionals in patient care?',
          'What ethical considerations arise when AI systems make medical decisions that affect human lives?',
          'How can healthcare institutions ensure data privacy while leveraging AI for better patient outcomes?',
          'What are the potential risks of over-relying on AI for medical diagnoses?',
          'How can we ensure that AI healthcare solutions are accessible to underserved communities?'
        ],
        metadata: {
          author: 'Dr. Sarah Chen',
          publishDate: '2024-01-15',
          readTime: '8 min read',
          wordCount: 2450,
          language: 'English',
          sentiment: 'Optimistic',
          category: 'Healthcare Technology',
          complexity: 'Intermediate',
          processedAt: new Date().toISOString(),
          image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        status: 'completed',
        error: null
      },
      {
        id: 'article-2',
        title: 'Sustainable Energy Solutions: The Rise of Solar and Wind Power Technologies',
        url: 'https://energytoday.com/sustainable-solutions-2024',
        summary: `The global shift towards sustainable energy has accelerated dramatically in recent years, with solar and wind power leading the charge in renewable energy adoption. Recent technological advances have made these energy sources more efficient and cost-effective than ever before, challenging the dominance of traditional fossil fuels.\n\nSolar panel efficiency has improved significantly, with new photovoltaic technologies achieving conversion rates of over 20%, while costs have plummeted by more than 80% in the last decade. Similarly, wind turbines have become larger and more efficient, with offshore wind farms generating unprecedented amounts of clean energy.\n\nGovernments worldwide are implementing policies to support renewable energy adoption, including subsidies, tax incentives, and mandates for clean energy usage. The private sector is also investing heavily in renewable infrastructure, recognizing both the environmental benefits and the long-term economic advantages of sustainable energy solutions.`,
        keyTerms: [
          { term: 'Photovoltaic', definition: 'Technology that converts sunlight directly into electricity using semiconducting materials', example: 'Solar panels on residential rooftops' },
          { term: 'Renewable Energy', definition: 'Energy from sources that are naturally replenishing and virtually inexhaustible', example: 'Solar, wind, hydro, and geothermal power' },
          { term: 'Energy Storage', definition: 'Methods of storing energy for later use when renewable sources are not available', example: 'Battery systems for solar power' },
          { term: 'Grid Integration', definition: 'The process of connecting renewable energy sources to the electrical grid', example: 'Smart grid systems managing variable wind power' },
          { term: 'Carbon Footprint', definition: 'The total amount of greenhouse gases produced by human activities', example: 'Measuring emissions from energy consumption' }
        ],
        questions: [
          'What are the main challenges in scaling up renewable energy infrastructure globally?',
          'How do energy storage technologies impact the viability of renewable energy?',
          'What role do government policies play in accelerating renewable energy adoption?',
          'How can developing countries overcome barriers to renewable energy implementation?',
          'What are the economic implications of transitioning from fossil fuels to renewable energy?'
        ],
        metadata: {
          author: 'Prof. Michael Rodriguez',
          publishDate: '2024-01-20',
          readTime: '6 min read',
          wordCount: 1960,
          language: 'English',
          sentiment: 'Positive',
          category: 'Sustainable Technology',
          complexity: 'Intermediate',
          processedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        status: 'completed',
        error: null
      },
      {
        id: 'article-3',
        title: 'The Evolution of Remote Work: Impact on Business Culture and Productivity',
        url: 'https://businessinsights.com/remote-work-evolution',
        summary: `The COVID-19 pandemic fundamentally changed how we think about work, accelerating the adoption of remote work practices that were previously considered experimental. Organizations worldwide have had to rapidly adapt their operations, communication strategies, and management approaches to accommodate distributed teams.\n\nStudies show that remote work has had mixed effects on productivity, with some workers reporting increased focus and work-life balance, while others struggle with isolation and communication challenges. The key to successful remote work lies in implementing the right technologies, establishing clear communication protocols, and maintaining strong company culture despite physical distance.\n\nAs we move forward, hybrid work models are emerging as the preferred approach for many organizations, combining the benefits of in-person collaboration with the flexibility of remote work. This evolution is reshaping not just how we work, but also urban planning, real estate markets, and the broader economy.`,
        keyTerms: [
          { term: 'Distributed Teams', definition: 'Work teams whose members are geographically dispersed and collaborate using technology', example: 'Software development teams across multiple countries' },
          { term: 'Hybrid Work Model', definition: 'A flexible work arrangement combining remote and in-office work', example: 'Employees working from home 2-3 days per week' },
          { term: 'Digital Collaboration', definition: 'The use of digital tools and platforms to enable teamwork across distances', example: 'Video conferencing and shared document editing' },
          { term: 'Work-Life Balance', definition: 'The equilibrium between personal life and career work', example: 'Flexible schedules allowing family time' },
          { term: 'Asynchronous Communication', definition: 'Communication that does not require immediate response from all participants', example: 'Email and project management tools' }
        ],
        questions: [
          'How can organizations maintain company culture in a remote work environment?',
          'What are the long-term implications of remote work on urban development and housing markets?',
          'How do different industries adapt to remote work challenges and opportunities?',
          'What role does technology play in enabling effective remote collaboration?',
          'How can managers effectively lead and motivate remote teams?'
        ],
        metadata: {
          author: 'Emily Thompson',
          publishDate: '2024-01-18',
          readTime: '7 min read',
          wordCount: 2100,
          language: 'English',
          sentiment: 'Analytical',
          category: 'Business Strategy',
          complexity: 'Beginner',
          processedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        status: 'completed',
        error: null
      }
    ];
    
    return mockResults;
  };

  useEffect(() => {
    const loadResults = () => {
      setIsLoading(true);
      
      try {
        // Try to load from session storage first
        const storedData = sessionStorage.getItem('analysisResults');
        
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          console.log('Loaded data from session storage:', parsedData);
          
          if (parsedData.results && Array.isArray(parsedData.results) && parsedData.results.length > 0) {
            setResults(parsedData.results);
            setFilteredResults(parsedData.results);
            setErrors(parsedData.errors || []);
          } else {
            // If stored results are empty, load mock data
            console.log('Session storage results are empty, loading mock data');
            const mockData = generateMockData();
            setResults(mockData);
            setFilteredResults(mockData);
          }
        } else {
          // No stored data, load mock data
          console.log('No session storage data found, loading mock data');
          const mockData = generateMockData();
          setResults(mockData);
          setFilteredResults(mockData);
        }
      } catch (error) {
        console.error('Error loading results:', error);
        // Fallback to mock data on any error
        const mockData = generateMockData();
        setResults(mockData);
        setFilteredResults(mockData);
      }
      
      setIsLoading(false);
    };

    loadResults();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let filtered = results.filter(article => {
      const matchesSearch = searchQuery === '' || 
        article?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article?.summary?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = filters.category === 'all' || 
        article?.metadata?.category?.toLowerCase().includes(filters.category.toLowerCase());
      
      const matchesSentiment = filters.sentiment === 'all' || 
        article?.metadata?.sentiment?.toLowerCase() === filters.sentiment.toLowerCase();
      
      const matchesComplexity = filters.complexity === 'all' || 
        article?.metadata?.complexity?.toLowerCase() === filters.complexity.toLowerCase();

      return matchesSearch && matchesCategory && matchesSentiment && matchesComplexity;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'recent':
          return new Date(b?.metadata?.processedAt || 0) - new Date(a?.metadata?.processedAt || 0);
        case 'oldest':
          return new Date(a?.metadata?.processedAt || 0) - new Date(b?.metadata?.processedAt || 0);
        case 'title':
          return (a?.title || '').localeCompare(b?.title || '');
        case 'readTime':
          return parseInt(a?.metadata?.readTime || '0') - parseInt(b?.metadata?.readTime || '0');
        default:
          return 0;
      }
    });

    setFilteredResults(filtered);
  }, [results, filters, searchQuery]);

  const handleRewriteSummary = (articleId, level) => {
    setIsLoading(true);
    
    // Find the article
    const article = results.find(a => a.id === articleId);
    if (!article) {
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const rewriteLevels = {
        simple: `[SIMPLE] ${article.title} explains key concepts in easy-to-understand terms. The main points are presented clearly for general readers who want to grasp the basics without complex technical details.`,
        normal: article.summary, // Keep original
        detailed: `[DETAILED] ${article.summary}\n\nThis comprehensive analysis includes additional context, supporting evidence, and detailed explanations of methodologies. The extended discussion provides deeper insights into implications and practical applications, making it valuable for readers seeking thorough understanding.`,
        extra: `[EXTRA DETAILED] ${article.summary}\n\nThis exhaustive examination includes comprehensive background information, detailed methodological discussions, extensive case studies, and comparative analysis with related concepts. The content explores multiple perspectives, theoretical foundations, and practical implications while addressing potential limitations and future directions. This level of detail is particularly valuable for researchers, practitioners, and advanced students in the field.`
      };
      
      setResults(prev => prev.map(a => 
        a.id === articleId 
          ? { 
              ...a, 
              summary: rewriteLevels[level] || a.summary,
              metadata: {
                ...a.metadata,
                lastRewriteLevel: level,
                lastRewriteAt: new Date().toISOString()
              }
            }
          : a
      ));
      setIsLoading(false);
    }, 2000);
  };

  const handleGenerateQuestions = (articleId) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const additionalQuestions = [
        'What are the potential unintended consequences of this development?',
        'How might this trend evolve over the next decade?',
        'What role do stakeholders play in shaping these outcomes?',
        'What alternative approaches could be considered?',
        'How does this relate to current industry best practices?'
      ];
      
      setResults(prev => prev.map(article => 
        article.id === articleId 
          ? { 
              ...article, 
              questions: [...(article.questions || []), ...additionalQuestions.slice(0, 3)] 
            }
          : article
      ));
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyTermClick = (term) => {
    setSearchQuery(term);
  };

  const handleSelectArticle = (articleId) => {
    setSelectedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const handleBulkAction = (action) => {
    console.log(`Performing ${action} on articles:`, selectedArticles);
    // Implement bulk actions like export, delete, etc.
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const completedResults = filteredResults.filter(article => article?.status === 'completed');
  const errorResults = filteredResults.filter(article => article?.status === 'error');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <motion.div 
            className="mb-12 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mb-4 shadow-lg">
                <Icon name="FileText" size={32} color="white" strokeWidth={1.5} />
              </div>
              <h1 className="font-heading text-5xl md:text-6xl font-bold text-text-primary mb-4 tracking-tight">
                Analysis
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Results</span>
              </h1>
              <p className="font-body text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
                Comprehensive insights and analysis from your processed articles
              </p>
              
              {/* Back to Dashboard Button */}
              <div className="mt-6">
                <button
                  onClick={handleBackToDashboard}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Icon name="ArrowLeft" size={18} strokeWidth={2} />
                  <span className="font-body font-medium">Back to Dashboard</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="bg-surface rounded-card border border-border p-6 shadow-card hover:shadow-card-hover transition-smooth"
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-success/20 to-success/10 rounded-full flex items-center justify-center">
                  <Icon name="CheckCircle" size={24} color="var(--color-success)" strokeWidth={2} />
                </div>
                <div>
                  <p className="font-heading text-3xl font-bold text-text-primary">
                    {completedResults.length}
                  </p>
                  <p className="font-body text-text-secondary">Processed</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-surface rounded-card border border-border p-6 shadow-card hover:shadow-card-hover transition-smooth"
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-error/20 to-error/10 rounded-full flex items-center justify-center">
                  <Icon name="AlertCircle" size={24} color="var(--color-error)" strokeWidth={2} />
                </div>
                <div>
                  <p className="font-heading text-3xl font-bold text-text-primary">
                    {errorResults.length}
                  </p>
                  <p className="font-body text-text-secondary">Errors</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-surface rounded-card border border-border p-6 shadow-card hover:shadow-card-hover transition-smooth"
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center">
                  <Icon name="FileText" size={24} color="var(--color-accent)" strokeWidth={2} />
                </div>
                <div>
                  <p className="font-heading text-3xl font-bold text-text-primary">
                    {completedResults.reduce((sum, article) => sum + (article?.metadata?.wordCount || 0), 0).toLocaleString()}
                  </p>
                  <p className="font-body text-text-secondary">Total Words</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-surface rounded-card border border-border p-6 shadow-card hover:shadow-card-hover transition-smooth"
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="Clock" size={24} color="var(--color-primary)" strokeWidth={2} />
                </div>
                <div>
                  <p className="font-heading text-3xl font-bold text-text-primary">
                    {completedResults.reduce((sum, article) => sum + parseInt(article?.metadata?.readTime || '0'), 0)}
                  </p>
                  <p className="font-body text-text-secondary">Min Read</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Controls Section */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-surface rounded-card border border-border p-6 shadow-card">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
                {/* Search */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Icon 
                      name="Search" 
                      size={20} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
                      strokeWidth={2}
                    />
                    <input
                      type="text"
                      placeholder="Search articles, terms, or content..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-element bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-smooth"
                      >
                        <Icon name="X" size={16} strokeWidth={2} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Controls and View Toggle */}
                <div className="flex items-center space-x-4">
                  <FilterControls 
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                  
                  {/* View Mode Toggle */}
                  <div className="hidden md:flex items-center border border-border rounded-element p-1 bg-background">
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`p-2 rounded-sm transition-smooth ${
                        viewMode === 'cards' ?'bg-primary text-white shadow-sm' :'text-text-secondary hover:text-text-primary hover:bg-surface'
                      }`}
                      title="Card View"
                    >
                      <Icon name="Grid3X3" size={16} strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-sm transition-smooth ${
                        viewMode === 'list' ?'bg-primary text-white shadow-sm' :'text-text-secondary hover:text-text-primary hover:bg-surface'
                      }`}
                      title="List View"
                    >
                      <Icon name="List" size={16} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedArticles.length > 0 && (
                <motion.div 
                  className="mt-4 pt-4 border-t border-border flex items-center justify-between"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-body text-sm text-text-secondary">
                      {selectedArticles.length} article{selectedArticles.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleBulkAction('export')}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-element hover:bg-primary/90 transition-smooth"
                    >
                      <Icon name="Download" size={16} strokeWidth={2} />
                      <span className="font-body text-sm font-medium">Export</span>
                    </button>
                    <button
                      onClick={() => setSelectedArticles([])}
                      className="flex items-center space-x-2 px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-element transition-smooth"
                    >
                      <Icon name="X" size={16} strokeWidth={2} />
                      <span className="font-body text-sm font-medium">Clear</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Results Section */}
          {isLoading ? (
            <motion.div 
              className="flex flex-col items-center justify-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-4">
                <Icon name="Loader2" size={24} className="animate-spin text-white" strokeWidth={2} />
              </div>
              <h3 className="font-heading text-lg font-medium text-text-primary mb-2">
                Loading Results
              </h3>
              <p className="font-body text-text-secondary">Gathering your analyzed articles...</p>
            </motion.div>
          ) : filteredResults.length === 0 ? (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-text-secondary/10 to-text-secondary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="FileSearch" size={40} color="var(--color-text-secondary)" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-text-primary mb-3">
                No Results Found
              </h3>
              <p className="font-body text-lg text-text-secondary mb-8 max-w-md mx-auto">
                {searchQuery || Object.values(filters).some(f => f !== 'all' && f !== 'recent')
                  ? 'Try adjusting your search or filter criteria to find what you\'re looking for'
                  : 'No articles have been processed yet. Start by analyzing some articles in the dashboard'
                }
              </p>
              {(searchQuery || Object.values(filters).some(f => f !== 'all' && f !== 'recent')) ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({
                      category: 'all',
                      sentiment: 'all',
                      complexity: 'all',
                      sortBy: 'recent'
                    });
                  }}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-element hover:bg-primary/90 transition-smooth shadow-md hover:shadow-lg"
                >
                  <Icon name="RotateCcw" size={18} strokeWidth={2} />
                  <span className="font-body font-medium">Clear All Filters</span>
                </button>
              ) : (
                <button
                  onClick={handleBackToDashboard}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-element hover:bg-primary/90 transition-smooth shadow-md hover:shadow-lg"
                >
                  <Icon name="ArrowLeft" size={18} strokeWidth={2} />
                  <span className="font-body font-medium">Go to Dashboard</span>
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredResults.map((article, index) => (
                <motion.div 
                  key={article?.id || `article-${index}`}
                  variants={itemVariants}
                  className="group"
                >
                  <ResultCard
                    article={article}
                    onRewriteSummary={handleRewriteSummary}
                    onGenerateQuestions={handleGenerateQuestions}
                    onKeyTermClick={handleKeyTermClick}
                    onSelect={handleSelectArticle}
                    isSelected={selectedArticles.includes(article?.id)}
                    isLoading={isLoading}
                    viewMode={viewMode}
                  />
                  {index < filteredResults.length - 1 && (
                    <div className="border-t border-border/50 my-8 opacity-0 group-hover:opacity-100 transition-smooth"></div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ArticleProcessingResults;