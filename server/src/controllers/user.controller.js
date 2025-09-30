const mongoose = require("mongoose");
const User = require('../models/User');

const userController = {
    getAllUsers : async (req, res) => {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getUserById : async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: "ID tidak valid" });
            }

            const user = await User.findById(req.params.id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json(user);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    createUser : async (req, res) => {
        const user = new User(req.body);
        try {
            const newUser = await user.save();
            res.status(201).json(newUser);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    updateUser : async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: "ID tidak valid" });
            }

            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!updatedUser) return res.status(404).json({ message: 'User not found' });
            res.json(updatedUser);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    deleteUser : async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: "ID tidak valid" });
            }
            
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            if (!deletedUser) return res.status(404).json({ message: 'User not found' });
            res.json({ message: 'User deleted' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = userController;
