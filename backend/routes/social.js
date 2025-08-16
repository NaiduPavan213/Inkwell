const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const User = require('../models/User');

// --- COMMENTS ---

// POST a new comment
router.post('/posts/:postId/comments', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const newComment = new Comment({
            text: req.body.text,
            author: req.user.id,
            post: req.params.postId,
            authorUsername: user.username,
        });
        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// GET all comments for a post
router.get('/posts/:postId/comments', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId }).sort({ createdAt: 'desc' });
        res.json(comments);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- LIKES ---

// POST a new like (or unlike)
router.post('/posts/:postId/like', authMiddleware, async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;

        const existingLike = await Like.findOne({ post: postId, user: userId });

        if (existingLike) {
            // If user has already liked, unlike the post
            await existingLike.deleteOne();
            res.json({ msg: 'Post unliked' });
        } else {
            // If user has not liked, like the post
            const newLike = new Like({ post: postId, user: userId });
            await newLike.save();
            res.status(201).json({ msg: 'Post liked' });
        }
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// GET all likes for a post (to get the count and check if user has liked)
router.get('/posts/:postId/likes', async (req, res) => {
    try {
        const likes = await Like.find({ post: req.params.postId });
        res.json(likes);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


module.exports = router;