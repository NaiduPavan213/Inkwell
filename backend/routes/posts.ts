import express, { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import authMiddleware from '../middleware/auth';
import Post from '../models/Post';

const router = express.Router();

// Create a new post
router.post(
    '/',
    [
        authMiddleware,
        check('title', 'Title is required').not().isEmpty(),
        check('content', 'Content is required').not().isEmpty()
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newPost = new Post({
                title: req.body.title,
                content: req.body.content,
                author: req.user?.id,
            });

            const post = await newPost.save();
            res.status(201).json(post);
        } catch (err) {
            next(err);
        }
    }
);

// --- GET ALL POSTS ---
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).lean();
        res.json(posts);
    } catch (err) {
        next(err);
    }
});

// --- GET A SINGLE POST BY ID ---
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await Post.findById(req.params.id).lean();
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.json(post);
    } catch (err: any) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'post not found.' });
        }
        next(err);
    }
});

// --- UPDATE A POST ---
router.put(
    '/:id',
    [
        authMiddleware,
        check('title', 'Title is required').not().isEmpty(),
        check('content', 'Content is required').not().isEmpty()
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            let post = await Post.findById(req.params.id).lean();
            if (!post) {
                return res.status(404).json({ msg: 'post not found' });
            }
            if (post.author.toString() !== req.user?.id) {
                return res.status(401).json({ msg: 'User not authorised to update the post' });
            }

            const updatedPost = await Post.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );
            res.json(updatedPost);
        } catch (err) {
            next(err);
        }
    }
);

// --- DELETE A POST ---
router.delete('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        if (post.author.toString() !== req.user?.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        await post.deleteOne();
        res.json({ msg: 'Post removed successfully' });
    } catch (err) {
        next(err);
    }
});

export default router;
