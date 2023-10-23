"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = require("nodemailer");
function sendMail(mailOptions) {
    const transporter = (0, nodemailer_1.createTransport)({
        service: 'gmail',
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });
    return transporter.sendMail(Object.assign(Object.assign({}, mailOptions), { from: `"Taskspace Team" <${process.env.MAIL_USER}>` }));
}
exports.sendMail = sendMail;
