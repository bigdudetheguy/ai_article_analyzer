// src/pages/article-analysis-dashboard/index.jsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import UrlInputForm from './components/UrlInputForm';
import ErrorDisplay from './components/ErrorDisplay';
import Icon from '../../components/AppIcon';

function ArticleAnalysisDashboard() {
  const navigate = useNavigate();
  const [urls, setUrls] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [processingArticles, setProcessingArticles] = useState([]);
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});

  // Mock CORS proxies for fallback
  const corsProxies = [
    'https://api.allorigins.win/get?url=',
    'https://cors-anywhere.herokuapp.com/',
    'https://thingproxy.freeboard.io/fetch/'
  ];

  // Function to extract article content from a URL
  const extractArticleContent = async (url) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Mock article titles based on common topics
    const mockTitles = [
      'Advanced Machine Learning Techniques for Content Analysis',
      'The Future of Artificial Intelligence in Data Processing',
      'Understanding Natural Language Processing Applications',
      'Deep Learning Approaches to Text Mining and Analysis',
      'Innovative Methods in Automated Content Generation',
      'Exploring Neural Networks for Information Extraction',
      'Modern Approaches to Semantic Text Analysis',
      'AI-Powered Solutions for Content Optimization',
      'Breakthrough Technologies in Language Understanding',
      'Next-Generation Tools for Digital Content Analysis'
    ];

    const title = mockTitles[Math.floor(Math.random() * mockTitles.length)];
    
    // Simulate potential errors
    if (Math.random() < 0.1) {
      throw new Error('FETCH-001: Unable to fetch article content');
    }
    
    if (Math.random() < 0.05) {
      throw new Error('EXT-002: Failed to extract article text');
    }

    return { title, content: `Mock content for ${title}` };
  };

  // Mock Gemini API response generator
  const generateMockAnalysis = (title, url) => {
    const mockSummaries = {
      simple: `This article explains ${title.toLowerCase()} in easy terms. It covers the main points and basic concepts. The information is presented clearly for general readers.`,
      normal: `This article discusses ${title.toLowerCase()} and provides comprehensive insights into the topic. It explores key concepts, methodologies, and practical applications. The content offers valuable perspectives for readers interested in understanding the subject matter more deeply.`,
      detailed: `This comprehensive article examines ${title.toLowerCase()} through multiple lenses, providing detailed analysis of core concepts, methodologies, and real-world applications. The author presents well-researched information supported by examples and case studies. The content explores various perspectives and offers practical insights that readers can apply in their own contexts. The discussion includes both theoretical foundations and practical implications.`,
      extra: `This in-depth article provides an exhaustive examination of ${title.toLowerCase()}, offering comprehensive analysis across multiple dimensions of the topic. The author meticulously explores theoretical foundations, practical applications, case studies, and emerging trends. The content includes detailed methodological discussions, comparative analysis with related concepts, and extensive real-world examples. The article synthesizes information from various sources and presents nuanced perspectives that contribute to a deeper understanding of the subject matter. The discussion encompasses both current state-of-the-art approaches and future directions, making it valuable for both practitioners and researchers in the field.`
    };

    const keyTerms = [
      { term: 'Artificial Intelligence', definition: 'Computer systems able to perform tasks that typically require human intelligence', example: 'Used in medical imaging to detect cancer cells' },
      { term: 'Machine Learning', definition: 'A subset of AI that enables computers to learn and improve from experience', example: 'Predicting customer behavior from data' },
      { term: 'Data Analysis', definition: 'Process of inspecting, cleansing, and modeling data to discover useful information', example: 'Analyzing sales data to identify trends' },
      { term: 'Content Processing', definition: 'Automated analysis and manipulation of digital content', example: 'Text summarization and keyword extraction' },
      { term: 'Natural Language Processing', definition: 'AI technology that helps computers understand human language', example: 'Language translation and sentiment analysis' },
      { term: 'Text Mining', definition: 'Process of deriving high-quality information from text', example: 'Extracting insights from customer reviews' },
      { term: 'Information Extraction', definition: 'Process of automatically extracting structured information from unstructured text', example: 'Extracting names and dates from documents' },
      { term: 'Semantic Analysis', definition: 'Study of meaning in language through computational methods', example: 'Understanding context and intent in text' },
      { term: 'Deep Learning', definition: 'Machine learning technique using artificial neural networks', example: 'Image recognition and speech processing' },
      { term: 'Neural Networks', definition: 'Computing systems inspired by biological neural networks', example: 'Pattern recognition and classification' },
      { term: 'Algorithm Optimization', definition: 'Process of making algorithms more efficient and effective', example: 'Improving search algorithms for better performance' },
      { term: 'Data Visualization', definition: 'Graphical representation of information and data', example: 'Charts, graphs, and interactive dashboards' }
    ];

    const questions = [
      `What are the primary implications of the concepts discussed in "${title}"?`,
      `How can the methodologies presented in this article be applied in practical scenarios?`,
      `What are the potential challenges and limitations mentioned in the analysis?`,
      `How does this article's perspective compare to current industry standards?`,
      `What future developments or trends are suggested by the content?`
    ];

    return {
      id: `article-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      url,
      summary: mockSummaries.normal,
      keyTerms: keyTerms.slice(0, 5 + Math.floor(Math.random() * 3)),
      questions: questions.slice(0, 3 + Math.floor(Math.random() * 2)),
      metadata: {
        wordCount: Math.floor(Math.random() * 2000) + 800,
        readTime: Math.floor(Math.random() * 8) + 3,
        author: ['Dr. Sarah Johnson', 'Michael Chen', 'Prof. Emily Rodriguez', 'David Kim'][Math.floor(Math.random() * 4)],
        publishDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        language: 'English',
        sentiment: ['Positive', 'Neutral', 'Analytical'][Math.floor(Math.random() * 3)],
        category: ['Technology', 'Science', 'Business', 'Research'][Math.floor(Math.random() * 4)],
        complexity: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
        processedAt: new Date().toISOString(),
        image: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`
      },
      status: 'completed',
      error: null
    };
  };

  // Process articles sequentially
  const processArticles = async (urlList) => {
    setIsProcessing(true);
    setProcessingStep(0);
    setResults([]);
    setErrors([]);
    
    const articles = urlList.map((url, index) => ({
      id: `article-${index}`,
      url: url.trim(),
      status: 'queued'
    }));
    
    setProcessingArticles(articles);
    const completedResults = [];
    const processingErrors = [];

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      
      try {
        // Update processing status
        setProcessingArticles(prev => 
          prev.map(a => a.id === article.id ? { ...a, status: 'processing' } : a)
        );
        
        // Step 1: Fetching Content
        setProcessingStep(0);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { title, content } = await extractArticleContent(article.url);
        
        // Step 2: Analyzing Text
        setProcessingStep(1);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Step 3: Generating Summary
        setProcessingStep(2);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const analysis = generateMockAnalysis(title, article.url);
        
        // Step 4: Processing Complete
        setProcessingStep(3);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Update article status
        setProcessingArticles(prev => 
          prev.map(a => a.id === article.id ? { ...a, status: 'completed' } : a)
        );
        
        // Add result
        completedResults.push(analysis);
        setResults(prev => [...prev, analysis]);
        
      } catch (error) {
        console.error(`Error processing ${article.url}:`, error);
        
        setProcessingArticles(prev => 
          prev.map(a => a.id === article.id ? { ...a, status: 'error' } : a)
        );
        
        const errorObj = {
          id: article.id,
          url: article.url,
          message: error.message || 'Unknown error occurred',
          code: error.message.includes('FETCH-001') ? 'FETCH-001' : 
                error.message.includes('EXT-002') ? 'EXT-002' : 'NET-005'
        };
        
        processingErrors.push(errorObj);
        setErrors(prev => [...prev, errorObj]);
      }
    }
    
    setIsProcessing(false);
    setProcessingStep(0);
    
    // Navigate to results page with processed data
    if (completedResults.length > 0 || processingErrors.length > 0) {
      // Store results in session storage for the results page
      sessionStorage.setItem('analysisResults', JSON.stringify({
        results: completedResults,
        errors: processingErrors,
        processedAt: new Date().toISOString()
      }));
      
      // Navigate to results page
      navigate('/article-processing-results');
    }
  };

  const handleSubmit = (urlText) => {
    const urlList = urlText
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);
    
    if (urlList.length === 0) {
      setErrors([{ message: 'Please enter at least one valid URL', code: 'INPUT-001' }]);
      return;
    }
    
    processArticles(urlList);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="text-center mb-10">
            <h1 className="font-heading text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
              AI Article Analyzer
            </h1>
            <p className="font-body text-lg text-gray-700 max-w-2xl mx-auto">
              Analyze multiple articles simultaneously with AI-powered content extraction, 
              intelligent summarization, and interactive insights generation.
            </p>
          </div>

          {/* URL Input Form */}
          <UrlInputForm 
            value={urls}
            onChange={setUrls}
            onSubmit={handleSubmit}
            isProcessing={isProcessing}
          />

          {/* Error Display */}
          {errors?.length > 0 && (
            <ErrorDisplay errors={errors} onDismiss={() => setErrors([])} />
          )}

          {/* Progress Indicator */}
          <ProgressIndicator
            processingArticles={processingArticles}
            currentStep={processingStep}
            totalSteps={4}
            isVisible={isProcessing}
          />

          {/* Processing Status */}
          {isProcessing && (
            <div className="mt-8 text-center animate-fade-in">
              <div className="inline-flex items-center space-x-3 px-6 py-4 bg-white rounded-lg shadow-md border border-gray-200">
                <Icon name="Loader2" size={20} className="animate-spin text-indigo-600" strokeWidth={2} />
                <span className="font-body text-gray-700">
                  Processing articles... This may take a few minutes.
                </span>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isProcessing && results?.length === 0 && errors?.length === 0 && (
            <div className="text-center py-16 mt-8 bg-white rounded-2xl shadow-md border border-gray-200 transition-all duration-200">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="FileText" size={36} className="text-indigo-600" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3">
                Ready to Analyze Articles
              </h3>
              <p className="font-body text-gray-700 max-w-md mx-auto">
                Enter article URLs above to get started with AI-powered content analysis
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ArticleAnalysisDashboard;