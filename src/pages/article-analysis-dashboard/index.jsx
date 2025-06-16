import React, { useState } from 'react';
import { useRouter } from 'next/router';
import UrlInputForm from '@/components/UrlInputForm';
import ProgressIndicator from '@/components/ProgressIndicator';
import { Box, Container, Typography, Alert } from '@mui/material';

const ArticleAnalysisDashboard = () => {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleSubmit = async (urlList) => {
    setProcessing(true);
    setProgress(0);
    setError(null);

    try {
      await processArticles(urlList);
      router.push('/article-processing-results');
    } catch (err) {
      setError(`Processing failed: ${err.message}`);
      setProcessing(false);
    }
  };

  const processArticles = async (urlList) => {
    try {
      // Show initial progress
      setProgress(10);

      // Make API call to the backend
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls: urlList })
      });

      // Update progress to indicate API call complete
      setProgress(50);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }

      const data = await response.json();
      setProgress(90);

      // Store results in session storage for the results page
      sessionStorage.setItem('analysisResults', JSON.stringify({
        results: data.results,
        errors: data.errors,
        processedAt: data.processedAt
      }));

      // Complete progress
      setProgress(100);
      return data;
    } catch (error) {
      console.error('Error processing articles:', error);
      throw error;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Article Analysis Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Enter article URLs below to analyze their content and generate summaries.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {processing ? (
          <ProgressIndicator progress={progress} />
        ) : (
          <UrlInputForm onSubmit={handleSubmit} />
        )}
      </Box>
    </Container>
  );
};

export default ArticleAnalysisDashboard;