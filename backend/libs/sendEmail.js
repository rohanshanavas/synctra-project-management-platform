import FormData from "form-data";
import Mailgun from "mailgun.js";
import dotenv from "dotenv";

dotenv.config();

const mailgun = new Mailgun(FormData);

const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
});

const fromEmail = process.env.MAILGUN_FROM_EMAIL;

export const sendEmail = async (to, subject, html) => {
    try {
        const data = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: fromEmail,
            to,
            subject,
            html,
        });

        console.log(data);
        return true;
    }

    catch (error) {
        console.error("Error sending email: ", error);
        return false;
    }
}
