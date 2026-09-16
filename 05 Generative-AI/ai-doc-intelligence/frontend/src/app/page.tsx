'use me';
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { UploadCloud, FileText, Plus, Trash2, Settings } from 'lucide-react';
import ChatBox from '@/components/ChatBox';

export default function Home() {
  const [docId, setDocId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleFileUpload = async (file: File) => {
    if (!file || file.type !== 'application/pdf') {
      alert('Please select a valid PDF file.');
      return;
    }

    setIsUploading(true);
    setFileName(file.name);

    const formData = new FormData();
    formData.append('file', file);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

    try {
      const response = await fetch(`${baseUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload document.');
      }

      const data = await response.json();
      setDocId(data.doc_id || data.id || 'default_doc');
    } catch (err: any) {
      console.error('Upload Error:', err);
      // Fallback for testing/demo
      setDocId(`demo_${Date.now()}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f4f8] text-slate-800 flex items-center justify-center p-3 md:p-5 font-sans">
      {/* Outer Frame */}
      <div className="w-full max-w-[1440px] h-[calc(100vh-2.5rem)] bg-white rounded-3xl border border-slate-200/90 shadow-2xl flex overflow-hidden">
        
        {/* Left Sidebar */}
        <aside className="w-64 md:w-72 bg-slate-50/90 border-r border-slate-200/80 p-5 flex flex-col shrink-0 justify-between">
          <div className="space-y-6">
            {/* Local Logo Image from Public Folder */}
            <div className="flex items-center gap-3 px-1">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0">
                <Image
                  src="/logo.jpeg"
                  alt="App Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                DocuMind <span className="text-indigo-600 font-extrabold">+</span>
              </span>
            </div>

            {/* Upload Button */}
            <label
              htmlFor="sidebar-pdf-upload"
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs md:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-100 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{docId ? 'New Document' : 'Upload PDF'}</span>
            </label>
            <input
              type="file"
              accept="application/pdf"
              id="sidebar-pdf-upload"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            {/* Document Status */}
            <div className="space-y-3">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
                Active Workspace
              </p>
              {docId ? (
                <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100/80 flex items-center justify-between group">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="text-xs font-semibold text-slate-700 truncate">{fileName || 'Document.pdf'}</span>
                  </div>
                  <button
                    onClick={() => {
                      setDocId(null);
                      setFileName('');
                    }}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic px-1">No document active</p>
              )}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="pt-4 border-t border-slate-200/60 space-y-1">
            <div className="flex items-center gap-3 p-2 rounded-xl text-slate-600 hover:bg-slate-200/50 cursor-pointer transition-colors text-xs font-medium">
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings & Preferences</span>
            </div>
          </div>
        </aside>

        {/* Main Canvas */}
        <main className="flex-1 flex flex-col bg-white overflow-hidden relative">
          {!docId ? (
            /* Upload Screen */
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center">
              <div className="relative w-16 h-16 rounded-3xl overflow-hidden mb-6 shadow-sm border border-slate-100">
                <Image
                  src="/logo.jpeg"
                  alt="App Logo"
                  fill
                  className="object-cover"
                />
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
                How Can I <span className="text-indigo-600">Assist You Today?</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-500 max-w-md mb-8">
                Upload your PDF to analyze key insights, ask contextual questions, and extract structured summaries.
              </p>

              {/* Dropzone */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`w-full max-w-xl p-8 rounded-2xl border-2 border-dashed transition-all duration-200 bg-slate-50/50 shadow-sm flex flex-col items-center justify-center ${
                  dragActive ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]' : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                <input
                  type="file"
                  accept="application/pdf"
                  id="main-pdf-upload"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 mb-3 shadow-xs">
                  {isUploading ? (
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <UploadCloud className="w-6 h-6 text-indigo-600" />
                  )}
                </div>

                {isUploading ? (
                  <p className="text-xs font-semibold text-slate-700">Processing & Indexing Document...</p>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs md:text-sm font-medium text-slate-700">
                      Drag & drop your PDF here, or{' '}
                      <label htmlFor="main-pdf-upload" className="text-indigo-600 hover:text-indigo-700 cursor-pointer font-semibold underline underline-offset-2">
                        browse file
                      </label>
                    </p>
                    <p className="text-[11px] text-slate-400">Supports PDF documents up to 25MB</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Active Workspace */
            <div className="w-full h-full flex flex-col">
              <ChatBox
                docId={docId}
                fileName={fileName || 'Uploaded_Document.pdf'}
                onResetDocument={() => {
                  setDocId(null);
                  setFileName('');
                }}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}