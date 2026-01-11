import axios from 'axios';
import sharp from 'sharp';
import FormData from 'form-data';
import dotenv from 'dotenv';
import path from 'path';

const REMOVE_BG_API_URL = 'https://api.remove.bg/v1.0/removebg';
export type FlipDirection = 'horizontal' | 'vertical' | 'both'

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
 * Flips image based on direction
 */
export async function flipImage(imageBuffer: Buffer, direction: FlipDirection): Promise<Buffer> {
  try {
    let pipeline = sharp(imageBuffer);

  if (direction === 'horizontal' || direction === 'both') {
    pipeline = pipeline.flop();
  }

  if (direction === 'vertical' || direction === 'both') {
    pipeline = pipeline.flip();
  }

  return await pipeline.toBuffer();
  } catch (error: any) {
    throw new Error(`Failed to flip image: ${error.message}`);
  }
}

/**
 * Processes image: removes background and applies requested flip
 */
export async function processImage(imageBuffer: Buffer, flipDirection: FlipDirection = 'horizontal'): Promise<Buffer> {
  // Step 1: Remove background
  const backgroundRemoved = await removeBackground(imageBuffer);
  
  // Step 2: Apply requested flip
  const processed = await flipImage(backgroundRemoved, flipDirection);
  
  return processed;
}