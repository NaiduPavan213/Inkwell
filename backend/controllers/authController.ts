import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from '../services/authService';

export class AuthController {
    /**
     * @route   POST api/auth/register
     * @desc    Register user
     * @access  Public
     */
    static async register(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const token = await AuthService.registerUser(req.body);
            res.status(201).json({ token });
        } catch (err: any) {
            if (err.message.includes('exists') || err.message.includes('taken')) {
                return res.status(400).json({ msg: err.message });
            }
            next(err);
        }
    }

    /**
     * @route   POST api/auth/login
     * @desc    Authenticate user & get token
     * @access  Public
     */
    static async login(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const token = await AuthService.loginUser(req.body);
            res.json({ token });
        } catch (err: any) {
            if (err.message === 'Invalid credentials.') {
                return res.status(400).json({ msg: err.message });
            }
            next(err);
        }
    }

    /**
     * @route   POST api/auth/google
     * @desc    Google login
     * @access  Public
     */
    static async googleLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const { tokenId } = req.body;
            if (!tokenId) {
                return res.status(400).json({ msg: 'Google Token is required' });
            }
            const token = await AuthService.googleLogin(tokenId);
            res.json({ token });
        } catch (err: any) {
            console.error('Google Auth Error:', err.message);
            res.status(401).json({ msg: 'Google Authentication failed' });
        }
    }
}
