import express from 'express';
import { check } from 'express-validator';
import { AuthController } from '../controllers/authController';

const router = express.Router();

/**
 * @route   POST api/auth/register
 */
router.post(
    '/register',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ],
    AuthController.register
);

/**
 * @route   POST api/auth/login
 */
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    AuthController.login
);

/**
 * @route   POST api/auth/google
 */
router.post('/google', AuthController.googleLogin);

export default router;
