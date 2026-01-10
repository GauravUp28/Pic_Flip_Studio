import { supabase } from '../config/supabase';

export interface ImageRecord {
  id: string;
  original_filename: string;
  storage_path: string;
  public_url: string;
  original_storage_path: string | null;
  original_public_url: string | null;
  created_at: string;
}

/**
 * Saves image metadata to database
 */
export async function saveImageMetadata(
  originalFilename: string,
  storagePath: string,
  publicUrl: string,
  originalStoragePath?: string | null,
  originalPublicUrl?: string | null
): Promise<ImageRecord> {
  const { data, error } = await supabase
    .from('images')
    .insert({
      original_filename: originalFilename,
      storage_path: storagePath,
      public_url: publicUrl,
      original_storage_path: originalStoragePath || null,
      original_public_url: originalPublicUrl || null
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save image metadata: ${error.message}`);
  }

  return data as ImageRecord;
}

/**
 * Gets image metadata by ID
 */
export async function getImageMetadata(id: string): Promise<ImageRecord | null> {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to get image metadata: ${error.message}`);
  }

  return data as ImageRecord;
}

/**
 * Deletes image metadata from database
 */
export async function deleteImageMetadata(id: string): Promise<void> {
  const { error } = await supabase
    .from('images')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete image metadata: ${error.message}`);
  }
}

/**
 * Gets all images (for listing)
 */
export async function getAllImages(): Promise<ImageRecord[]> {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to get images: ${error.message}`);
  }

  return (data || []) as ImageRecord[];
}

