import nodemailer from 'nodemailer';
import config from '../config';

interface IMailOptions {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: config.mail_auth_user,
        pass: config.mail_auth_pass,
    },
});

export async function sendMail({
    from,
    to,
    subject,
    text,
    html,
}: IMailOptions) {
    const info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
    });

    return info;
}
