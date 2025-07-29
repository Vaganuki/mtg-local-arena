import {NextFunction, Request, Response} from "express";
import jwt from 'jsonwebtoken';

export const JwtMiddleware = (req: Request & { user: any }, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    try {
        req.user = jwt.verify(token!, process.env.JWT_SECRET!);
        next();
    }
    catch(error) {
        next();
    }
}