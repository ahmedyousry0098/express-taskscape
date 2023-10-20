import {createTransport} from 'nodemailer'

interface IMailInfo {
    to: string;
    subject: string;
    html: string
}

export function sendMail(mailOptions: IMailInfo) {
    const transporter = createTransport({
        service: 'gmail',
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    })

    return transporter.sendMail({
        ...mailOptions,
        from: `"Taskspace Team" <${process.env.MAIL_USER}>`,
    })
}