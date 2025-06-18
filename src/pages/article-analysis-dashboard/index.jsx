// src/pages/article-analysis-dashboard/index.jsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import UrlInputForm from '@/components/UrlInputForm';
import ProgressIndicator from '@/components/ProgressIndicator';
import Header from '@/components/Header'; // Assuming Header is in this path
import Icon from '@/components/AppIcon'; // Assuming Icon is in this path

const ArticleAnalysisDashboard = () => {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [urls, setUrls] = useState('');
  const [error, setError] = useState(null);

  // This state is for the ProgressIndicator, assuming you want to pass data to it
  const [processingArticles, setProcessingArticles] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);


  const handleSubmit = async (urlInput) => {
    const urlList = urlInput.split('\n').filter(url => url.trim().length > 0);
    if (urlList.length === 0) {
        setError("Please enter at least one URL.");
        return;
    }

    setProcessing(true);
    setProcessingArticles(urlList.map(url => ({ url, status: 'processing' })));
    setCurrentStep(0);
    setError(null);

    try {
      // Simulate progress for demonstration
      setCurrentStep(1); // Fetching
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls: urlList })
      });
      
      setCurrentStep(2); // Analyzing

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }

      const data = await response.json();
      
      setCurrentStep(3); // Generating Summary

      // Store results in session storage for the results page
      sessionStorage.setItem('analysisResults', JSON.stringify({
        results: data.results,
        errors: data.errors,
        processedAt: data.processedAt
      }));
      
      setCurrentStep(4); // Complete
      
      // Redirect after a short delay to show completion
      setTimeout(() => {
          router.push('/article-processing-results');
      }, 1000);

    } catch (err) {
      setError(`Processing failed: ${err.message}`);
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Page Header */}
            <h1 className="font-heading text-4xl font-bold text-text-primary mb-2">
              Article Analysis Dashboard
            </h1>
            <p className="font-body text-lg text-text-secondary mb-8">
              Enter article URLs below to analyze their content and generate summaries.
            </p>

            {/* Error Display using a simple div and Tailwind classes */}
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md mb-6" role="alert">
                <div className="flex">
                    <div className="py-1">
                        <Icon name="AlertTriangle" size={20} className="text-red-600" strokeWidth={2}/>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                </div>
              </div>
            )}
            
            {/* The main content area */}
            <UrlInputForm
                value={urls}
                onChange={setUrls}
                onSubmit={handleSubmit}
                isProcessing={processing}
            />

            <ProgressIndicator
                isVisible={processing}
                processingArticles={processingArticles}
                currentStep={currentStep}
            />
        </div>
      </main>
    </div>
  );
};

export default ArticleAnalysisDashboard;