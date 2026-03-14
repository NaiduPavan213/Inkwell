import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

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
            throw new Error('Invalid credentials.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials.');
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
