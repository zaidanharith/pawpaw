const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
const prisma = require('../config/prisma');
const { OAuth2Client } = require('google-auth-library');
const { sendWelcomeEmail } = require('../utils/mailer');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function euclideanDistance(d1, d2) {
  return Math.sqrt(d1.reduce((sum, val, i) => sum + Math.pow(val - d2[i], 2), 0));
}

const authController = {
  register: async (req, res) => {
    try {
      const { username, name, email, phoneNumber, role } = req.body;

      const password = Math.random().toString(36).replace(/[^a-z0-9]/g, '').slice(0, 6);

      if (!username || !email || !phoneNumber || !password || !role) {
        return res.status(400).json({
          success: false,
          message: 'Semua field wajib diisi'
        });
      }

      const validRoles = ['ADMIN', 'TEACHER', 'PARENT'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: `Role harus salah satu dari: ${validRoles.join(', ')}`
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password minimal 6 karakter'
        });
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { username },
            { phoneNumber }
          ]
        }
      });

      if (existingUser) {
        let message = 'Email sudah terdaftar';
        if (existingUser.username === username) message = 'Username sudah terdaftar';
        if (existingUser.phoneNumber === phoneNumber) message = 'Nomor telepon sudah terdaftar';
        
        return res.status(400).json({
          success: false,
          message
        });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = await prisma.user.create({
        data: {
          username,
          name: name || null,
          email,
          phoneNumber,
          password: hashedPassword,
          role,
          provider: 'LOCAL',
          isLogin: false,
          isActive: true,
          isPasswordReset: false
        },
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
          role: true,
          phoneNumber: true,
          provider: true,
          createdAt: true
        }
      });

      try {
        await sendWelcomeEmail(email, name, username, password);
      } catch (mailError) {
        console.error('Gagal mengirim email registrasi:', mailError);
      }

      res.status(201).json({
        success: true,
        message: 'User berhasil didaftarkan. Email konfirmasi telah dikirim.',
        data: user
      });

    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi error di server.',
        error: error.message
      });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username dan password wajib diisi'
        });
      }

      const user = await prisma.user.findUnique({
        where: { username }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Username/Password salah'
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Akun Anda telah dinonaktifkan. Hubungi administrator.'
        });
      }

      if (user.provider === 'GOOGLE' && !user.password) {
        return res.status(400).json({
          success: false,
          message: 'Akun Google tidak memiliki password. Silakan login dengan Google atau reset password untuk membuat password.'
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Username/Password salah'
        });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { isLogin: true }
      });

      const token = generateToken(user.id, user.username, user.role);

      res.status(200).json({
        success: true,
        message: 'Login berhasil',
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
          phoneNumber: user.phoneNumber,
          picture: user.picture,
          provider: user.provider
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi error di server',
        error: error.message
      });
    }
  },

  googleAuth: async (req, res) => {
    try {
      const { email, name, googleId, picture } = req.body;

      if (!email || !googleId) {
        return res.status(400).json({
          success: false,
          message: 'Email dan Google ID wajib diisi'
        });
      }

      let user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(200).json({
          success: false,
          message: 'Email Anda tidak terdaftar dalam sistem. Silakan hubungi administrator untuk mendapatkan akses.',
          userNotFound: true
        });
      }

      if (!user.isActive) {
        return res.status(200).json({
          success: false,
          message: 'Akun Anda telah dinonaktifkan. Silakan hubungi administrator.',
          accountInactive: true
        });
      }

      if (!user.googleId) {
        user = await prisma.user.update({
          where: { email },
          data: {
            googleId,
            picture,
            provider: 'GOOGLE',
            emailVerified: new Date(),
            isLogin: true
          }
        });
      } else {
        user = await prisma.user.update({
          where: { email },
          data: {
            picture,
            isLogin: true
          }
        });
      }

      const token = generateToken(user.id, user.username, user.role);

      res.status(200).json({
        success: true,
        message: `Selamat datang, ${user.name}!`,
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
          picture: user.picture,
          provider: user.provider,
          emailVerified: user.emailVerified,
          phoneNumber: user.phoneNumber
        }
      });

    } catch (error) {
      console.error('Google auth error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server. Silakan coba lagi.',
        serverError: true
      });
    }
  },

  verifyGoogleToken: async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token wajib diisi'
        });
      }

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();

      res.status(200).json({
        success: true,
        message: 'Token valid',
        data: {
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          googleId: payload.sub,
          emailVerified: payload.email_verified
        }
      });

    } catch (error) {
      console.error('Token verification error:', error);
      res.status(400).json({
        success: false,
        message: 'Invalid Google token',
        error: error.message
      });
    }
  },

  logout: async (req, res) => {
    try {
      if (req.user && req.user.id) {
        await prisma.user.update({
          where: { id: req.user.id },
          data: { isLogin: false }
        });
      }

      res.status(200).json({
        success: true,
        message: 'Logout berhasil'
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi error di server',
        error: error.message
      });
    }
  },

  getProfile: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User tidak ditemukan'
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          picture: user.picture,
          provider: user.provider,
          emailVerified: user.emailVerified,
          isLogin: user.isLogin,
          isPasswordReset: user.isPasswordReset,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi error di server',
        error: error.message
      });
    }
  },

