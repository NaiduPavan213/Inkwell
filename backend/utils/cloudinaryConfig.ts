import { v2 as cloudinary } from 'cloudinary';
const { CloudinaryStorage } = require('multer-storage-cloudinary');
import multer from 'multer';

// 1. Connect to your account using the .env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Define the storage rules
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'inkwell_posts',
    format: 'jpg'
  },
});

// 3. Create the 'upload' middleware
const upload = multer({ storage: storage });

export default upload;
