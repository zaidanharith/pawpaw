const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
const prisma = require('../config/prisma');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authController = {
  register: async (req, res) => {
    try {
      const { username, name, email, phoneNumber, password, role } = req.body;

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
          pictureId: null,
          isLogin: false
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

      res.status(201).json({
        success: true,
        message: 'User berhasil didaftarkan. Silakan login untuk melanjutkan.',
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

      // Validate required fields
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

      if (user.provider === 'GOOGLE') {
        return res.status(400).json({
          success: false,
          message: 'Akun ini terdaftar menggunakan Google. Silakan login dengan Google.'
        });
      }

      if (!user.password) {
        return res.status(400).json({
          success: false,
          message: 'Password tidak ditemukan. Silakan reset password atau login dengan Google.'
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

      // ✅ Manual join to get picture
      let pictureUrl = null;
      if (user.pictureId) {
        const upload = await prisma.upload.findUnique({
          where: { id: user.pictureId }
        });
        pictureUrl = upload?.path || null;
      }

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
          picture: pictureUrl, // ✅ Return picture URL
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

      let user = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { googleId }
          ]
        }
      });

      if (user) {
        // ✅ Update existing user with Google data
        let uploadId = user.pictureId;

        // If picture URL changed, create/update upload record
        if (picture) {
          let existingUpload = uploadId 
            ? await prisma.upload.findUnique({ where: { id: uploadId } }) 
            : null;

          if (!existingUpload || existingUpload.path !== picture) {
            // Create new upload record for Google profile picture
            const upload = await prisma.upload.create({
              data: {
                filename: `google-profile-${googleId}.jpg`,
                originalName: `${name || 'user'}-profile.jpg`,
                mimeType: 'image/jpeg',
                size: 0, // Unknown size for external URLs
                path: picture, // Google CDN URL
                uploadType: 'PROFILE_PICTURE',
                uploadedBy: user.id
              }
            });
            uploadId = upload.id;
          }
        }

        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId,
            pictureId: uploadId,
            emailVerified: new Date(),
            provider: 'GOOGLE',
            isLogin: true
          }
        });

        console.log('✅ Existing user logged in with Google:', user.email);
      } else {
        // ✅ Create new user from Google
        const username = email.split('@')[0] + '_' + Math.random().toString(36).substring(2, 9);

        // Create upload record for Google profile picture
        let uploadId = null;
        if (picture) {
          const upload = await prisma.upload.create({
            data: {
              filename: `google-profile-${googleId}.jpg`,
              originalName: `${name || 'user'}-profile.jpg`,
              mimeType: 'image/jpeg',
              size: 0,
              path: picture,
              uploadType: 'PROFILE_PICTURE'
            }
          });
          uploadId = upload.id;
        }

        user = await prisma.user.create({
          data: {
            username,
            name: name || 'Google User',
            email,
            phoneNumber: null,
            password: null,
            role: 'PARENT',
            googleId,
            pictureId: uploadId,
            provider: 'GOOGLE',
            emailVerified: new Date(),
            isLogin: true
          }
        });

        console.log('✅ New user created from Google:', user.email);
      }

      // ✅ Manual join to get picture URL
      let pictureUrl = null;
      if (user.pictureId) {
        const upload = await prisma.upload.findUnique({
          where: { id: user.pictureId }
        });
        pictureUrl = upload?.path || null;
      }

      const token = generateToken(user.id, user.username, user.role);

      res.status(200).json({
        success: true,
        message: user.emailVerified ? 'Google login berhasil' : 'Akun Google berhasil dibuat',
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
          picture: pictureUrl, // ✅ Return picture URL
          provider: user.provider,
          emailVerified: user.emailVerified,
          phoneNumber: user.phoneNumber
        }
      });

    } catch (error) {
      console.error('Google auth error:', error);
      res.status(500).json({
        success: false,
        message: 'Google authentication failed',
        error: error.message
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

      // ✅ Manual join to get picture URL
      let pictureUrl = null;
      if (user.pictureId) {
        const upload = await prisma.upload.findUnique({
          where: { id: user.pictureId }
        });
        pictureUrl = upload?.path || null;
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
          picture: pictureUrl, // ✅ Return picture URL
          provider: user.provider,
          emailVerified: user.emailVerified,
          isLogin: user.isLogin,
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

      if (user.provider === 'GOOGLE') {
        return res.status(400).json({
          success: false,
          message: 'Akun Google tidak memiliki password. Silakan login dengan Google atau hubungi admin.'
        });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
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
  }
};

module.exports = authController;