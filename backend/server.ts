import app from './app';
import mongoose from 'mongoose';
import logger from './utils/logger';

const MONGO_URI = process.env.MONGO_URI as string;

mongoose.connect(MONGO_URI)
	.then(() => logger.info('MongoDB is connected successfully'))
	.catch(err => logger.error('MongoDB connection error: ' + err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	logger.info(`server running successfully on ${PORT}`);
});
