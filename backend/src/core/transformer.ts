import axios from 'axios';
import sharp from 'sharp';
import FormData from 'form-data';
import dotenv from 'dotenv';
import path from 'path';

const REMOVE_BG_API_URL = 'https://api.remove.bg/v1.0/removebg';

/**
 * Removes background from image using Remove.bg API
 */
export async function removeBackground(imageBuffer: Buffer): Promise<Buffer> {
  
  if (!process.env.REMOVE_BG_API_KEY) {
    dotenv.config({ path: path.resolve(__dirname, '../../.env') });
  }

  const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;
  
  if (!REMOVE_BG_API_KEY) {
    throw new Error(
      'Remove.bg API key is not configured. Please ensure REMOVE_BG_API_KEY is set in your .env file.'
    );
  }

  const formData = new FormData();
  formData.append('image_file', imageBuffer, {
    filename: 'image.jpg',
    contentType: 'image/jpeg'
  });
  formData.append('size', 'auto');

  try {
    const response = await axios.post(REMOVE_BG_API_URL, formData, {
      headers: {
        ...formData.getHeaders(),
        'X-Api-Key': REMOVE_BG_API_KEY!
      },
      responseType: 'arraybuffer',
      timeout: 30000
    });

    return Buffer.from(response.data);
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data 
        ? Buffer.from(error.response.data).toString()
        : 'Unknown error from Remove.bg API';
      throw new Error(`Remove.bg API error: ${errorMessage}`);
    }
    throw new Error(`Failed to remove background: ${error.message}`);
  }
}

/**
 * Horizontally flips an image
 */
export async function mirrorImage(imageBuffer: Buffer): Promise<Buffer> {
  try {
    const flippedImage = await sharp(imageBuffer)
      .flop() // Horizontal flip
      .toBuffer();
    
    return flippedImage;
  } catch (error: any) {
    throw new Error(`Failed to flip image: ${error.message}`);
  }
}

/**
 * Processes image: removes background and flips horizontally
 */
export async function processImage(imageBuffer: Buffer): Promise<Buffer> {
  // Step 1: Remove background
  const backgroundRemoved = await removeBackground(imageBuffer);
  // Step 2: Flip horizontally
  const flipped = await mirrorImage(backgroundRemoved);
  
  return flipped;
}

