import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const createStorage = (folder) => {
  try {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder,
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
      }
    });
    return storage;
  } catch (error) {
    throw error;
  }
};

const profileUpload = multer({
  storage: createStorage('Community Learning Platform API/profiles'),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 6
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  preserveExtension: true,
  abortOnLimit: false
}).fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'certificates', maxCount: 5 }
]);

const profileUploadWithErrorHandling = (req, res, next) => {
  profileUpload(req, res, (err) => {
    if (err) {
      if (err.message && err.message.includes('Unexpected end of form')) {
        return next();
      }
      
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          status: false,
          message: `Upload error: ${err.message}`,
          code: err.code
        });
      }
      
      return res.status(400).json({
        status: false,
        message: `File error: ${err.message}`
      });
    }
    
    next();
  });
};

const profileImageUpload = multer({
  storage: createStorage('Community Learning Platform API/profiles'),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
}).single('profileImage');

const certificateUpload = multer({
  storage: createStorage('Community Learning Platform API/certificates'),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
}).array('certificates', 5);

const projectThumbnailUpload = multer({
  storage: createStorage('Community Learning Platform API/projects/thumbnails'),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
}).single('thumbnail');

const projectImagesUpload = multer({
  storage: createStorage('Community Learning Platform API/projects/images'),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 3
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
}).array('images', 3);

const projectUpload = multer({
  storage: createStorage('Community Learning Platform API/projects'),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 4
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  preserveExtension: true,
  abortOnLimit: false
}).fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

const projectUploadWithErrorHandling = (req, res, next) => {
  projectUpload(req, res, (err) => {
    if (err) {
      if (err.message && err.message.includes('Unexpected end of form')) {
        return next();
      }
      
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          status: false,
          message: `Project upload error: ${err.message}`,
          code: err.code
        });
      }
      
      return res.status(400).json({
        status: false,
        message: `Project file error: ${err.message}`
      });
    }
    
    next();
  });
};

// const carouselUpload = multer({
//   storage: createStorage('Community Learning Platform API/carousel'),
//   limits: {
//     fileSize: 5 * 1024 * 1024,
//     files: 3
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed'), false);
//     }
//   }
// }).array('coursolImages', 3);


const carouselUpload  = multer({
  storage: createStorage('Community Learning Platform API/content_uploads'), // Or a more specific subfolder like 'Community Learning Platform API/combined_content'
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 13 // Example: 3 for carousel + max 10 for categories. Adjust as per your max expected categories.
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  preserveExtension: true,
  abortOnLimit: false
}).fields([
  { name: 'coursolImages', maxCount: 3 },
  { name: 'categoryImages', maxCount: 10 } // Adjust maxCount based on your needs
]);



const categoryImageUpload = multer({
  storage: createStorage('Community Learning Platform API/categories'),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
}).single('categoryImage');

export {
  profileUpload,
  profileUploadWithErrorHandling,
  profileImageUpload,
  certificateUpload,
  projectThumbnailUpload,
  projectImagesUpload,
  projectUpload,
  projectUploadWithErrorHandling,
  carouselUpload,
  categoryImageUpload
};