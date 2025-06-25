import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Alert, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ResultCard from './components/ResultCard.jsx';

const ArticleProcessingResults = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState([]);
  const [processedAt, setProcessedAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Retrieve analysis results from session storage
    try {
      const storedData = sessionStorage.getItem('analysisResults');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setResults(parsedData.results || []);
        setErrors(parsedData.errors || []);
        setProcessedAt(parsedData.processedAt || new Date().toISOString());
      } else {
        setError('No analysis results found. Please submit URLs for analysis.');
      }
    } catch (err) {
      console.error('Error retrieving results:', err);
      setError('Failed to load analysis results.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleBackClick = () => {
    navigate('/article-analysis-dashboard');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading results...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBackClick}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Article Analysis Results
        </Typography>
        
        {processedAt && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Processed at: {formatDate(processedAt)}
          </Typography>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {errors && errors.length > 0 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {errors.length} article{errors.length !== 1 ? 's' : ''} failed to process.
          </Alert>
        )}

        {results && results.length > 0 ? (
          <Box sx={{ mt: 4 }}>
            {results.map((result) => (
              <ResultCard key={result.id} data={result} />
            ))}
          </Box>
        ) : !error ? (
          <Alert severity="info">
            No analysis results available. Please submit URLs for analysis.
          </Alert>
        ) : null}

        {errors && errors.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Failed Articles
            </Typography>
            {errors.map((error, index) => (
              <Alert key={index} severity="error" sx={{ mb: 2 }}>
                <Typography variant="subtitle1">
                  {error.url || 'Unknown URL'}
                </Typography>
                <Typography variant="body2">
                  {error.error || 'Processing failed'}
                </Typography>
              </Alert>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ArticleProcessingResults;
