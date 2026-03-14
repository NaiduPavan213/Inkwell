import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
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

export default errorHandler;
