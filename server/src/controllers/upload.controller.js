const Upload = require('../models/Upload');

const uploadController = {

    uploadFile: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'Tidak ada file yang diupload' });
            }
            const newUpload = new Upload({
                filename: req.file.filename || req.file.originalname,
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size,
                path: req.file.path,
            });

            await newUpload.save();

            res.json({
            message: 'Upload berhasil',
            data: newUpload,
            });
        } catch (error) {
            res.status(500).json({ message: 'Upload gagal', error: error.message });
        }
    }
};

module.exports = uploadController;
