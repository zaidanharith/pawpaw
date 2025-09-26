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
      const ext = path.extname(file.originalname).replace(".", "");
      const baseName = path.basename(file.originalname, path.extname(file.originalname));
      return `${baseName}-${timestamp}.${ext}`;
    }
  },
});

const upload = multer({ storage });
module.exports = upload;
