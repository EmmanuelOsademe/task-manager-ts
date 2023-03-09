import {Request} from 'express';
import User from '@/resources/user/user.interface';

export default interface RequestUser extends Request {
    user?: User
}