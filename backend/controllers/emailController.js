const Email = require('../models/Email');
const GmailService = require('../services/gmailService');

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

const getEmails = async (req, res) => {
    try {
        const { folder = 'inbox', page = 1, limit = 20 } = req.query;
        const emails = await Email.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        res.json(emails);
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
    sendEmail,
    getEmails,
    getEmailById,
    updateEmail,
    deleteEmail,
};
