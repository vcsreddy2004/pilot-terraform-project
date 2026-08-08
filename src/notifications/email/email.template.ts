export const otpTemplate = (otp: string) => {
    return `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; text-align: center;">
            
            <h2 style="color: #333;">🔐 OTP Verification</h2>
            
            <p style="color: #555; font-size: 14px;">
                Use the following One-Time Password (OTP) to complete your verification.
            </p>
            
            <div style="margin: 20px 0;">
                <span style="
                    display: inline-block;
                    font-size: 28px;
                    letter-spacing: 6px;
                    font-weight: bold;
                    color: #2c3e50;
                    background: #ecf0f1;
                    padding: 10px 20px;
                    border-radius: 6px;
                ">
                    ${otp}
                </span>
            </div>

            <p style="color: #777; font-size: 13px;">
                This OTP will expire in <b>5 minutes</b>.
            </p>

            <p style="color: #999; font-size: 12px; margin-top: 20px;">
                If you did not request this, please ignore this email.
            </p>

        </div>
    </div>
    `;
};