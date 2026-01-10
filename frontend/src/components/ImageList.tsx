import { useEffect, useState } from 'react';
import { getAllImages, ImageData } from '../services/api';
import ImageDisplay from './ImageDisplay';

interface ImageListProps {
  onError: (error: string) => void;
}

export default function ImageList({ onError }: ImageListProps) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadImages = async () => {
    try {
      setIsLoading(true);
      const response = await getAllImages();
      setImages(response.images);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load images';
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleDelete = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-600 text-lg font-medium">No flipped pics yet.</p>
        <p className="text-gray-400 text-sm mt-2">Upload an image to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => (
        <ImageDisplay
          key={image.id}
          image={image}
          onDelete={handleDelete}
          onError={onError}
        />
      ))}
    </div>
  );
}

