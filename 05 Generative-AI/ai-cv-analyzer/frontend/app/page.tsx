'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import CVUploadForm from '@/components/CVUploadForm';
import AnalysisResults from '@/components/AnalysisResults';
import BatchLeaderboard from '@/components/BatchLeaderboard';
import { CVAnalysisResponse } from '@/types/analysis';

export default function Home() {
  // State can now hold a single object, an array of objects (batch), or null
  const [analysisData, setAnalysisData] = useState<CVAnalysisResponse | CVAnalysisResponse[] | null>(null);
  
  // State to track if an HR professional clicked a specific candidate from the batch leaderboard
  const [selectedCandidate, setSelectedCandidate] = useState<CVAnalysisResponse | null>(null);

  // Reset everything back to the upload screen
  const handleReset = () => {
    setAnalysisData(null);
    setSelectedCandidate(null);
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-600 selection:text-white">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!analysisData ? (
          // 1. Upload Form View
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10 space-y-3">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200/60 shadow-sm">
                Next-Gen Career Intelligence
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Optimize Your Resume for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Any Job</span>
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Upload a single resume or batch-rank multiple candidates instantly with AI-powered ATS metrics.
              </p>
            </div>
            <CVUploadForm onAnalysisComplete={(data) => setAnalysisData(data)} />
          </div>
        ) : selectedCandidate ? (
          // 2. Detailed View for a Specific Candidate (clicked from the batch leaderboard)
          <AnalysisResults 
            data={selectedCandidate} 
            onReset={() => setSelectedCandidate(null)} // Go back to leaderboard instead of full reset
          />
        ) : Array.isArray(analysisData) ? (
          // 3. Batch Leaderboard View (Multiple CVs uploaded)
          <BatchLeaderboard 
            results={analysisData} 
            onReset={handleReset}
            onSelectCandidate={(candidate) => setSelectedCandidate(candidate)}
          />
        ) : (
          // 4. Single CV Analysis View (1 CV uploaded)
          <AnalysisResults 
            data={analysisData} 
            onReset={handleReset} 
          />
        )}
      </main>

      <footer className="border-t border-slate-200/80 py-6 text-center text-xs text-slate-500 bg-white/40 backdrop-blur-md">
        AI CV Analyzer & Job Matcher • Built with FastAPI & Next.js
      </footer>
    </div>
  );
}