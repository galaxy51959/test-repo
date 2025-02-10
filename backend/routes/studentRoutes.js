const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    assignStudent,
    uploadwithFile
} = require('../controllers/studentController');

// router.use(auth); // Apply authentication to all routes

router.post('/', createStudent);
router.get('/', getStudents);
router.get('/:id', getStudentById);
router.patch('/:id', updateStudent);
router.delete('/:id', deleteStudent);
router.post('/:id/assign', assignStudent);
router.post('/:id/upload', uploadwithFile);
module.exports = router;
