import { supabase } from '../config/supabase';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = 'processed-images';

/**
 * Uploads an image to Supabase Storage
 */
async function uploadSingleImage(
  imageBuffer: Buffer,
  originalFilename: string,
  prefix: string = 'processed'
): Promise<{ path: string; publicUrl: string }> {
  // Generate unique filename
  const fileExtension = originalFilename.split('.').pop() || 'png';
  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = `images/${prefix}-${fileName}`;

  try {
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, imageBuffer, {
        contentType: `image/${fileExtension}`,
        upsert: false
      });

    if (error) {
      throw new Error(`Failed to upload to Supabase Storage: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get public URL from Supabase Storage');
    }

    return {
      path: filePath,
      publicUrl: urlData.publicUrl
    };
  } catch (error: any) {
    throw new Error(`Storage upload error: ${error.message}`);
  }
}

/**
 * Uploads processed image to Supabase Storage
 */
export async function uploadImageToStorage(
  imageBuffer: Buffer,
  originalFilename: string
): Promise<{ path: string; publicUrl: string }> {
  return uploadSingleImage(imageBuffer, originalFilename, 'processed');
}

/**
 * Uploads original image to Supabase Storage
 */
export async function uploadOriginalImageToStorage(
  imageBuffer: Buffer,
  originalFilename: string
): Promise<{ path: string; publicUrl: string }> {
  return uploadSingleImage(imageBuffer, originalFilename, 'original');
}

/**
 * Deletes image from Supabase Storage
 */
export async function deleteImageFromStorage(filePath: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      throw new Error(`Failed to delete from Supabase Storage: ${error.message}`);
    }
  } catch (error: any) {
    throw new Error(`Storage delete error: ${error.message}`);
  }
}

