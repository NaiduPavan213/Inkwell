import express from 'express';
import { check } from 'express-validator';
import authMiddleware from '../middleware/auth';
import { PostController } from '../controllers/postController';

const router = express.Router();

// @route   POST api/posts
router.post(
    '/',
    [
        authMiddleware,
        check('title', 'Title is required').not().isEmpty(),
        check('content', 'Content is required').not().isEmpty()
    ],
    PostController.createPost
);

// @route   GET api/posts
router.get('/', PostController.getAllPosts);

// @route   GET api/posts/:id
router.get('/:id', PostController.getPostById);

// @route   PUT api/posts/:id
router.put(
    '/:id',
    [
        authMiddleware,
        check('title', 'Title is required').not().isEmpty(),
        check('content', 'Content is required').not().isEmpty()
    ],
    PostController.updatePost
);

// @route   DELETE api/posts/:id
router.delete('/:id', authMiddleware, PostController.deletePost);

export default router;
