const Student = require('../models/Student');

const createStudent = async (req, res) => {
    try {
        const {
            firstName,
            middleName,
            lastName,
            dateOfBirth,
            gender,
            grade,
            school,
            language,
            parent,
            teacher,
        } = req.body;

        const studentExists = await Student.findOne({
            firstName,
            lastName,
            grade,
            school,
        });
        if (studentExists) {
            return res
                .status(400)
                .json({ message: 'Student ID already exists' });
        }

        const student = new Student({
            firstName,
            middleName,
            lastName,
            dateOfBirth,
            gender,
            grade,
            school,
            language,
            parent,
            teacher,
        });

        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getStudents = async (req, res) => {
    try {
        const { search, grade, page = 1, limit = 10 } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { firstName: new RegExp(search, 'i') },
                { lastName: new RegExp(search, 'i') },
                { school: new RegExp(search, 'i') },
            ];
        }

        if (grade) {
            query.grade = grade;
        }

        const students = await Student.find(query)
            .sort({ lastName: 1, firstName: 1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Student.countDocuments(query);

        res.json({
            students,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate(
            'assessments'
        );

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const assignStudent = async (req, res) => {
  console.log(req.params, req.body);
  try {
    const student = await Student.findById(req.params.id)
      .populate('assessments');
      
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        Object.assign(student, req.body);
        student.updatedAt = Date.now();
        await student.save();

        res.json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        await student.remove();
        res.json({ message: 'Student deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  assignStudent,
};
