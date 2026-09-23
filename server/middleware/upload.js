import multer from 'multer';

// Use in-memory buffer storage for immediate streaming to Cloudinary
const storage = multer.memoryStorage();

// Allowed image MIME types: JPEG, PNG, WebP
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

const fileFilter = (_req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file format: ${file.mimetype}. Only JPEG, PNG, and WebP images are permitted.`
      ),
      false
    );
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 5 // Maximum 5 files per request
  },
  fileFilter
});

export default upload;
