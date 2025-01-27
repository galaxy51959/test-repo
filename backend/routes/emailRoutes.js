const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createReport,
    generateReport,
    getReports,
    getReportById,
    updateReport,
    deleteReport,
    accessReport,
    receiveEmail,
} = require('../controllers/emailController');
// router.use(auth); // Apply authentication to all routes

// router.post('/', createReport);
// router.post('/generate/:id', generateReport);
//router.post('/', getReports);
router.post('/socketEmail', receiveEmail);
// router.get('/:id', getReportById);
// router.put('/:id', updateReport);
// router.delete('/:id', deleteReport);
// router.post('/access-outside', accessReport);

module.exports = router;
