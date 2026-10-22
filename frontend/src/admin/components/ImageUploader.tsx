'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Check, 
  ExternalLink, 
  RefreshCw,
  Eye,
  FileCheck
} from 'lucide-react';
import { BASE_URL } from '../../services/apiService';

interface ImageUploaderProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  description?: string;
  aspectRatio?: 'square' | 'wide' | 'portrait' | 'banner' | 'auto';
  className?: string;
  placeholderText?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  description,
  aspectRatio = 'auto',
  className = '',
  placeholderText = 'Upload image file from your computer'
}) => {
  const [displayUrl, setDisplayUrl] = useState(value || '');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fallbackDataRef = useRef<string>('');

  // Synchronize displayUrl when value prop updates externally
  useEffect(() => {
    setDisplayUrl(value || '');
    setUrlInput(value || '');
  }, [value]);

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square max-h-56';
      case 'portrait': return 'aspect-[3/4] max-h-64';
      case 'banner': return 'aspect-[21/9] sm:aspect-[3/1] max-h-48';
      case 'wide': return 'aspect-[16/9] max-h-56';
      default: return 'min-h-[140px] max-h-[220px]';
    }
  };

  const processFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    setUploadStatus('Uploading to server...');

    try {
      // 1. Read locally as Base64 Data URL for instant, zero-delay preview
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        if (!base64Data) return;

        fallbackDataRef.current = base64Data;
        setDisplayUrl(base64Data);
        setUrlInput(base64Data);

        // 2. Persist to server disk in background
        try {
          const res = await fetch(`${BASE_URL}/upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: base64Data, filename: file.name })
          });

          if (res.ok) {
            const json = await res.json();
            if (json.success && json.url) {
              setDisplayUrl(json.url);
              setUrlInput(json.url);
              onChange(json.url);
              setUploadStatus('Uploaded & Synchronized!');
              setTimeout(() => setUploadStatus(null), 2500);
              return;
            }
          }
        } catch (serverErr) {
          console.warn('Server upload failed, falling back to base64 preview:', serverErr);
        }

        // Fallback only if server upload failed
        onChange(base64Data);
        setUploadStatus('Imported (Local)');
        setTimeout(() => setUploadStatus(null), 2500);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File read error:', err);
      setUploadStatus('Error reading file');
      setTimeout(() => setUploadStatus(null), 2500);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    fallbackDataRef.current = '';
    setDisplayUrl('');
    setUrlInput('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlSave = () => {
    if (urlInput.trim()) {
      setDisplayUrl(urlInput.trim());
      onChange(urlInput.trim());
      setIsUrlMode(false);
    }
  };

  const activeSrc = displayUrl || value;

  return (
    <div className={`space-y-2 select-none ${className}`}>
      {/* Label & Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-bold text-[#0f172a]">
            {label}
          </label>
          {description && (
            <p className="text-[11px] text-slate-500 font-normal">
              {description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsUrlMode(!isUrlMode)}
          className="text-[11px] text-[#4E9F76] hover:underline font-bold transition-all cursor-pointer"
        >
          {isUrlMode ? '← Direct File Import' : 'Or enter web link'}
        </button>
      </div>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml, image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {isUrlMode ? (
        /* Manual URL mode fallback */
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/... or /images/..."
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 bg-white focus:outline-none focus:border-[#86C59E]"
          />
          <button
            type="button"
            onClick={handleUrlSave}
            className="px-4 py-2.5 bg-[#4E9F76] hover:bg-[#86C59E] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            Apply
          </button>
        </div>
      ) : (
        /* Primary Drag-and-Drop & File Import Box */
        <div>
          {activeSrc ? (
            /* Active Image Preview Box with Replace & Remove */
            <div className={`relative group rounded-2xl overflow-hidden border border-slate-200/90 bg-gradient-to-b from-[#f8faf8] to-[#edf4ee] shadow-xs ${getAspectClass()} flex items-center justify-center`}>
              <img
                src={activeSrc}
                alt={label}
                onError={() => {
                  if (fallbackDataRef.current && activeSrc !== fallbackDataRef.current) {
                    setDisplayUrl(fallbackDataRef.current);
                  }
                }}
                className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-[#0f172a] hover:bg-[#B2E2C5] hover:text-[#4E9F76] text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replace File</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>

              {/* Status Badge */}
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-slate-700 flex items-center gap-1.5 border border-slate-200/80 shadow-xs">
                <Check className="w-3 h-3 text-[#4E9F76]" />
                <span>Uploaded</span>
              </div>
            </div>
          ) : (
            /* Dropzone / Upload Trigger Button */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3 ${
                isDragging
                  ? 'border-[#4E9F76] bg-[#B2E2C5]/20 scale-[1.01]'
                  : 'border-slate-200 hover:border-[#86C59E] bg-slate-50/60 hover:bg-slate-50'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-[#4E9F76] shadow-sm flex items-center justify-center">
                <Upload className="w-6 h-6 stroke-[2]" />
              </div>

              <div>
                <p className="text-xs font-bold text-[#0f172a]">
                  Click to import image from your computer
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Or drag and drop file here (PNG, JPG, WebP, SVG)
                </p>
              </div>

              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-[#4E9F76] hover:bg-[#86C59E] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Browse File</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Progress Toast */}
      {uploadStatus && (
        <div className="flex items-center gap-2 text-xs font-bold text-[#4E9F76] animate-fadeIn">
          <FileCheck className="w-4 h-4 text-[#86C59E]" />
          <span>{uploadStatus}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
