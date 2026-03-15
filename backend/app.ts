import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import logger from './utils/logger';
import errorHandler from './middleware/error';

// Import routes (we'll need to use .default if we use export default in TS)
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import socialRoutes from './routes/social';

const app = express();

// HTTP request logging
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

// Rate limiting
const generalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per windowMs
	message: 'Too many requests from this IP, please try again after 15 minutes'
});

const authLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	limit: 10, // Limit each IP to 10 login/register requests per hour
	message: 'Too many authentication attempts, please try again after an hour'
});

app.use(helmet());
app.use(compression());

// Disable rate limiting for tests
if (process.env.NODE_ENV !== 'test') {
    app.use(generalLimiter); // Apply to all requests
    app.use('/api/auth', authLimiter); // Stricter limit for auth routes
}

const allowedOrigins = [
	process.env.FRONTEND_URL as string,
	'https://quiet-bavarois-5e47f5.netlify.app',
	'http://localhost:5173', // Vite default dev port
	'http://localhost:3000'
];

app.use(cors({
	origin: function (origin, callback) {
		// Allow requests with no origin (like mobile apps, curl, or postman)
		if (!origin) return callback(null, true);

		if (allowedOrigins.indexOf(origin) === -1) {
			const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
			return callback(new Error(msg), false);
		}
		return callback(null, true);
	},
	credentials: true
}));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
	res.send('Inkwell blogging platform API is running successfully');
});

// Using routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', socialRoutes);

// Centralized error handling
app.use(errorHandler);

export default app;
