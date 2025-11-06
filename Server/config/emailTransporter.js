import nodemailer from 'nodemailer';
import 'dotenv/config'; // Load environment variables

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER, // From .env file
        pass: process.env.SMTP_PASS, // From .env file
    },
});

export default transporter;