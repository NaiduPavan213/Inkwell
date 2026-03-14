import express from 'express';
import authMiddleware from '../middleware/auth';
import { SocialController } from '../controllers/socialController';

const router = express.Router();

// --- COMMENTS ---
// POST a new comment
router.post('/posts/:postId/comments', authMiddleware, SocialController.addComment);

// GET all comments for a post
router.get('/posts/:postId/comments', SocialController.getComments);

// --- LIKES ---
// POST a new like (or unlike)
router.post('/posts/:postId/like', authMiddleware, SocialController.toggleLike);

// GET all likes for a post
router.get('/posts/:postId/likes', SocialController.getLikes);

export default router;
