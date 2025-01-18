const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent
} = require('../controllers/studentController');

// router.use(auth); // Apply authentication to all routes

// router.post('/', createReport);
// router.post('/generate', generateReport);
// router.get('/', getReports);
// router.get('/:id', getReportById);
// router.put('/:id', updateReport);
// router.delete('/:id', deleteReport);
router.post('/', createStudent);
router.get('/', getStudents);
router.get('/:id', getStudentById);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;