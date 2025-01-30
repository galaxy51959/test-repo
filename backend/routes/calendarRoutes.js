const express = require('express');
const router = express.Router();
const {
    getEvents,
    createEvents,
    updateEvents,
    deleteEvents,
} = require('../controllers/calendarController');

router.get('/', getEvents);
router.get('/:pageid', deleteEvents);
router.post('/', createEvents);
router.put('/:pageid', updateEvents);
module.exports = router;
