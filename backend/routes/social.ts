import express, { Request, Response } from 'express';
import authMiddleware from '../middleware/auth';
import Comment from '../models/Comment';
import Like from '../models/Like';
import User from '../models/User';

const router = express.Router();

// --- COMMENTS ---

// POST a new comment
router.post('/posts/:postId/comments', authMiddleware, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user?.id).lean();
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const newComment = new Comment({
            text: req.body.text,
            author: req.user?.id,
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
router.get('/posts/:postId/comments', async (req: Request, res: Response) => {
    try {
        const comments = await Comment.find({ post: req.params.postId }).sort({ createdAt: 'desc' }).lean();
        res.json(comments);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- LIKES ---

// POST a new like (or unlike)
router.post('/posts/:postId/like', authMiddleware, async (req: Request, res: Response) => {
    try {
        const postId = req.params.postId;
        const userId = req.user?.id;

        const existingLike = await Like.findOne({ post: postId, user: userId });

        if (existingLike) {
            await existingLike.deleteOne();
            res.json({ msg: 'Post unliked' });
        } else {
            const newLike = new Like({ post: postId, user: userId });
            await newLike.save();
            res.status(201).json({ msg: 'Post liked' });
        }
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// GET all likes for a post
router.get('/posts/:postId/likes', async (req: Request, res: Response) => {
    try {
        const likes = await Like.find({ post: req.params.postId }).lean();
        res.json(likes);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

export default router;
