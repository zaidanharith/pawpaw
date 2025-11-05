const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const path = require('path');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats: [
      'jpg','jpeg','png','gif','bmp','tiff','tif','webp','svg','ico','heic','heif','raw','cr2','nef','arw','dng',
      'pdf','doc','docx','xls','xlsx','ppt','pptx','txt','rtf','odt','ods','odp','csv','zip','rar','7z','tar','gz'
    ],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const baseName = path.basename(file.originalname, path.extname(file.originalname));
      return `${baseName}-${timestamp}`;
    },
    format: (req, file) => file.mimetype.split('/')[1],
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 
    'image/tiff', 'image/webp', 'image/svg+xml', 'image/x-icon',
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain', 'application/rtf', 'text/csv',
    'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed',
    'application/x-tar', 'application/gzip'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.error('File type not allowed:', file.mimetype);
    cb(new Error('Format file tidak didukung'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

module.exports = upload;
