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

// Optimization: Indexing to quickly find comments for a specific post
CommentSchema.index({ post: 1 });

module.exports = mongoose.model('Comment', CommentSchema);