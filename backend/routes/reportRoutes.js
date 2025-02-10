const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    // createReport,
    generateReport,
    // getReports,
    // getReportById,
    getTemplate,
    // updateReport,
    // deleteReport,
    // accessReport,
} = require('../controllers/reportController');
// router.use(auth); // Apply authentication to all routes

// router.post('/', createReport);
router.post('/:id/generate', generateReport);
// router.get('/', getReports);
// router.get('/:id', getReportById);
router.get('/template', getTemplate);
// router.put('/:id', updateReport);
// router.delete('/:id', deleteReport);
// router.post('/access-outside', accessReport);

module.exports = router;
