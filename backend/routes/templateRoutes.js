const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getTemplateByType } = require('../controllers/templateController');

// router.use(auth); // Apply authentication to all routes

router.get('/:type', getTemplateByType);

module.exports = router;
