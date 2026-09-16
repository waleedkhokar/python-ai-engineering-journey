'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { UploadCloud, FileText, Loader2, AlertCircle } from 'lucide-react';
import { CVAnalysisResponse } from '@/types/analysis';

interface CVUploadFormProps {
  onAnalysisComplete: (data: CVAnalysisResponse | CVAnalysisResponse[]) => void;
}

export default function CVUploadForm({ onAnalysisComplete }: CVUploadFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setError('Please upload at least one CV (PDF or DOCX).');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please provide a target Job Description.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('job_description', jobDescription);

    const isBatch = files.length > 1;
    
    // Append files based on whether it's 1 file or multiple files
    files.forEach((file) => {
      formData.append(isBatch ? 'files' : 'file', file);
    });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
      const endpoint = isBatch ? `${apiUrl}/analyze-batch` : `${apiUrl}/analyze`;

      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onAnalysisComplete(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'An error occurred during analysis. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xl shadow-blue-500/5 relative overflow-hidden">
      {/* Background ambient decorative glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            CV & Job Description Evaluation
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Upload single or multiple resumes to receive an AI-powered ATS match breakdown or batch leaderboard.
          </p>
        </div>
        {/* Custom Logo Image for the Form */}
        <div className="relative h-10 w-10 shrink-0 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
          <Image 
            src="/sendbutton.jpeg" 
            alt="Form Logo" 
            fill 
            className="object-cover"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm flex items-center gap-3 shadow-sm">
          <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Box with Multiple Support */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Resume(s) (PDF or DOCX)</label>
          <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 transition-colors rounded-xl p-6 text-center bg-slate-50/60 relative cursor-pointer">
            <input
              type="file"
              accept=".pdf,.docx"
              multiple // <--- Allows selecting multiple files simultaneously
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              {files.length > 0 ? (
                <>
                  <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    {files.length === 1 ? files[0].name : `${files.length} resumes selected for batch analysis`}
                  </span>
                  <span className="text-xs text-slate-500">Click or drag to replace files</span>
                </>
              ) : (
                <>
                  <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    Drop your CV(s) here, or <span className="text-blue-600 font-semibold">browse</span>
                  </span>
                  <span className="text-xs text-slate-500">Supports single PDF/Word or multiple batch uploads</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Job Description Textarea */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Target Job Description</label>
          <textarea
            rows={6}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description, requirements, and responsibilities here..."
            className="w-full bg-slate-50/60 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl p-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all resize-none shadow-sm"
          ></textarea>
        </div>

        {/* Submit Button with Custom Image Logo */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-3 transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>
                {files.length > 1 ? `Analyzing ${files.length} CVs in batch...` : 'Analyzing CV against Job Description...'}
              </span>
            </>
          ) : (
            <>
              <div className="relative h-6 w-6 rounded-lg overflow-hidden border border-white/40 shadow-sm bg-white/10 flex items-center justify-center">
                <Image 
                  src="/sendbutton.jpeg" 
                  alt="Submit Action" 
                  fill 
                  className="object-cover"
                />
              </div>
              <span>{files.length > 1 ? `Analyze & Rank ${files.length} CVs` : 'Analyze & Match CV'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}