const Upload = require('../models/Upload');

const uploadController = {
    uploadFile: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'Tidak ada file yang diupload' });
            }
            const newUpload = await Upload.create({
                filename: req.file.filename || req.file.originalname,
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size,
                path: req.file.path,
            });

            res.json({
                message: 'Upload berhasil',
                data: newUpload,
            });
        } catch (error) {
            res.status(500).json({ message: 'Upload gagal', error: error.message });
        }
    },

    _saveFile: async (file) => {
        return await Upload.create({
            filename: file.filename || file.originalname,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            path: file.path,
        });
    }
};

module.exports = uploadController;
