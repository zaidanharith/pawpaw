const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
    register: async (req, res) => {
        try {   
            console.log(req.body);
            const { username, name, email, phoneNumber, password, role } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User sudah terdaftar' });
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const user = new User({
                username,
                name,
                email,
                phoneNumber,
                password: hashedPassword,
                role
            });

            await user.save();

            res.status(201).json({
                message: 'User berhasil didaftarkan. Silakan login untuk melanjutkan.',
                user: { id: user._id, username: user.username, name: user.name, email: user.email }
            });

        } catch (error) {   
            res.status(500).json({ message: 'Terjadi error di server.', error: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: 'Username/Password salah' });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Username/Password salah' });
            }

            const token = jwt.sign(
                { userId: user._id.toString(), username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Login berhasil',
                token,
                user: { id: user._id, username: user.username, name: user.name }
            });
        } catch (error) {
            res.status(500).json({ message: 'Terjadi error di server', error: error.message });
        }
    },

    logout: (req, res) => {
        res.json({ message: 'Logout berhasil' });
    },

    getProfile: async (req, res) => {
        try {
            console.log(req.userId);
            const user = await User.findById(req.userId).select('-password');
            console.log(user);
            if (!user) {
                return res.status(404).json({ message: 'User tidak ditemukan' });
            }

            res.json({ user });
        } catch (error) {
            res.status(500).json({ message: 'Terjadi error di server', error: error.message });
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { email, newPassword } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User tidak ditemukan' });
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            user.password = hashedPassword;
            await user.save();
            res.json({ message: 'Password berhasil diubah' });
        } catch (error) {
            res.status(500).json({ message: 'Terjadi error di server', error: error.message });
        }
    }
};

module.exports = authController;