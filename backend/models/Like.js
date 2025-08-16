const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
});

// Ensure a user can only like a post once
LikeSchema.index({ user: 1, post: 1 }, { unique: true });

module.exports = mongoose.model('Like', LikeSchema);