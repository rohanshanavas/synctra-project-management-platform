import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    },
});

const fromEmail = process.env.SMTP_USER;

export const sendEmail = async (to, subject, html) => {
    try {
        const data = await transporter.sendMail({
            from: fromEmail,
            to,
            subject,
            html,
        });

        console.log("Email sent:", data);
        return true;
    } 
    catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};