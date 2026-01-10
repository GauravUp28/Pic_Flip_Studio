import { useState } from 'react';
import { ImageData, deleteImage } from '../services/api';

interface ImageDisplayProps {
  image: ImageData;
  onDelete: (id: string) => void;
  onError: (error: string) => void;
}

export default function ImageDisplay({ image, onDelete, onError }: ImageDisplayProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteImage(image.id);
      onDelete(image.id);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete image';
      onError(errorMessage);
      setIsDeleting(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(image.publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="p-5">
        {/* Image Comparison Section */}
        <div className="mb-4">
          {image.originalPublicUrl ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Image */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600 text-center uppercase tracking-wide">Original</p>
                <div className="relative">
                  <img
                    src={image.originalPublicUrl}
                    alt={`Original ${image.originalFilename}`}
                    className="w-full h-auto rounded-lg border-2 border-gray-200 object-contain bg-gray-50 shadow-sm"
                    style={{ minHeight: '200px' }}
                    onError={() => onError('Failed to load original image')}
                  />
                </div>
              </div>

              {/* Flipped Image */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-blue-600 text-center uppercase tracking-wide">Flipped</p>
                <div className="relative">
                  <img
                    src={image.publicUrl}
                    alt={`Flipped ${image.originalFilename}`}
                    className="w-full h-auto rounded-lg border-2 border-blue-400 object-contain bg-gray-50 shadow-sm"
                    style={{ minHeight: '200px' }}
                    onError={() => onError('Failed to load flipped image')}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Processed Image</p>
              <img
                src={image.publicUrl}
                alt={image.originalFilename}
                className="w-full h-auto rounded-lg border border-gray-200"
                onError={() => onError('Failed to load image')}
              />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Original Name:</p>
            <p className="text-sm text-gray-600 truncate">{image.originalFilename}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Processed Pic URL:</p>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={image.publicUrl}
                readOnly
                className="flex-1 text-xs p-2.5 border border-gray-200 rounded-lg bg-gray-50 truncate focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button
                onClick={handleCopyUrl}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm whitespace-nowrap"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Created At:</p>
            <p className="text-sm text-gray-600">
              {new Date(image.createdAt).toLocaleString()}
            </p>
          </div>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`
              w-full px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm
              ${isDeleting
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-md'
              }
            `}
          >
            {isDeleting ? 'Deleting...' : 'Delete Pic'}
          </button>
        </div>
      </div>
    </div>
  );
}

