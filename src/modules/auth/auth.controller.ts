import * as authService from "./auth.service";
import { Request,Response,NextFunction } from "express";
import { emailSchema,getOTPDataSchema,createUserSchema, loginSchema,
    updatePasswordSchema, EmailDTO, UpdatePasswordDTO, GetOTPDataDTO, 
    CreateUserDTO, LoginDTO } from "./auth.validation";
import { AppError } from "../../utils/error.handler";
import { ZodError } from "zod";
export const sendVerificationOTP = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const validatedData:EmailDTO = emailSchema.parse(req.body);
        const OTPData = await authService.sendVerificationOTP(validatedData.email);
        return res.status(200).json({
            message: "OTP sent successfully"
        });
    }   
    catch (error) {
        if(error instanceof ZodError) {
            const formattedErrors = error.issues.map(err => ({
                field: err.path.join("."),
                message: err.message
            }));

            return res.status(400).json({
                errors: formattedErrors
            });
        }
        next(error);
    }
}
export const sendForgetPasswordOTP = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const validatedData:EmailDTO = emailSchema.parse(req.body);
        const OTPData = await authService.sendForgetPasswordOTP(validatedData.email);
        return res.status(200).json({
            message: "OTP sent successfully"
        });
    }   
    catch (error) {
        if(error instanceof ZodError) {
            const formattedErrors = error.issues.map(err => ({
                field: err.path.join("."),
                message: err.message
            }));

            return res.status(400).json({
                errors: formattedErrors
            });
        }
        next(error);
    }
}
export const updateForgotPassword = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const validateData:UpdatePasswordDTO = updatePasswordSchema.parse(req.body);
        await authService.updateForgotPassword(validateData);
        return res.status(200).json({message:"Password update success"});
    }
    catch (error) {
        if(error instanceof ZodError) {
            const formattedErrors = error.issues.map(err => ({
                field: err.path.join("."),
                message: err.message
            }));

            return res.status(400).json({
                errors: formattedErrors
            });
        }
        next(error);
    }
}
export const verifyOTP = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const validatedData:GetOTPDataDTO = getOTPDataSchema.parse(req.body);
        await authService.verifyOTP(validatedData);
        return res.status(200).json({
            message: "OTP Verified Successfully"
        });
    }   
    catch (error) {
        if(error instanceof ZodError) {
            const formattedErrors = error.issues.map(err => ({
                field: err.path.join("."),
                message: err.message
            }));

            return res.status(400).json({
                errors: formattedErrors
            });
        }
        next(error);
    }
}
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try { 
        const validatedData:CreateUserDTO = createUserSchema.parse(req.body);
        const result = await authService.createUser(validatedData);
        return res.status(result.isVerified ? 201 : 200).json(result);
    } 
    catch (error) {
        if(error instanceof ZodError) {
            const formattedErrors = error.issues.map(err => ({
                field: err.path.join("."),
                message: err.message
            }));

            return res.status(400).json({
                errors: formattedErrors
            });
        }
        next(error);
    }
};
export const login = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const validatedData:LoginDTO = loginSchema.parse(req.body);
        const result = await authService.login(validatedData);
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: true,       
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });
        return res.status(200).json({
            success: true,
            accessToken: result.accessToken,    
            user: result.user
        });
    }
    catch (error) {
        if(error instanceof ZodError) {
            const formattedErrors = error.issues.map(err => ({
                field: err.path.join("."),
                message: err.message
            }));

            return res.status(400).json({
                errors: formattedErrors
            });
        }
        next(error);
    }
}
export const logout = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            throw new AppError("No refresh token found", 400);
        }
        await authService.logout(refreshToken);
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        if(error instanceof ZodError) {
            const formattedErrors = error.issues.map(err => ({
                field: err.path.join("."),
                message: err.message
            }));

            return res.status(400).json({
                errors: formattedErrors
            });
        }
        next(error);
    }
}
export const refreshAccessToken = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            throw new AppError("Refresh token missing", 401);
        }
        const result = await authService.generateAccessToken(refreshToken);
        res.json(result);
    }
    catch (error) {
        if(error instanceof ZodError) {
            const formattedErrors = error.issues.map(err => ({
                field: err.path.join("."),
                message: err.message
            }));

            return res.status(400).json({
                errors: formattedErrors
            });
        }
        next(error);
    }
};
