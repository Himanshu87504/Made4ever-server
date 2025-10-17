import { createTransport } from "nodemailer";

// Send OTP email
export const sendMail = async (email, subject, otp) => {
    try {
        console.log("Sending mail...");

        // Create transporter
        const transport = createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // use SSL
            auth: {
                user: process.env.GMAIL,    // your Gmail address
                pass: process.env.PASSWORD, // app password (not your normal Gmail password)
            },
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

        // Send email
        const info = await transport.sendMail(mailOptions);
        console.log("Email sent: ", info.messageId);

        return info;
    } catch (err) {
        console.error("Error sending email: ", err);
        throw new Error("Failed to send email");
    }
};
