import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {
    /**
     * Registers a new user and returns a JWT token
     */
    static async registerUser(userData: any) {
        const { username, email, password } = userData;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            throw new Error('User with this email already exists.');
        }

        let existingUsername = await User.findOne({ username });
        if (existingUsername) {
            throw new Error('Username already taken.');
        }

        user = new User({
            username,
            email,
            password
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        // Generate Token
        return this.generateToken(user.id);
    }

    /**
     * Authenticates a user and returns a JWT token
     */
    static async loginUser(credentials: any) {
        const { email, password } = credentials;

        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Incorrect password.');
        }

        return this.generateToken(user.id);
    }

    /**
     * Authenticates with Google and returns a JWT token
     */
    static async googleLogin(tokenId: string) {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            throw new Error('Invalid Google Token');
        }

        const { email, name, sub: googleId } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            // Create user if not exists
            user = new User({
                username: name || email.split('@')[0],
                email,
                password: await bcrypt.hash(googleId, 10) // Random password
            });
            await user.save();
        }

        return this.generateToken(user.id);
    }

    /**
     * Helper to sign JWT tokens
     */
    private static generateToken(userId: string): Promise<string> {
        const payload = {
            user: {
                id: userId
            }
        };

        return new Promise((resolve, reject) => {
            jwt.sign(
                payload,
                process.env.JWT_SECRET as string,
                { expiresIn: '5h' },
                (err, token) => {
                    if (err) reject(err);
                    else resolve(token as string);
                }
            );
        });
    }
}
