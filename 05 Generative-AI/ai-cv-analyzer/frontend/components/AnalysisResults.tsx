'use client';

import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  HelpCircle, 
  Award, 
  RotateCcw 
} from 'lucide-react';
import { CVAnalysisResponse } from '@/types/analysis';

interface AnalysisResultsProps {
  data: CVAnalysisResponse;
  onReset: () => void;
}

export default function AnalysisResults({ data, onReset }: AnalysisResultsProps) {
  // Determine score color styling for light theme
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 border-emerald-200 bg-emerald-50';
    if (score >= 50) return 'text-amber-700 border-amber-200 bg-amber-50';
    return 'text-rose-700 border-rose-200 bg-rose-50';
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Score & New Analysis Button */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold shadow-sm">
            <Award className="h-3.5 w-3.5" />
            <span>AI Evaluation Complete</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Match Analysis Results</h2>
          <p className="text-sm text-slate-600">
            Review your skill compatibility, ATS warnings, and actionable recommendations below.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className={`flex flex-col items-center justify-center h-28 w-28 rounded-2xl border ${getScoreColor(data.match_score)} shadow-sm`}>
            <span className="text-3xl font-extrabold">{data.match_score}%</span>
            <span className="text-xs uppercase tracking-wider font-bold opacity-80 mt-1">Match Score</span>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all border border-slate-200 cursor-pointer h-fit shadow-sm"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Analyze Another</span>
          </button>
        </div>
      </div>

      {/* Grid Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matching Skills */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span>Matching Skills ({data.matching_skills.length})</span>
          </h3>
          {data.matching_skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.matching_skills.map((skill, index) => (
                <span key={index} className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No matching skills identified.</p>
          )}
        </div>

        {/* Missing Skills */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-4">
            <XCircle className="h-5 w-5 text-rose-600" />
            <span>Missing Skills ({data.missing_skills.length})</span>
          </h3>
          {data.missing_skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.missing_skills.map((skill, index) => (
                <span key={index} className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-lg shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No major skills missing!</p>
          )}
        </div>
      </div>

      {/* Experience Gaps & ATS Issues */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-amber-600" />
            <span>Experience Gaps</span>
          </h3>
          <ul className="space-y-3">
            {data.experience_gaps.map((gap, index) => (
              <li key={index} className="text-sm text-slate-700 flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span>ATS Compatibility Warnings</span>
          </h3>
          <ul className="space-y-3">
            {data.ats_issues.map((issue, index) => (
              <li key={index} className="text-sm text-slate-700 flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 mt-2 shrink-0"></span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggested Improvements */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-purple-600" />
          <span>Actionable CV Improvements</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.suggested_improvements.map((imp, index) => (
            <div key={index} className="bg-slate-50/80 border border-slate-200 p-4 rounded-xl text-sm text-slate-700 flex items-start gap-3 shadow-sm">
              <span className="h-6 w-6 rounded-full bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center text-xs font-bold shrink-0">
                {index + 1}
              </span>
              <span>{imp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interview Questions */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-4">
          <HelpCircle className="h-5 w-5 text-indigo-600" />
          <span>Anticipated Interview Questions</span>
        </h3>
        <ul className="space-y-3">
          {data.interview_questions.map((q, index) => (
            <li key={index} className="text-sm text-slate-700 bg-slate-50/80 border border-slate-200 p-4 rounded-xl flex items-center gap-3 shadow-sm">
              <span className="text-indigo-600 font-bold">Q{index + 1}.</span>
              <span>{q}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}