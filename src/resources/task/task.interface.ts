import {Document} from 'mongoose';

export default interface Task extends Document {
    name: string,
    completed: boolean,
    user: string
}