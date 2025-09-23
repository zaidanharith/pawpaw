const Parent = require('../models/parentModel');

// Get all parents
exports.getAllParents = async (req, res) => {
    try {
        const parents = await Parent.find();
        res.status(200).json(parents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get parent by ID
exports.getParentById = async (req, res) => {
    try {
        const parent = await Parent.findById(req.params.id);
        if (!parent) {
            return res.status(404).json({ message: 'Parent not found' });
        }
        res.status(200).json(parent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new parent
exports.createParent = async (req, res) => {
    try {
        const parent = new Parent(req.body);
        await parent.save();
        res.status(201).json(parent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update parent
exports.updateParent = async (req, res) => {
    try {
        const parent = await Parent.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!parent) {
            return res.status(404).json({ message: 'Parent not found' });
        }
        res.status(200).json(parent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete parent
exports.deleteParent = async (req, res) => {
    try {
        const parent = await Parent.findByIdAndDelete(req.params.id);
        if (!parent) {
            return res.status(404).json({ message: 'Parent not found' });
        }
        res.status(200).json({ message: 'Parent deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
