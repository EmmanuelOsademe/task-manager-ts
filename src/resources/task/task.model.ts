import mongoose, {Schema, model} from 'mongoose';
import Task from '@/resources/task/task.interface';

const TaskSchema = new Schema (
    {
        name: {
            type: String,
            required: [true, 'Please provide task name'],
            trim: true,
            unique: true,
            maxLength: [30, 'Task name cannot exceed 20 characters']
        },
        completed: {
            type: Boolean,
            default: false
        },
        userID: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {timestamps: true}
);

export default model<Task>('Task', TaskSchema);