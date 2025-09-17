const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
    // Register new user
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ 
                $or: [{ email }, { username }] 
            });
            
            if (existingUser) {
                return res.status(400).json({ 
                    message: 'User already exists' 
                });
            }

            // Hash password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create new user
            const user = new User({
                username,
                email,
                password: hashedPassword
            });

            await user.save();

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'User created successfully',
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Server error', 
                error: error.message 
            });
        }
    },

    // Login user
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ 
                    message: 'Invalid credentials' 
                });
            }

            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ 
                    message: 'Invalid credentials' 
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Server error', 
                error: error.message 
            });
        }
    },

    // Get current user
    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.userId).select('-password');
            res.json({ user });
        } catch (error) {
            res.status(500).json({ 
                message: 'Server error', 
                error: error.message 
            });
        }
    }
};

module.exports = authController;