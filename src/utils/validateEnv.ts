import {cleanEnv, str, port} from 'envalid';

export default function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'production']
        }),
        PORT: port({default: 5000}),
        MONGO_URI: str(),
        JWT_SECRET: str(),
    })
}