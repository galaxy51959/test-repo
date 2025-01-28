const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getEmailbyAccount,
    // receiveEmail,
    receiveEmailBySocket,
    sendEmail,
    getEmails,
} = require('../controllers/emailController');
// router.use(auth); // Apply authentication to all routes

router.post('/socketEmail', receiveEmailBySocket);
router.post('/sendEmail', sendEmail);
router.get('/:account/:folder', getEmailbyAccount);
router.get('/', getEmails);

module.exports = router;
