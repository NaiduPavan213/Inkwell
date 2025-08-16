const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    authorUsername: { // Store username for easy display
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);