// Tambahkan atau update method updateProfile di auth.controller.js

  updateProfile: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User tidak ditemukan'
        });
      }

      const { name, username, email, phoneNumber, picture } = req.body;

      if (!name || !username || !email) {
        return res.status(400).json({
          success: false,
          message: 'Nama, username, dan email wajib diisi'
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan'
        });
      }

      // Cek apakah username atau email sudah digunakan user lain
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { username }
          ],
          NOT: {
            id: req.user.id
          }
        }
      });

      if (existingUser) {
        let message = 'Email sudah digunakan oleh user lain';
        if (existingUser.username === username) {
          message = 'Username sudah digunakan oleh user lain';
        }
        
        return res.status(400).json({
          success: false,
          message
        });
      }

      // Update data user
      const updateData = {
        name,
        username,
        email,
        phoneNumber: phoneNumber || null
      };

      // Hanya update picture jika ada perubahan
      if (picture !== undefined && picture !== user.picture) {
        updateData.picture = picture;
      }

      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: updateData
      });

      res.status(200).json({
        success: true,
        message: 'Profil berhasil diperbarui',
        data: {
          id: updatedUser.id,
          username: updatedUser.username,
          name: updatedUser.name,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
          role: updatedUser.role,
          picture: updatedUser.picture,
          provider: updatedUser.provider,
          emailVerified: updatedUser.emailVerified,
          isLogin: updatedUser.isLogin,
          isPasswordReset: updatedUser.isPasswordReset,
          isActive: updatedUser.isActive,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt
        }
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi error di server',
        error: error.message
      });
    }
  },


  resetPassword: async (req, res) => {
    try {
      const { username, newPassword } = req.body;

      if (!username || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Username dan password baru wajib diisi'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password minimal 6 karakter'
        });
      }

      const user = await prisma.user.findUnique({
        where: { username }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan'
        });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      await prisma.user.update({
        where: { id: user.id },
        data: { 
          password: hashedPassword,
          isPasswordReset: true
        }
      });

      res.status(200).json({
        success: true,
        message: 'Password berhasil diubah'
      });

    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi error di server',
        error: error.message
      });
    }
  },

  faceLogin: async (req, res) => {
    try {
      const { descriptor } = req.body;
      if (!descriptor || !Array.isArray(descriptor)) {
        return res.status(400).json({ success: false, message: "Descriptor tidak valid" });
      }

      const users = await prisma.user.findMany({
        where: {
          faceDescriptor: {
            isEmpty: false
          }
        }
      });

      let matchedUser = null;
      let minDistance = 0.6;
      for (const user of users) {
        if (user.faceDescriptor && user.faceDescriptor.length === descriptor.length) {
          const dist = euclideanDistance(user.faceDescriptor, descriptor);
          if (dist < minDistance) {
            minDistance = dist;
            matchedUser = user;
          }
        }
      }

      if (matchedUser) {
        const token = generateToken(matchedUser.id, matchedUser.username, matchedUser.role);
        return res.json({
          success: true,
          token,
          user: {
            id: matchedUser.id,
            username: matchedUser.username,
            name: matchedUser.name,
            email: matchedUser.email,
            role: matchedUser.role,
            phoneNumber: matchedUser.phoneNumber,
            picture: matchedUser.picture,
            provider: matchedUser.provider
          }
        });
      } else {
        return res.status(401).json({ success: false, message: "Wajah tidak cocok" });
      }
    } catch (err) {
      console.error("Face login error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },

  registerFaceDescriptor: async (req, res) => {
    try {
      const { userId, descriptor } = req.body;
      if (!userId || !descriptor || !Array.isArray(descriptor)) {
        return res.status(400).json({ success: false, message: "Data tidak lengkap" });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ success: false, message: "User tidak ditemukan" });
      }

      await prisma.user.update({
        where: { id: userId },
        data: { faceDescriptor: descriptor }
      });

      res.json({ success: true, message: "Face descriptor berhasil didaftarkan" });
    } catch (err) {
      console.error("Register face descriptor error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },

  verifyFaceToken: async (req, res) => {
    try {
      const { faceToken } = req.body;
      if (!faceToken) {
        return res.status(400).json({ success: false, message: "Token wajah wajib diisi" });
      }

      const { verifyToken } = require('../utils/jwt');
      let payload;
      try {
        payload = verifyToken(faceToken);
      } catch (err) {
        return res.status(401).json({ success: false, message: "Token tidak valid" });
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.id }
      });

      if (!user) {
        return res.status(404).json({ success: false, message: "User tidak ditemukan" });
      }

      return res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
          picture: user.picture,
          phoneNumber: user.phoneNumber,
          provider: user.provider
        },
        token: faceToken
      });
    } catch (err) {
      console.error("Verifikasi token wajah error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
};

module.exports = authController;