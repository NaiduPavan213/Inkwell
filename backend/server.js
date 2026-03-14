require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

const app = express();
const morgan = require('morgan');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/error');

// HTTP request logging
app.use(morgan('dev'));

// Rate limiting
const generalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per windowMs
	message: 'Too many requests from this IP, please try again after 15 minutes'
});

const authLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 10, // Limit each IP to 10 login/register requests per hour
	message: 'Too many authentication attempts, please try again after an hour'
});

app.use(helmet());
app.use(compression());
app.use(generalLimiter); // Apply to all requests
app.use('/api/auth', authLimiter); // Stricter limit for auth routes

const allowedOrigins = [
	process.env.FRONTEND_URL,
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

mongoose.connect(process.env.MONGO_URI)
	.then(() => logger.info('MongoDB is connected successfully'))
	.catch(err => logger.error('MongoDB connection error: ' + err));

app.get('/', (req, res) => {
	res.send('Inkwell blogging platform API is running successfully');
});

// Importing the auth routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api', require('./routes/social'));

// Centralized error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	logger.info(`server running successfully on ${PORT}`);
});