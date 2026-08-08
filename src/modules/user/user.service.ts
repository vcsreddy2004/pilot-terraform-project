import bcrypt from "bcryptjs";
import {AppError} from "./../../utils/error.handler";
import * as userRepository from "./user.repository";
class UserService {
    getAuthUserByEmail = async (email:string) =>{
        try {
            const userData = await userRepository.findUserByEmail(email,["id","email","role","tokenVersion"]);
            if(!userData) {
                throw new AppError("User not found",404);
            }
            return userData;
        }
        catch(error) {
            if(error instanceof AppError) {
                throw error; 
            }
            throw new AppError("Internal Server Error", 500);
        }
    }
    fetchUserData = async (email:string) => {
        try {
            const userData = userRepository.findUserByEmail(email,["name","email","role","isVerified"]);
            if(!userData) {
                throw new AppError("User not found",404);
            }
            return userData;
        }
        catch(error) {
            if(error instanceof AppError) {
                throw error; 
            }
            throw new AppError("Internal Server Error", 500);
        }
    }
}
export default new UserService();