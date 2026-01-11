import express, { Request, Response } from 'express';
import multer from 'multer';
import { processImage, FlipDirection } from '../core/transformer';
import { uploadImageToStorage, uploadOriginalImageToStorage, deleteImageFromStorage } from '../core/bucket';
import { saveImageMetadata, deleteImageMetadata, getImageMetadata, getAllImages } from '../core/database';

const router = express.Router();

// multer config for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

/**
 * POST /api/images/upload
 * Upload and process an image
 */
router.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageBuffer = req.file.buffer;
    const originalFilename = req.file.originalname;
    const flipDirection = (req.body.flipDirection as FlipDirection) || 'horizontal';

    // Upload original image first
    const { path: originalStoragePath, publicUrl: originalPublicUrl } = 
      await uploadOriginalImageToStorage(imageBuffer, originalFilename);

    const processedImage = await processImage(imageBuffer, flipDirection);

    const { path: storagePath, publicUrl } = await uploadImageToStorage(
      processedImage,
      originalFilename
    );

    const imageRecord = await saveImageMetadata(
      originalFilename,
      storagePath,
      publicUrl,
      originalStoragePath,
      originalPublicUrl
    );

    res.json({
      success: true,
      image: {
        id: imageRecord.id,
        originalFilename: imageRecord.original_filename,
        publicUrl: imageRecord.public_url,
        originalPublicUrl: imageRecord.original_public_url,
        createdAt: imageRecord.created_at
      }
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Failed to process image',
      message: error.message
    });
  }
});

/**
 * GET /api/images
 * Get all flipped pics
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const images = await getAllImages();
    res.json({
      success: true,
      images: images.map(img => ({
        id: img.id,
        originalFilename: img.original_filename,
        publicUrl: img.public_url,
        originalPublicUrl: img.original_public_url,
        createdAt: img.created_at
      }))
    });
  } catch (error: any) {
    console.error('Get images error:', error);
    res.status(500).json({
      error: 'Failed to retrieve images',
      message: error.message
    });
  }
});

/**
 * GET /api/images/:id
 * Get a specific image by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const image = await getImageMetadata(id);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json({
      success: true,
      image: {
        id: image.id,
        originalFilename: image.original_filename,
        publicUrl: image.public_url,
        originalPublicUrl: image.original_public_url,
        createdAt: image.created_at
      }
    });
  } catch (error: any) {
    console.error('Get image error:', error);
    res.status(500).json({
      error: 'Failed to retrieve image',
      message: error.message
    });
  }
});

/**
 * DELETE /api/images/:id
 * Delete an image
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get image metadata to find storage paths
    const image = await getImageMetadata(id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete processed image from storage
    await deleteImageFromStorage(image.storage_path);

    // Delete original image from storage if it exists
    if (image.original_storage_path) {
      await deleteImageFromStorage(image.original_storage_path);
    }

    // Delete from database
    await deleteImageMetadata(id);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete error:', error);
    res.status(500).json({
      error: 'Failed to delete image',
      message: error.message
    });
  }
});

export default router;
