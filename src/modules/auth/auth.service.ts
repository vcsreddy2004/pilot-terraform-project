import config from "../../config/config";
import * as emailService from "../../notifications/email/email.service";
import authRepository from "./auth.repository";
import { CreateUserDTO } from "./auth.validation";
import { UserResponseDTO,UpdatePaswordDTO,CreateOTPDTO,UserLoginDTO,CreateRefreshTokenDTO } from "./auth.dto";
import bcrypt from "bcryptjs";
import { AppError } from "../../utils/error.handler";
import jwt, { JwtPayload } from "jsonwebtoken";
export const createUser = async (data: CreateUserDTO) => {
    try {
        const { name, email, password } = data;
        const existingUser = await authRepository.findUserByEmail(email,["email","isVerified"]);
        if(existingUser) {
            if(existingUser.isVerified) {
                throw new AppError("Email already exist",400);
            }
            await sendVerificationOTP(email);
            return {
                message: "User already exists but not verified. OTP sent.",
                isVerified: false,
                data: null,
            };
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser:CreateUserDTO = {
            name,
            email,
            password: hashedPassword,
        };
        const createdUser = await authRepository.createUser(newUser);
        const userData = createdUser.get();
        const userResponse:UserResponseDTO = {
            name: userData.name,
            email: userData.email,
            role: userData.role,
            isVerified: userData.isVerified,
            createdAt: userData.createdAt as Date,
            updatedAt: userData.updatedAt as Date,
        }
        return {
            message: "User created successfully",
            isVerified: userData.isVerified,
            data: userResponse,
        }
    }
    catch(error) {
        if(error instanceof AppError) {
            throw error; 
        }
        throw new AppError("Internal Server Error", 500);
    }
};
export const markUserAsVerified = async (email:string) => {
    try {
        await authRepository.markUserAsVerified(email);
        return {
            message:"User marked verified",
            isVerified:true,
            data:null,
        }
    }
    catch(error) {
        if(error instanceof AppError) {
            throw error; 
        }
        throw new AppError("Internal Server Error", 500);
    }
}
export const sendVerificationOTP = async (email: string) => {
    try {
        const existingUser = await authRepository.findUserByEmail(email,["email","isVerified"]);
        if(existingUser) {
            if(existingUser.isVerified) {
                throw new AppError("User is already verified",400);
            }
            const lastOTP = await authRepository.findOTPByEmail(email,["createdAt"]);
            if (lastOTP && lastOTP.createdAt.getTime() > Date.now() - 60 * 1000) {
                throw new AppError("Please wait before requesting another OTP", 429);
            }
            await authRepository.deleteOTPByEmail(email);
            const OTP:string = String(Math.floor(100000 + Math.random() * 900000));
            const salt:string = await bcrypt.genSalt(10);
            const hashedOTP:string = await bcrypt.hash(OTP.toString(),salt);
            const expiresAt: Date = new Date(Date.now() + Number(config.OTP_EXPIRY_MINUTES) * 60 * 1000);
            let OTPData = {
                email:email,
                otp:hashedOTP,
                expiresAt:expiresAt,
                isUsed:false,
            }
            await authRepository.createOTP(OTPData);
            await emailService.sendVerificationOTP(OTPData.email,"Verify your Email",OTP);
            OTPData = {
                email:email,
                otp:"",
                expiresAt:expiresAt,
                isUsed:false
            }
            return OTPData;
        }
        else {
            throw new AppError("User not found",404)
        }
    }
    catch(error) {
        if(error instanceof AppError) {
            throw error; 
        }
        throw new AppError("Internal Server Error", 500);
    }
}
export const sendForgetPasswordOTP = async (email:string) => {
    try {
        const existingUser = await authRepository.findUserByEmail(email,["email","isVerified"]);
        if(existingUser) {
            const lastOTP = await authRepository.findOTPByEmail(email,["createdAt"]);
            if (lastOTP && lastOTP.createdAt.getTime() > Date.now() - 60 * 1000) {
                throw new AppError("Please wait before requesting another OTP", 429);
            }
            await authRepository.deleteOTPByEmail(email);
            const OTP:string = String(Math.floor(100000 + Math.random() * 900000));
            const salt:string = await bcrypt.genSalt(10);
            const hashedOTP:string = await bcrypt.hash(OTP.toString(),salt);
            const expiresAt: Date = new Date(Date.now() + Number(config.OTP_EXPIRY_MINUTES) * 60 * 1000);
            let OTPData = {
                email:email,
                otp:hashedOTP,
                expiresAt:expiresAt,
                isUsed:false,
            }
            await authRepository.createOTP(OTPData);
            await emailService.sendVerificationOTP(OTPData.email,"Password Reset OTP",OTP);
            OTPData = {
                email:email,
                otp:"",
                expiresAt:expiresAt,
                isUsed:false
            }
            return OTPData;
        }
        else {
            throw new AppError("User not found",404)
        }
    }
    catch(error) {
        if(error instanceof AppError) {
            throw error; 
        }
        throw new AppError("Internal Server Error", 500);
    }
}
export const updateForgotPassword = async (data:UpdatePaswordDTO) => {
    try {
        const {email,otp,password} = data;
        if(!email || !otp || !password) {
            throw new AppError("Email and OTP and Password required",400);
        }
        const existingUser = await authRepository.findUserByEmail(email,["email","isVerified"]);
        if(existingUser && existingUser.isVerified) {
            const OTPData = await authRepository.findOTPByEmail(email,["otp","expiresAt","isUsed"]);
            if(!OTPData || OTPData.isUsed) {
                throw new AppError("OTP not found, please regenerate", 404);
            }
            const isMatch = await bcrypt.compare(String(otp), OTPData.otp);
            if(!isMatch) {
                throw new AppError("OTP Verification failed", 400);
            }
            if(OTPData.expiresAt < new Date()) {
                throw new AppError("Your OTP expired", 400);
            }
            const salt:string = await bcrypt.genSalt(10);
            const hashedPassword:string = await bcrypt.hash(password,salt);
            const updatePassword:UpdatePaswordDTO ={
                email,
                otp:"",
                password:hashedPassword
            }
            await authRepository.updateUserPassword(updatePassword);
            await authRepository.markOTPAsUsed(email);
        }
        else {
            throw new AppError("User not registered",404);
        }
    }
    catch(error) {
        if(error instanceof AppError) {
            throw error;
        }
        throw new AppError("Internal sercer error",500);
    }
}
export const verifyOTP = async (data:CreateOTPDTO) => {
    try {
        const { email, otp } = data;
        if(!email || !otp) {
            throw new AppError("Email and OTP are required", 400);
        }
        const OTPData = await authRepository.findOTPByEmail(email,["otp","expiresAt","isUsed"]);
        if(!OTPData || OTPData?.isUsed) {
            throw new AppError("OTP not found, please regenerate", 404);
        }
        const isMatch = await bcrypt.compare(String(otp), OTPData.otp);
        if(!isMatch) {
            throw new AppError("OTP Verification failed", 400);
        }
        if(OTPData.expiresAt < new Date()) {
            throw new AppError("Your OTP expired", 400);
        }
        await authRepository.markOTPAsUsed(email);
        await authRepository.markUserAsVerified(email);
    }
    catch(error) {
        if(error instanceof AppError) {
            throw error; 
        }
        throw new AppError("Internal Server Error", 500);
    }
}
export const login = async (data:UserLoginDTO) =>{
    try {
        const {email,password} = data;
        if(!email || !password) {
            throw new AppError("Email and Password are required",400);
        }
        const userData = await authRepository.findUserByEmail(email,["email","role","password","tokenVersion","isVerified"]);
        if(!userData) {
            throw new AppError("User details not found",404);
        }
        if(!userData.isVerified) {
            throw new AppError("Your are not registered",404);
        }
        if(await bcrypt.compare(password,userData.password)) {
            const payload = {
                email:userData.email,
                role:userData.role,
                tokenVersion:userData.tokenVersion
            }
            const accessToken = await jwt.sign(payload, process.env.ACCESS_SECRET!, {expiresIn: "15m",});
            const refreshToken = await jwt.sign(payload, process.env.REFRESH_SECRET!, {expiresIn: "7d",});
            const refreshTokenData:CreateRefreshTokenDTO = {
                email,
                token:refreshToken,
                expiresAt:new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            }
            await authRepository.deleteRefreshToken(email);
            await authRepository.createRefreshToken(refreshTokenData);
            return {
                accessToken,
                refreshToken,
                user: {
                    email: userData.email,
                    role: userData.role,
                    tokenVersion: userData.tokenVersion
                }
            };
        }
        else {
            throw new AppError("Invalid Password",400);
        }
    }
    catch(error) {
        if(error instanceof AppError) {
            throw error; 
        }
        console.log(error);
        throw new AppError("Internal Server Error", 500);
    }
}
export const logout = async (token:string) => {
    try {
        const storedToken = await authRepository.findRefreshTokenByToken(token,["email","token"]);
        if(!storedToken) {
            throw new AppError("Invalid token", 401);
        }
        await authRepository.deleteRefreshToken(storedToken.email);
        await authRepository.updateTokenVersionByEmail(storedToken.email);
        return storedToken;
    }
    catch(error) {
        if(error instanceof AppError) {
            throw error; 
        }   
        console.log(error);
        throw new AppError("Internal Server Error", 500);
    }
};
export const generateAccessToken = async (refreshToken: string) => {
    try {
        const decoded = await jwt.verify(refreshToken,process.env.REFRESH_SECRET!) as JwtPayload;
        if (!decoded || !decoded.email || !decoded.role) {
            throw new AppError("Invalid refresh token", 401);
        }
        const storedToken = await authRepository.findRefreshTokenByToken(refreshToken,["email"]);
        if(!storedToken) {
            throw new AppError("Refresh token not found", 401);
        }
        const user = await authRepository.findUserByEmail(decoded.email,["email","role","tokenVersion"]);
        if (!user || user.tokenVersion !== decoded.tokenVersion) {
            throw new AppError("Invalid session", 401);
        }
        const newAccessToken = await jwt.sign({email: user.email,role: user.role,tokenVersion: user.tokenVersion},process.env.ACCESS_SECRET!,{ expiresIn: "15m" });
        return { accessToken: newAccessToken };
    } catch (error) {
        throw new AppError("Invalid or expired refresh token", 401);
    }
};