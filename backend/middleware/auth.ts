import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    user: {
        id: string;
    };
}

// Extend Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
            };
        }
    }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // get the token from the request header
    const token = req.header('x-auth-token');
    
    // check if the token is not present
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied.' });
    }

    // if token exists verify it
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        // Add the user payload from the token to the request object
        req.user = decoded.user;
        next();
    } catch (err) {
        return res.status(401).json({ msg: 'token is not valid.' });
    }
};

export default authMiddleware;
