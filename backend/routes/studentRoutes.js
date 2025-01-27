const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    assignStudent
} = require('../controllers/studentController');

// router.use(auth); // Apply authentication to all routes

router.post('/', createStudent);
router.get('/', getStudents);
router.get('/:id', getStudentById);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);
router.post('/:id/assign', assignStudent);

module.exports = router;