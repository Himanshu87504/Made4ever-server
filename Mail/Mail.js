import { createTransport } from "nodemailer";

export const sendMail = async (email, subject, otp) => {
    try {
        console.log("Sending mail...");

        const transport = createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL,
                pass: process.env.PASSWORD,
            },
            tls: { rejectUnauthorized: false } // optional for debugging
        });

        const mailOptions = {
            from: `"Made4ever" <${process.env.GMAIL}>`,
            to: email,
            subject: subject || "Your OTP Code",
            html: `
            <div style="font-family: sans-serif; text-align: center; padding: 20px;">
                <h2 style="color: #e11d48;">Your OTP Code</h2>
                <p style="font-size: 18px; margin: 20px 0;"><strong>${otp}</strong></p>
                <p>This OTP is valid for 5 minutes. Do not share it with anyone.</p>
                <hr style="margin-top: 30px;"/>
                <p style="font-size: 12px; color: gray;">Made4ever</p>
            </div>
            `,
        };

        const info = await transport.sendMail(mailOptions);
        console.log("Email sent: ", info.messageId);

        return info;
    } catch (err) {
        console.error("Error sending email: ", err);
        throw new Error("Failed to send email");
    }
};