import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import imageCompression from 'browser-image-compression';

const MAX_FILES = 5;
const MAX_SIZE_MB = 5;

export default function ImageUpload({ files, setFiles }) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [compressing, setCompressing] = useState(false);
  const inputRef = useRef(null);

  const processFiles = async (rawFiles) => {
    setError('');
    const accepted = Array.from(rawFiles).filter(f => f.type.startsWith('image/'));
    if (accepted.length === 0) { setError('Please upload image files only (JPEG, PNG, WebP).'); return; }
    if (files.length + accepted.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} images allowed.`);
      return;
    }

    setCompressing(true);
    const processed = [];
    for (const file of accepted) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        try {
          const compressed = await imageCompression(file, {
            maxSizeMB: 1.5,
            maxWidthOrHeight: 1600,
            useWebWorker: true,
          });
          processed.push(new File([compressed], file.name, { type: compressed.type }));
        } catch {
          processed.push(file);
        }
      } else {
        processed.push(file);
      }
    }
    setCompressing(false);
    setFiles(prev => [...prev, ...processed]);
  };

  const removeFile = (idx) => setFiles(prev => prev.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); processFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          dragging ? 'border-navy-600 bg-navy-50' : 'border-gray-300 bg-gray-50 hover:border-navy-400 hover:bg-gray-100'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => processFiles(e.target.files)}
        />
        {compressing ? (
          <div className="text-sm text-navy-700">
            <div className="w-6 h-6 border-2 border-navy-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Compressing images…
          </div>
        ) : (
          <>
            <Upload size={24} className="mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP — max {MAX_SIZE_MB}MB each, up to {MAX_FILES} files</p>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
          <AlertCircle size={13} /> {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {files.map((f, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src={URL.createObjectURL(f)}
                alt={f.name}
                className="w-full h-28 object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="absolute top-1 right-1 p-0.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={11} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] px-1.5 py-1 truncate">
                {f.name} · {(f.size / 1024).toFixed(0)}KB
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
