import { useState, useRef } from 'react';
import { uploadImage, ImageData, FlipDirection } from '../services/api';

interface ImageUploadProps {
  onUploadSuccess: (image: ImageData) => void;
  onError: (error: string) => void;
}

export default function ImageUpload({ onUploadSuccess, onError }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [flipDirection, setFlipDirection] = useState<FlipDirection>('horizontal');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      onError('Please select an image file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      onError('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await uploadImage(file, flipDirection);      
      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        onUploadSuccess(response.image);
      }, 500);
    } catch (error: any) {
      setIsUploading(false);
      setUploadProgress(0);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to upload image';
      onError(errorMessage);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }

    e.target.value = '';
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const FlipOption = ({ value, label, icon }: { value: FlipDirection, label: string, icon: React.ReactNode }) => (
    <button
      onClick={(e) => { e.stopPropagation(); setFlipDirection(value); }}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
        ${flipDirection === value 
          ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300' 
          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
        }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="w-full space-y-6">
      {/* Flip Options Selection */}
      <div className="flex flex-wrap justify-center gap-3" onClick={(e) => e.stopPropagation()}>
        <FlipOption 
          value="horizontal" 
          label="Horizontal" 
          icon={<span className="text-lg">↔️</span>} 
        />
        <FlipOption 
          value="vertical" 
          label="Vertical" 
          icon={<span className="text-lg">↕️</span>} 
        />
        <FlipOption 
          value="both" 
          label="Both" 
          icon={<span className="text-lg">🔄</span>} 
        />
        <FlipOption 
          value="none" 
          label="None" 
          icon={<span className="text-lg">🚫</span>} 
        />
      </div>

      <div
        className={`
          border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300
          ${isDragging ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 scale-[1.02] shadow-lg' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50/50'}
          ${isUploading ? 'opacity-60 cursor-not-allowed' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">Processing image...</p>
              <p className="text-sm text-gray-500 mt-2">Removing background and applying {flipDirection} flip</p>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg className="w-20 h-20 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-800">
                Drag and drop an image here, or click to select
              </p>
              <p className="text-sm text-gray-500 mt-3">
                Selected Mode: <span className="font-bold text-blue-600 capitalize">{flipDirection} Flip</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}