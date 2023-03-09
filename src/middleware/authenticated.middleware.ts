import {Response, NextFunction} from 'express';
import RequestUser from '@/utils/interfaces/user/userRequest.interface';
import jwt from 'jsonwebtoken';
import { verifyToken } from '@/utils/token';
import UserModel from '@/resources/user/user.model';
import Token from '@/utils/interfaces/token.interface';
import HttpException from '@/utils/exceptions/HttpException';
import { StatusCodes } from 'http-status-codes';

async function authenticatedMiddleware(
    req: RequestUser,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const bearer = req.headers.authorization;

    if(!bearer || !bearer.startsWith('Bearer ')){
        return next(new HttpException(StatusCodes.UNAUTHORIZED, 'Unauthorized'));
    }

    const accessToken = bearer.split('Bearer ')[1].trim();

    try {
        const payload: Token | jwt.JsonWebTokenError = await verifyToken(accessToken)
        if(payload instanceof jwt.JsonWebTokenError){
            return next(new HttpException(StatusCodes.UNAUTHORIZED, 'Unauthorized'));
        }

        const user = await UserModel.findById(payload.id)
            .select('-password')
            .exec();

        if(!user){
            return next (new HttpException(StatusCodes.NOT_FOUND, 'User not found'));
        }

        req.user = user;
        req.body.user = user;
        return next()
    } catch (error: any) {
        return next(new HttpException(401, error.message));
    }
}

export default authenticatedMiddleware;