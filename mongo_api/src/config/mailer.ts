import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'orlando.bel.jimmy@gmail.com',
        pass: 'chszhhkpjhnuqnvh',
    }
});

transporter.verify().then(() => console.log("ready for send emails"));

export default transporter;