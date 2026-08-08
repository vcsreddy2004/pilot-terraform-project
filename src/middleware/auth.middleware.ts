import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error.handler";
import userService from "../modules/user/user.service";
export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("Unauthorized", 401);
        }
        const token = authHeader.split(" ")[1];
        const decoded = await jwt.verify(token, process.env.ACCESS_SECRET!);
        if(typeof decoded === "string") {
            throw new AppError("Invalid or expired token",401);
        }
        else if(decoded && decoded.email && decoded.role) {
            const userData = await userService.getAuthUserByEmail(decoded.email);
            if(!userData) {
                throw new AppError("Invalid or expired token",401);
            }
            else if(userData.tokenVersion!=decoded.tokenVersion) {
                throw new AppError("Invalid or expired token",401);
            }
            else {
                req.user = {
                    id:userData.id,
                    email:decoded.email,
                    role:userData.role
                };
                next();
            }
        }
        else {
            next(new AppError("Invalid or expired token",401));
        }
    } 
    catch (error) {
        if(error instanceof AppError) {
            throw error; 
        }
        next(new AppError("Invalid or expired token 5", 401));
    }
};