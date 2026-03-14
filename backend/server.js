const app = require('./app');
const mongoose = require('mongoose');
const logger = require('./utils/logger');

mongoose.connect(process.env.MONGO_URI)
	.then(() => logger.info('MongoDB is connected successfully'))
	.catch(err => logger.error('MongoDB connection error: ' + err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	logger.info(`server running successfully on ${PORT}`);
});