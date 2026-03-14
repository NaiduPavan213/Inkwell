import { v2 as cloudinary } from 'cloudinary';
import CloudinaryStorage = require('multer-storage-cloudinary');
import multer from 'multer';

// 1. Connect to your account using the .env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Define the storage rules (Where should images go?)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'inkwell_posts', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 1200, height: 630, crop: 'limit' }] // Large optimized size
  } as any,
});

// 3. Create the 'upload' middleware
const upload = multer({ storage: storage });

export default upload;
