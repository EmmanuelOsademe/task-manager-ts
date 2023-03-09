import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import validateEnv from '@/utils/validateEnv';
import TaskController from "@/resources/task/task.controller";
import UserController from '@/resources/user/user.controller';

validateEnv();

const app = new App([new TaskController(), new UserController()], Number(process.env.port));

app.listen();