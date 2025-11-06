const prisma = require('../config/prisma');

const uploadController = {
    uploadFile: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Tidak ada file yang diupload' 
                });
            }

            const newUpload = await prisma.upload.create({
                data: {
                    filename: req.file.filename || req.file.originalname,
                    originalName: req.file.originalname,
                    mimeType: req.file.mimetype,
                    size: req.file.size,
                    path: req.file.path,
                }
            });

            res.status(201).json({
                success: true,
                message: 'Upload berhasil',
                data: newUpload,
            });
        } catch (error) {
            console.error('Upload file error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Upload gagal'
            });
        }
    },

    getAllUploads: async (req, res) => {
        try {
            const uploads = await prisma.upload.findMany({
                include: {
                    liveReport: {
                        select: {
                            id: true,
                            title: true,
                            date: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            res.status(200).json({
                success: true,
                count: uploads.length,
                data: uploads
            });
        } catch (error) {
            console.error('Get uploads error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Gagal mengambil data upload'
            });
        }
    },

    getUploadById: async (req, res) => {
        try {
            const { id } = req.params;

            // Validate ObjectId
            if (!id || id.length !== 24) {
                return res.status(400).json({ 
                    success: false,
                    message: "ID tidak valid" 
                });
            }

            const upload = await prisma.upload.findUnique({
                where: { id },
                include: {
                    liveReport: {
                        select: {
                            id: true,
                            title: true,
                            date: true,
                            teacher: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                }
            });

            if (!upload) {
                return res.status(404).json({ 
                    success: false,
                    message: 'File tidak ditemukan' 
                });
            }

            res.status(200).json({
                success: true,
                data: upload
            });
        } catch (error) {
            console.error('Get upload error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Gagal mengambil data upload'
            });
        }
    },

    deleteUpload: async (req, res) => {
        try {
            const { id } = req.params;

            // Validate ObjectId
            if (!id || id.length !== 24) {
                return res.status(400).json({ 
                    success: false,
                    message: "ID tidak valid" 
                });
            }

            const upload = await prisma.upload.findUnique({
                where: { id }
            });

            if (!upload) {
                return res.status(404).json({ 
                    success: false,
                    message: 'File tidak ditemukan' 
                });
            }

            // Optional: Delete physical file
            const fs = require('fs');
            const path = require('path');
            
            if (upload.path && fs.existsSync(upload.path)) {
                fs.unlinkSync(upload.path);
            }

            await prisma.upload.delete({
                where: { id }
            });

            res.status(200).json({ 
                success: true,
                message: 'File berhasil dihapus' 
            });
        } catch (error) {
            console.error('Delete upload error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Gagal menghapus file'
            });
        }
    },

    _saveFile: async (file) => {
        return await prisma.upload.create({
            data: {
                filename: file.filename || file.originalname,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                path: file.path,
            }
        });
    }
};

module.exports = uploadController;
