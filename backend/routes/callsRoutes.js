const express = require('express');
const router = express.Router();
const {
    sendSMS,
    makeCALL,
} = require('../controllers/callsController');

router.post('/SendSMS', sendSMS);
router.post('/MakeCALL', makeCALL);

module.exports = router;
