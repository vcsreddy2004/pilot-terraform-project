import { AppError } from "../../utils/error.handler";
import { Request, Response, NextFunction } from "express";
import userService from "./user.service";
export const fetchUserData = async (req:Request,res:Response,next:NextFunction) => {
    try {
        if(!req.user) {
            throw new AppError("Unauthorized", 401);
        }
        const {email} = req.user;
        const userData = await userService.fetchUserData(email);
        return res.status(200).json(userData);
    }
    catch(error) {
        next(error);
    }
}