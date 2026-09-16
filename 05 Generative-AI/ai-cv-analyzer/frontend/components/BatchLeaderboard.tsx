'use client';

import React from 'react';
import { Award, RotateCcw, FileText, CheckCircle2 } from 'lucide-react';
import { CVAnalysisResponse } from '@/types/analysis';

interface BatchLeaderboardProps {
  results: CVAnalysisResponse[];
  onReset: () => void;
  onSelectCandidate: (candidate: CVAnalysisResponse) => void;
}

export default function BatchLeaderboard({ results, onReset, onSelectCandidate }: BatchLeaderboardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold shadow-sm">
            <Award className="h-3.5 w-3.5" />
            <span>Batch Analysis Complete</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Candidate Ranking Leaderboard</h2>
          <p className="text-sm text-slate-600">
            Successfully ranked {results.length} candidates from highest match score to lowest.
          </p>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all border border-slate-200 cursor-pointer shadow-sm"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Analyze New Batch</span>
        </button>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Ranked Candidates</h3>
        
        <div className="space-y-3">
          {results.map((candidate, index) => (
            <div 
              key={index}
              onClick={() => onSelectCandidate(candidate)}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/80 transition-all cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 border border-blue-200">
                  #{index + 1}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-500" />
                    {candidate.filename || `Candidate ${index + 1}`}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Matching Skills: {candidate.matching_skills?.length || 0} found
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`px-4 py-1.5 rounded-xl border font-extrabold text-sm ${getScoreColor(candidate.match_score)} shadow-sm`}>
                  {candidate.match_score}% Match
                </div>
                <span className="text-xs font-semibold text-blue-600 hover:underline">View Details →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}