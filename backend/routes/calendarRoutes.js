const express = require('express');
const router = express.Router();
const {
    getEvents,
    createEvents,
} = require('../controllers/calendarController');

router.get('/', getEvents);
router.post('/', createEvents);

module.exports = router;
