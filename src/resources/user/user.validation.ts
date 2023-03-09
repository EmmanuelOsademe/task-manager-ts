import Joi from 'joi';

const register = Joi.object(
    {
        name: Joi.string().max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    }
)

const login = Joi.object(
    {
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }
)

const updateUser = Joi.object(
    {
        name: Joi.string().max(30),
        email: Joi.string().email(),
        userID: Joi.string()
    }
)

const updatePassword = Joi.object(
    {
        currentPassword: Joi.string().min(8).required(),
        newPassword: Joi.string().min(8).required(),
        userID: Joi.string()
    }
)

export default {register, login, updateUser, updatePassword}