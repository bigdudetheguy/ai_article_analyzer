import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ArticleAnalysisDashboard from "pages/article-analysis-dashboard";
import ArticleProcessingResults from "pages/article-processing-results";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<ArticleAnalysisDashboard />} />
          <Route path="/article-analysis-dashboard" element={<ArticleAnalysisDashboard />} />
          <Route path="/article-processing-results" element={<ArticleProcessingResults />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;