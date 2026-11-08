import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Link, X, Trash2, Camera } from 'lucide-react';

interface ImageUploaderProps {
  value: string | string[];
  onChange: (value: any) => void;
  multiple?: boolean;
  label?: string;
  description?: string;
  required?: boolean;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'banner';
  maxFiles?: number;
  uploadImage?: (imageDataUrl: string) => Promise<string>;
}

// Helper to compress image into lightweight data URL
export const compressImageFile = (file: File, maxWidth = 960, maxHeight = 960, quality = 0.78): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  multiple = false,
  label,
  description,
  required = false,
  aspectRatio = 'portrait',
  maxFiles = 6,
  uploadImage,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize current images array
  const currentImages: string[] = multiple
    ? Array.isArray(value)
      ? value.filter(Boolean)
      : value
      ? [value as string]
      : []
    : typeof value === 'string' && value
    ? [value]
    : Array.isArray(value) && value.length > 0
    ? [value[0]]
    : [];

  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    setUploadError(null);

    try {
      const newUrls: string[] = [];
      const fileArray = Array.from(files);

      for (const file of fileArray) {
        if (!file.type.startsWith('image/')) continue;
        const compressed = await compressImageFile(file);
        newUrls.push(uploadImage ? await uploadImage(compressed) : compressed);
        if (!multiple) break;
      }

      if (multiple) {
        const updated = [...currentImages, ...newUrls].slice(0, maxFiles);
        onChange(updated);
      } else {
        if (newUrls.length > 0) {
          onChange(newUrls[0]);
        }
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Image upload failed.');
      console.error('Error reading/compressing image:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    const clean = urlInput.trim();
    if (multiple) {
      onChange([...currentImages, clean].slice(0, maxFiles));
    } else {
      onChange(clean);
    }
    setUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (multiple) {
      const updated = currentImages.filter((_, idx) => idx !== indexToRemove);
      onChange(updated);
    } else {
      onChange('');
    }
  };

  return (
    <div className="space-y-3">
      {/* Label and Description */}
      {(label || description) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          {label && (
            <label className="block font-bold text-[#831843] text-xs">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
          )}
          {description && <span className="text-[10px] text-[#7A5A62]">{description}</span>}
        </div>
      )}

      {/* Mode Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#FFF0F3] rounded-xl border border-[#FCE7EB] w-fit text-[11px]">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
            activeTab === 'upload'
              ? 'bg-white text-[#831843] shadow-2xs font-bold'
              : 'text-[#7A5A62] hover:text-[#831843]'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
            activeTab === 'url'
              ? 'bg-white text-[#831843] shadow-2xs font-bold'
              : 'text-[#7A5A62] hover:text-[#831843]'
          }`}
        >
          <Link className="w-3.5 h-3.5" />
          <span>Paste URL</span>
        </button>

      </div>

      {/* TAB 1: FILE UPLOAD (DRAG & DROP + BROWSE) */}
      {activeTab === 'upload' && (
        <div>

        {uploadError && (
          <p className="text-xs font-medium text-red-600" role="alert">{uploadError}</p>
        )}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-5 sm:p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-[#BE185D] bg-[#FFF0F3] scale-[0.99]'
                : 'border-[#F3C5D4] hover:border-[#BE185D] bg-white hover:bg-[#FFF9F9]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple={multiple}
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files);
              }}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF0F3] text-[#BE185D] flex items-center justify-center shadow-xs">
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-[#BE185D] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-6 h-6" />
                )}
              </div>

              <div>
                <p className="text-xs font-bold text-[#831843]">
                  {isProcessing
                    ? 'Processing & optimizing photo...'
                    : 'Click to select photo or drag & drop here'}
                </p>
                <p className="text-[10px] text-[#9D7983] mt-0.5">
                  Supports JPG, PNG, WEBP, HEIC from Mobile or Desktop
                  {multiple && ` (up to ${maxFiles} photos)`}
                </p>
              </div>

              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-[#BE185D] text-white hover:bg-[#831843] transition-colors">
                <Upload className="w-3 h-3" />
                <span>Browse Photos</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PASTE URL */}
      {activeTab === 'url' && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link className="w-3.5 h-3.5 text-[#9D7983] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              placeholder="Paste an image URL"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddUrl();
                }
              }}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#FCE7EB] text-xs bg-white text-[#3D2C2E] focus:outline-hidden focus:border-[#BE185D]"
            />
          </div>
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-4 py-2 rounded-xl bg-[#BE185D] text-white font-bold text-xs hover:bg-[#831843] transition-colors"
          >
            Add URL
          </button>
        </div>
      )}

      {/* THUMBNAIL PREVIEW GRID */}
      {currentImages.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] text-[#7A5A62] font-medium">
            <span>
              {multiple
                ? `Uploaded Photos (${currentImages.length}/${maxFiles}):`
                : 'Selected Photo Preview:'}
            </span>
            {multiple && currentImages.length > 1 && (
              <span className="text-[10px] text-[#9D7983]">First image is the main cover</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {currentImages.map((imgUrl, idx) => (
              <div
                key={idx}
                className="relative group rounded-2xl overflow-hidden border-2 border-[#FCE7EB] bg-white shadow-2xs w-20 h-24 sm:w-24 sm:h-28 shrink-0"
              >
                <img
                  src={imgUrl}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Cover badge for first image */}
                {multiple && idx === 0 && (
                  <span className="absolute bottom-1 left-1 right-1 bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold py-0.5 text-center rounded-md">
                    Cover
                  </span>
                )}

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow-md opacity-90 hover:opacity-100 hover:scale-110 transition-all"
                  title="Remove Image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Quick Add Another Button if multiple */}
            {multiple && currentImages.length < maxFiles && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl border-2 border-dashed border-[#F3C5D4] hover:border-[#BE185D] bg-[#FFF8F9] hover:bg-[#FFF0F3] flex flex-col items-center justify-center text-[#831843] gap-1 transition-all"
              >
                <Upload className="w-4 h-4" />
                <span className="text-[10px] font-bold">+ Add Photo</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
