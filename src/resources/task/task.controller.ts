import {Router, Request, Response, NextFunction} from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/HttpException';
import TaskService from '@/resources/task/task.service';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/task/task.validation';
import authenticated from '@/middleware/authenticated.middleware';

class TaskController implements Controller {
    public path = '/task';
    public router = Router();
    private TaskService = new TaskService();

    constructor(){
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}`,
            authenticated,
            validationMiddleware(validate.createTask),
            this.createTask
        );

        this.router.get(
            `${this.path}/:id`,
            authenticated,
            this.getTask
        );

        this.router.get(
            `${this.path}`,
            authenticated,
            this.getAllTasks
        )

        this.router.put(
            `${this.path}/:id`,
            authenticated,
            validationMiddleware(validate.updateTask),
            this.updateTask
        )

        this.router.delete(
            `${this.path}/:id`,
            authenticated,
            this.deleteTask
        )
    }

    private createTask = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {name, completed, user} = req.body;
            const userID = user._id;

            const task = await this.TaskService.createTask(name, completed, userID);
            res.status(201).json({task});
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }

    private getTask = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {id: taskID} = req.params;
            const userID = req.body.user._id;
            
            const task = await this.TaskService.getTask(taskID, userID);
            res.status(200).json({task});
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }

    private getAllTasks = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const userID = req.body.user._id;
            const tasks = await this.TaskService.getAllTasks(userID);
            res.status(200).json({tasks});
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }

    private updateTask = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {name, completed, user} = req.body;
            const {id: taskID} = req.params;

            const task = await this.TaskService.updateTask(taskID, user._id, name, completed);
            res.status(200).json({task});
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }

    private deleteTask = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {id: taskID} = req.params;
            const userID = req.body.user._id;
            const responseMessage = await this.TaskService.deleteTask(taskID, userID);
            res.status(200).json({message: responseMessage});
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }

}

export default TaskController;