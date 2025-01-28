const Email = require('../models/Email');
// const GmailService = require('../services/gmailService');
const socket = require('../socket');
const multer = require('multer');

let fileContent = {};
const sendEmail = async (req, res) => {
    try {
        const { to, subject, body, attachments, scheduledFor } = req.body;

        const email = new Email({
            to,
            subject,
            body,
            from: req.user.email,
            attachments,
            scheduledFor,
            status: scheduledFor ? 'scheduled' : 'sent',
        });

        if (!scheduledFor) {
            await GmailService.sendEmail({
                to,
                subject,
                body,
                attachments,
            });
        }

        await email.save();
        res.status(201).json(email);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/reports');
    },
    filename: (req, file, cb) => {
        fileContent.path = `${Date.now()}-${file.originalname}`;
        fileContent.name = file.originalname;
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage: storage });

const receiveEmail = async (req, res) => {
    try {
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const receiveEmailBySocket = async (req, res) => {
    try {
        const { subject, body, to, from } = req.body;
        // console.log(req.body);
        //console.log("backend", req.body);
        const email = new Email({
            subject: subject,
            body: body,
            to: to,
            from: from,
            attachments: {
                filename: fileContent.path,
                path: fileContent.name,
            },
        });
        console.log(email);
        await email.save();
        socket.io.emit('Message', req.body);
    } catch (error) {}
};

const getEmailbyAccount = async (req, res) => {
    try {
        const account = req.params.account;
        console.log('account', account);
        console.log(account);
        const emails = await Email.aggregate([
            {
                $match: { to: account },
            },
        ]);

        console.log(emails);
        res.json(emails);
        // const emails = await Email.find()
        //     .sort({ createdAt: -1 })
        //     .skip((page - 1) * limit)
        //     .limit(limit);
        // res.json(emails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEmailById = async (req, res) => {
    try {
        const email = await Email.findById(req.params.id);
        if (!email) {
            return res.status(404).json({ message: 'Email not found' });
        }
        res.json(email);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateEmail = async (req, res) => {
    try {
        const email = await Email.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!email) {
            return res.status(404).json({ message: 'Email not found' });
        }
        res.json(email);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteEmail = async (req, res) => {
    try {
        const email = await Email.findByIdAndDelete(req.params.id);
        if (!email) {
            return res.status(404).json({ message: 'Email not found' });
        }
        res.json({ message: 'Email deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    receiveEmailBySocket: [upload.single('attachment'), receiveEmailBySocket],
    receiveEmail,
    sendEmail,
    getEmailbyAccount,
    getEmailById,
    updateEmail,
    deleteEmail,
};
