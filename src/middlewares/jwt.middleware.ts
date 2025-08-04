import {NextFunction, Response} from "express";
import jwt from 'jsonwebtoken';
import {AuthRequest} from "../@types/authRequest.type";

export const JwtMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
        req.user = {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
        }
        next();
    } catch (error) {
        next();
    }
}

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        req.user = undefined;
        return next();
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
        req.user = {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
        }
        next();
    } catch (error) {
        req.user = undefined;
        return next();
    }
}