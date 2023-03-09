import TaskModel from '@/resources/task/task.model';
import Task from '@/resources/task/task.interface';

class TaskService {
    private task = TaskModel;

   /**
    * Create a new Task 
    * @param name : string
    * @param completed : boolean
    * @returns : return the created task or throws an error
    */

    public async createTask(name: string, completed: boolean, userID: string): Promise<Task> {
        try {
            const task = await this.task.create({name, completed, userID});
            return task;
        } catch (error: any) {
            console.log(error);
            if(error.code && error.code === 11000){
                const message = `Duplicate value entered for ${Object.keys(error.keyValue)} field. Please enter another name`;
                throw new Error(message);
            }
            throw new Error(error);
        }
    }

    /**
     * Attempt to get an existing task. User can only access his/her tasks
     * 
     * @param taskID: string
     * @param userID
     * 
     * @returns the task or throw an error
     */

    public async getTask(taskID: string, userID: string): Promise<Task> {
        try {
            const task = await this.task.findOne({_id: taskID, userID});
            
            if(!task){
                throw new Error(`Task not found`);
            }
            return task;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * Attempt to access all the tasks created by a user
     * @param userID 
     * @returns 
     */

    public async getAllTasks(userID: string): Promise<Task[]> {
        try {
            const tasks = await this.task.find({userID});
            if(!tasks){
                throw new Error(`No task has been created`);
            }
            return tasks;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * 
     * @param taskID : string
     * @param name : string
     * @param completed : boolean
     * @returns returns an updated task or throws an error
     */
    public async updateTask(taskID: string, userID: string, name?: string, completed?: boolean): Promise<Task> {
        try {
            const task = await this.task.findOne({_id: taskID, userID});
            if(!task){
                throw new Error('Task does not exist');
            }

            if(!name && !completed){
                throw new Error('Please provide updated values');
            }

            if(name){
                task.name = name;
            }

            if(completed){
                task.completed = completed;
            }

            await task.save();
            return task;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async deleteTask(taskID: string, userID: string): Promise<string> {
        try {
            const task = await this.task.findOne({_id: taskID, userID});
            if(!task){
                throw new Error('Task does not exist');
            }

            await task.remove();
            return 'Task deleted successfully';
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default TaskService;