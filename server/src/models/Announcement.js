const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const mongoose = require('mongoose');

const Announcement = sequelize.define('Announcement', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'announcements',
    timestamps: true
});

module.exports = mongoose.model('Announcement', announcementSchema);