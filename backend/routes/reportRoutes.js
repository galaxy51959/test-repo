const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
	createReport,
	generateReport,
	getReports,
	getReportById,
	updateReport,
	deleteReport
} = require('../controllers/reportController');

// router.use(auth); // Apply authentication to all routes

router.post('/', createReport);
router.post('/generate', generateReport);
router.get('/', getReports);
router.get('/:id', getReportById);
router.put('/:id', updateReport);
router.delete('/:id', deleteReport);

module.exports = router;