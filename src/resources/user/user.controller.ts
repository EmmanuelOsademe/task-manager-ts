import {Router, Request, Response, NextFunction} from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import UserService from '@/resources/user/user.service';
import validationMiddleware from '@/middleware/validation.middleware';
import authenticated from '@/middleware/authenticated.middleware';
import validate from '@/resources/user/user.validation';
import HttpException from '@/utils/exceptions/HttpException';

class UserController implements Controller {
    public path = '/user';
    public router = Router();
    private UserService = new UserService();

    constructor(){
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void{
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(validate.register),
            this.register
        );

        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            this.login
        ),

        this.router.get(
            `${this.path}/:id`,
            authenticated,
            this.getUser
        )

        this.router.put(
            `${this.path}/updateUser/:id`,
            validationMiddleware(validate.updateUser),
            this.updateUser
        )

        this.router.put(
            `${this.path}/updatePassword/:id`,
            validationMiddleware(validate.updatePassword),
            this.updatePassword
        )

        this.router.delete(
            `${this.path}/:id`,
            this.deleteUser
        )
    }

    private register = async (
        req: Request, 
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {name, email, password} = req.body;

            const token = await this.UserService.register(name, 
                email, 
                password, 
                'user'
            );

            res.status(201).json(token);
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {email, password} = req.body;

            const token = await this.UserService.login(email, password);
            res.status(200).json(token);
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }

    private getUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {id: userID} = req.params;

            const user = await this.UserService.getUser(userID);
            res.status(200).json({user: user});
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }

    private updateUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {name, email} = req.body;
            const {id: userID} = req.params;

            const user = await this.UserService.updateUser(userID, name, email);
            res.status(200).json({user});
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }

    private updatePassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> =>{
        try {
            const {currentPassword, newPassword} = req.body;
            const {id: userID} = req.params;
            const user = await this.UserService.updatePassword(userID, currentPassword, newPassword);
            res.status(200).json(user);
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }

    private deleteUser = async (
        req: Request, 
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {id: userID} = req.params;
            const responseMessage = await this.UserService.deleteUser(userID);
            res.status(200).json({message: responseMessage});
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }
}

export default UserController;