import axios from 'axios';

export type FlipDirection = 'horizontal' | 'vertical' | 'both' | 'none';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ImageData {
  id: string;
  originalFilename: string;
  publicUrl: string;
  originalPublicUrl?: string | null;
  createdAt: string;
}

export interface UploadResponse {
  success: boolean;
  image: ImageData;
}

export interface ImagesResponse {
  success: boolean;
  images: ImageData[];
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

/**
 * Upload an image for processing with flip direction
 */
export async function uploadImage(file: File, flipDirection: FlipDirection = 'horizontal'): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('flipDirection', flipDirection);

  const response = await api.post<UploadResponse>('/api/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

/**
 * Get all flipped pics
 */
export async function getAllImages(): Promise<ImagesResponse> {
  const response = await api.get<ImagesResponse>('/api/images');
  return response.data;
}

/**
 * Get a specific image by ID
 */
export async function getImage(id: string): Promise<{ success: boolean; image: ImageData }> {
  const response = await api.get(`/api/images/${id}`);
  return response.data;
}

/**
 * Delete an image
 */
export async function deleteImage(id: string): Promise<DeleteResponse> {
  const response = await api.delete<DeleteResponse>(`/api/images/${id}`);
  return response.data;
}

