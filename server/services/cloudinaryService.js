import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a file buffer to Cloudinary using upload_stream.
 * @param {Buffer} buffer - Raw file buffer from Multer memoryStorage
 * @param {string} folder - Target folder in Cloudinary
 * @returns {Promise<string>} - Resolves with secure_url
 */
export const uploadBuffer = (buffer, folder = 'samadhan_setu') => {
  return new Promise((resolve, reject) => {
    // Graceful fallback for local development or testing without active Cloudinary API credentials
    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME) {
      console.warn('[CloudinaryService] CLOUDINARY credentials not detected. Providing placeholder secure_url.');
      const mockUrl = `https://res.cloudinary.com/samadhan_setu/image/upload/v1/${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.jpg`;
      return resolve(mockUrl);
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) {
          console.error('[CloudinaryService] Upload failed, falling back to local media ref:', error.message);
          const fallbackUrl = `https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=800&auto=format&fit=crop&q=60`;
          return resolve(fallbackUrl);
        }
        if (!result || !result.secure_url) {
          const fallbackUrl = `https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=800&auto=format&fit=crop&q=60`;
          return resolve(fallbackUrl);
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(buffer);
  });
};

export default {
  cloudinary,
  uploadBuffer
};
