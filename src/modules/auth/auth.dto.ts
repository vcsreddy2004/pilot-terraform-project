export interface UserResponseDTO {
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateRefreshTokenDTO {
    email:string,
    token:string,
    expiresAt:Date,
}
export interface AuthResponseDTO {
    accessToken: string;
    refreshToken: string;
    user: {
        email: string;
        role: string;
        tokenVersion: number;
    };
}
export interface OTPResponseDTO {
    email: string;
    expiresAt: Date;
    isUsed: boolean;
    otp:string;
}
export interface UpdatePaswordDTO {
    email:string,
    otp:string,
    password:string
}
export interface CreateOTPDTO {
    email:string,
    otp:string
}
export interface UserLoginDTO {
    email:string,
    password:string
}