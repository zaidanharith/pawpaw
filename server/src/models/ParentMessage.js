const parentMessageSchema = new mongoose.Schema({
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parent',
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    reply: {
        type: String,
        trim: true
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    readByTeacher: {
        type: Boolean,
        default: false
    },
    readByParent: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ParentMessage', parentMessageSchema);