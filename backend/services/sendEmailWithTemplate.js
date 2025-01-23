const nodemailer = require('nodemailer');
// const fs = require('fs');
console.log(process.env.EMAIL_USER);
const  sendEmailWithDoc = async (targetInfo) => {
    const title = targetInfo.sendTo == "parent" ? "Hello Parents" : "Hello Teachers";
    const targetEmail = targetInfo.email;
    console.log(title, targetEmail);
    let transporter = nodemailer.createTransport({
        // service: 'gmail',
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false
        }
    });

    // Define email options
    let mailOptions = {
        from: process.env.EMAIL_USER, // sender address
        to: targetEmail, // list of receivers
        subject: 'Test Email with PDF Attachment', // Subject line
        html: ` <h>${title}</h>`, // HTML body content
        // attachments: [
        //     {
        //         filename: 'attachment.doc',
        //         path: './public/Parent Interview Form.docx', // Path to your Docx file
        //     },
        // ],
    };

    try {
        // Send email
        let info = await transporter.sendMail(mailOptions);
        console.log("send");
        console.log('Email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
module.exports  = sendEmailWithDoc;
