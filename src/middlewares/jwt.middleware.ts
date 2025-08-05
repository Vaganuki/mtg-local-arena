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

export const checkProfileOwnership = (req: AuthRequest, res: Response, next: NextFunction) => {
    const targetUserId = +req.params.id;
    const currentUserId = +req.user?.id;

    if(!currentUserId) {
        return res.status(401).json({error: "Authentication required"});
    }

    if(currentUserId !== targetUserId) {
        return res.status(403).json({error: "You can only modify your own profile"});
    }

    next();
}