const express = require('express');
const router = express.Router();
const { getEvents } = require('../controllers/calendarController');

router.get('/', getEvents);

module.exports = router;
