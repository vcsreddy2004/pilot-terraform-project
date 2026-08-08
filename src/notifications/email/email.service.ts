import nodemailer from "nodemailer";
import config from "../../config/config";
import { otpTemplate } from "./email.template";
import { AppError } from "../../utils/error.handler";
const transporter = nodemailer.createTransport({
    service: config.MAIL_SERVICE,
    auth: {
        user: config.MAIL_USER,
        pass: config.MAIL_PASSWORD,
    }
});

export const sendVerificationOTP = async (to: string, subject: string,otp:string) => {
    try {
        const html = otpTemplate(otp);
        await transporter.sendMail({
            from: config.MAIL_USER,
            to,
            subject,
            html
        });
    }
    catch(error) {
        if(error instanceof AppError) {
            throw error; 
        }
        throw new AppError("Email Server Error", 500);
    }
};
