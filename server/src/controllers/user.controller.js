const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');

const userController = {
    // Get all users
    getAllUsers: async (req, res) => {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    username: true,
                    name: true,
                    email: true,
                    phoneNumber: true,
                    role: true,
                    isLogin: true,
                    createdAt: true,
                    updatedAt: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            res.status(200).json({
                success: true,
                count: users.length,
                data: users
            });
        } catch (error) {
            console.error('Get all users error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Gagal mengambil data pengguna'
            });
        }
    },

    // Get user by ID
    getUserById: async (req, res) => {
        try {
            const { id } = req.params;

            // Validate ObjectId
            if (!id || id.length !== 24) {
                return res.status(400).json({ 
                    success: false,
                    message: "ID tidak valid" 
                });
            }

            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    username: true,
                    name: true,
                    email: true,
                    phoneNumber: true,
                    role: true,
                    isLogin: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            announcements: true,
                            classroomsAsTeacher: true,
                            attendancesCreated: true,
                            liveReports: true,
                            sentMessages: true,
                            receivedMessages: true,
                            quarterlyReports: true
                        }
                    }
                }
            });

            if (!user) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Pengguna tidak ditemukan' 
                });
            }

            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            console.error('Get user error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Gagal mengambil data pengguna'
            });
        }
    },

    // Create user
    createUser: async (req, res) => {
        try {
            const { username, name, email, phoneNumber, password, role } = req.body;

            // Validate required fields
            if (!username || !email || !phoneNumber || !password || !role) {
                return res.status(400).json({
                    success: false,
                    message: 'Username, email, phoneNumber, password, dan role wajib diisi'
                });
            }

            // Validate enum role
            const validRoles = ['ADMIN', 'TEACHER', 'PARENT'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: `Role harus salah satu dari: ${validRoles.join(', ')}`
                });
            }

            // Check if user already exists
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email },
                        { username }
                    ]
                }
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: existingUser.email === email 
                        ? 'Email sudah terdaftar' 
                        : 'Username sudah terdaftar'
                });
            }

            // Hash password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = await prisma.user.create({
                data: {
                    username,
                    name: name || null,
                    email,
                    phoneNumber,
                    password: hashedPassword,
                    role,
                    isLogin: false
                },
                select: {
                    id: true,
                    username: true,
                    name: true,
                    email: true,
                    phoneNumber: true,
                    role: true,
                    createdAt: true
                }
            });

            res.status(201).json({
                success: true,
                message: 'Pengguna berhasil dibuat',
                data: newUser
            });
        } catch (error) {
            console.error('Create user error:', error);
            res.status(400).json({ 
                success: false,
                message: 'Gagal membuat pengguna'
            });
        }
    },

    // Update user
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { username, name, email, phoneNumber, password, role, isLogin } = req.body;

            // Validate ObjectId
            if (!id || id.length !== 24) {
                return res.status(400).json({ 
                    success: false,
                    message: "ID tidak valid" 
                });
            }

            // Check if user exists
            const existing = await prisma.user.findUnique({
                where: { id }
            });

            if (!existing) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Pengguna tidak ditemukan' 
                });
            }

            // Validate role if provided
            if (role) {
                const validRoles = ['ADMIN', 'TEACHER', 'PARENT'];
                if (!validRoles.includes(role)) {
                    return res.status(400).json({
                        success: false,
                        message: `Role harus salah satu dari: ${validRoles.join(', ')}`
                    });
                }
            }

            // Check unique constraints (email & username)
            if (email && email !== existing.email) {
                const emailExists = await prisma.user.findUnique({
                    where: { email }
                });
                if (emailExists) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email sudah digunakan'
                    });
                }
            }

            if (username && username !== existing.username) {
                const usernameExists = await prisma.user.findUnique({
                    where: { username }
                });
                if (usernameExists) {
                    return res.status(400).json({
                        success: false,
                        message: 'Username sudah digunakan'
                    });
                }
            }

            // Build update data
            const updateData = {};
            if (username) updateData.username = username;
            if (name !== undefined) updateData.name = name;
            if (email) updateData.email = email;
            if (phoneNumber) updateData.phoneNumber = phoneNumber;
            if (role) updateData.role = role;
            if (isLogin !== undefined) updateData.isLogin = isLogin;

            // Hash password if provided
            if (password) {
                const saltRounds = 10;
                updateData.password = await bcrypt.hash(password, saltRounds);
            }

            const updatedUser = await prisma.user.update({
                where: { id },
                data: updateData,
                select: {
                    id: true,
                    username: true,
                    name: true,
                    email: true,
                    phoneNumber: true,
                    role: true,
                    isLogin: true,
                    updatedAt: true
                }
            });

            res.status(200).json({
                success: true,
                message: 'Pengguna berhasil diperbarui',
                data: updatedUser
            });
        } catch (error) {
            console.error('Update user error:', error);
            res.status(400).json({ 
                success: false,
                message: 'Gagal memperbarui pengguna'
            });
        }
    },

    // Delete user
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;

            // Validate ObjectId
            if (!id || id.length !== 24) {
                return res.status(400).json({ 
                    success: false,
                    message: "ID tidak valid" 
                });
            }

            const user = await prisma.user.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: {
                            classroomsAsTeacher: true,
                            liveReports: true,
                            quarterlyReports: true
                        }
                    }
                }
            });

            if (!user) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Pengguna tidak ditemukan' 
                });
            }

            await prisma.user.delete({
                where: { id }
            });

            res.status(200).json({ 
                success: true,
                message: 'Pengguna berhasil dihapus' 
            });
        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Gagal menghapus pengguna'
            });
        }
    }
};

module.exports = userController;
