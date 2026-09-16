'use client';

import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface DropzoneProps {
  onUploadSuccess: (docId: string, file: File) => void;
}

export default function Dropzone({ onUploadSuccess }: DropzoneProps) {
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a valid PDF file.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    // Fallback to local FastAPI server if environment variable fails to load
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

    try {
      const res = await fetch(`${baseUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Upload failed');
      }

      const data = await res.json();
      onUploadSuccess(data.doc_id, file);
    } catch (err: any) {
      console.error('PDF Upload Error:', err);
      alert(`Error uploading document: ${err.message || 'Server connection failed'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-colors rounded-xl p-8 text-center flex flex-col items-center justify-center bg-gray-50/50">
      {loading ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-gray-700">Processing & Chunking PDF with Gemini...</p>
        </div>
      ) : (
        <label className="cursor-pointer flex flex-col items-center gap-3 w-full">
          <div className="p-4 bg-indigo-50 rounded-full text-indigo-600">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <p className="text-base font-semibold text-gray-800">Click to upload document</p>
            <p className="text-xs text-gray-500 mt-1">PDF up to 50MB (Supports 100+ pages)</p>
          </div>
          <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
        </label>
      )}
    </div>
  );
}