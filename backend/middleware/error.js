const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    // Log the error for the developer
    logger.error(err.stack);

    // Set status code (default to 500)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Server Error',
        // Only show stack trace in development mode
        stack: process.env.NODE_ENV === 'development' ? err.stack : null
    });
};

module.exports = errorHandler;
