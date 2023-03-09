import Joi from 'joi';

const createTask = Joi.object({
    name: Joi.string().required(),
    completed: Joi.boolean(),
    userID: Joi.string()
});

const updateTask = Joi.object({
    name: Joi.string(),
    completed: Joi.boolean(),
    taskID: Joi.string(),
    userID: Joi.string()
})

export default {createTask, updateTask};