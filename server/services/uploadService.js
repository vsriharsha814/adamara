const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Configure AWS SDK
const configureAWS = () => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1'
  });
  
  return new AWS.S3();
};

// Initialize S3 instance
const s3 = process.env.NODE_ENV === 'production' ? configureAWS() : null;

// Define allowed file types
const allowedFileTypes = [
  'image/jpeg',
  'image/png',
  'application/pdf'
];

// File size limit (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Create local uploads directory if it doesn't exist
const ensureUploadsDir = () => {
  const dir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

// Configure local storage for development
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = ensureUploadsDir();
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Configure S3 storage for production
const s3Storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_S3_BUCKET,
  acl: 'private',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `uploads/${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed. Allowed types: ${allowedFileTypes.join(', ')}`), false);
  }
};

// Create multer uploader based on environment
const uploader = multer({
  storage: process.env.NODE_ENV === 'production' ? s3Storage : localStorage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: fileFilter
});

/**
 * Generate file upload URL for client-side forms
 * @param {Object} options - Upload options
 * @returns {Object} - URL and fields for direct upload
 */
const generateUploadUrl = async (options = {}) => {
  if (process.env.NODE_ENV !== 'production' || !s3) {
    throw new Error('Direct uploads are only available in production environment');
  }

  const fileName = options.fileName || `file-${Date.now()}`;
  const fileType = options.fileType || 'application/octet-stream';
  const expiration = options.expiration || 60; // URL expiration in seconds

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `uploads/${fileName}`,
    ContentType: fileType,
    Expires: expiration
  };

  try {
    const signedUrl = await s3.getSignedUrlPromise('putObject', params);
    return {
      url: signedUrl,
      key: `uploads/${fileName}`
    };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw error;
  }
};

/**
 * Get file download URL
 * @param {String} key - S3 object key
 * @returns {String} - Presigned download URL
 */
const getFileDownloadUrl = async (key) => {
  if (process.env.NODE_ENV !== 'production' || !s3) {
    // For development, construct local URL
    return `/uploads/${path.basename(key)}`;
  }

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Expires: 3600 // URL valid for 1 hour
  };

  try {
    return await s3.getSignedUrlPromise('getObject', params);
  } catch (error) {
    console.error('Error generating download URL:', error);
    throw error;
  }
};

/**
 * Delete file from storage
 * @param {String} key - File key or path
 * @returns {Promise} - Result of delete operation
 */
const deleteFile = async (key) => {
  if (process.env.NODE_ENV !== 'production' || !s3) {
    // For development, delete local file
    const filePath = path.join(ensureUploadsDir(), path.basename(key));
    
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting local file:', err);
          reject(err);
        } else {
          resolve({ success: true, message: 'File deleted successfully' });
        }
      });
    });
  }

  // For production, delete from S3
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key
  };

  try {
    const result = await s3.deleteObject(params).promise();
    return {
      success: true,
      message: 'File deleted successfully',
      result
    };
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw error;
  }
};

module.exports = {
  uploader,
  generateUploadUrl,
  getFileDownloadUrl,
  deleteFile
};