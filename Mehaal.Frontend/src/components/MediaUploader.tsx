import React, { useState } from 'react';

interface MediaUploaderProps {
  onUpload: (media: UploadedMedia) => void;
  accept?: string;
  maxSize?: number;
}

interface UploadedMedia {
  id: number;
  file_url: string;
  file_type: string;
  alt_text: string;
  size: number;
}

export default function MediaUploader({ 
  onUpload, 
  accept = "image/*,.svg,.glb,.gltf",
  maxSize = 50 * 1024 * 1024 // 50MB
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      setError(`File too large. Max size: ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    setUploading(true);
    setError('');
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt_text', file.name);

    try {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentage = (e.loaded / e.total) * 100;
          setProgress(Math.round(percentage));
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status === 200 || xhr.status === 201) {
          const data = JSON.parse(xhr.responseText);
          onUpload(data);
          setProgress(100);
          // Reset input
          e.target.value = '';
        } else {
          setError(`Upload failed: ${xhr.statusText}`);
        }
        setUploading(false);
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        setError('Network error during upload');
        setUploading(false);
      });

      // Send request
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      xhr.open('POST', `${apiUrl}/api/media/upload`);
      xhr.send(formData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <input
          type="file"
          onChange={handleUpload}
          disabled={uploading}
          accept={accept}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
}
