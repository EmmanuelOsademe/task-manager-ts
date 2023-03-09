import UserModel from "@/resources/user/user.model";
import token from "@/utils/token";
import User from "@/resources/user/user.interface";
import returnedUser from '@/utils/interfaces/user/user.response';

class UserService {
    private user = UserModel;

    /**
     * Create a new user
     * 
     * @param name 
     * @param email 
     * @param password 
     * @param role 
     * @returns accessToken
     */

    public async register (
        name: string, 
        email: string,
        password: string,
        role: string
    ): Promise<returnedUser | Error> {
        try {
            const user = await this.user.create({name, email, password, role});
            const authToken = token.createToken(user);
            return  {userToken: authToken, userID: user._id};
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * Attempt to login a user
     */

    public async login(email: string, password: string): Promise<returnedUser | Error>{
        try {
            const user = await this.user.findOne({email});

            if(!user){
                throw new Error(`No user with email: ${email}`);
            }

            const isPasswordCorrect = await user.isValidPassword(password);
            if(isPasswordCorrect){
                const authToken = token.createToken(user);
                return  {userToken: authToken, userID: user._id};
            }else{
                throw new Error(`Wrong credentials provided`);
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async getUser(userID: string): Promise<User>{
        try {
            const user = await this.user.findOne({_id: userID})
                .select('-password')
                .exec();
            if(!user){
                throw new Error('User not found');
            }
            return user;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async updateUser(userID: string, name?: string, email?: string): Promise<User>{
        try {
            const user = await this.user.findOne({_id: userID})
                .select('-password')
                .exec();

            if(!user){
                throw new Error('User not found');
            }

            if(!name && !email){
                throw new Error('Missing update field(s)')
            }

            if(name) user.name = name;

            if(email) user.email = email;

            await user.save();
            return user;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async updatePassword(userID: string, currentPassword: string, newPassword: string): Promise<string> {

        try {
            if(!(currentPassword || newPassword)){
                throw new Error('Please provide current password and new password');
            }
    
            const user = await this.user.findOne({_id: userID});
            if(!user){
                throw new Error('User not found');
            }
    
            const isPasswordCorrect = await user.isValidPassword(currentPassword);
            if(!isPasswordCorrect){
                throw new Error('Password is incorrect');
            }
    
            user.password = newPassword;
            user.save();
            return 'Password has been updated';
        } catch (error: any) {
            console.log(error.message);
            throw new Error(error.message);
        }
    }


    public async deleteUser(userID: string): Promise<string> {
        try {
            const user = await this.user.findOne({_id: userID});

            if(!user){
                throw new Error('User not found');
            }

            await user.remove();
            return 'User deleted';
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default UserService;