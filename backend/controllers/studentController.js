const Student = require('../models/Student');

const createStudent = async (req, res) => {
    try {
        const studentExists = await Student.findOne(req.body);
        if (studentExists) {
            return res
                .status(400)
                .json({ message: 'Student ID already exists' });
        }

        const student = new Student(req.body);

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

        console.log(students);

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

const updateStudent = async (req, res) => {
    try {
        const updates = req.body;

        const find = await Student.findOne({ _id: req.params.id });

        console.log(find);

        const student = await Student.findByIdAndUpdate(
            { _id: req.params.id },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ message: 'Student Not Found' });
        }

        res.json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteStudent = async (req, res) => {
    try {
        console.log('Delete Student Id: ', req.params.id);
        const student = await Student.findById(req.params.id);
        console.log(student);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        await Student.deleteOne({ _id: req.params.id });
        res.json({ message: 'Student deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const assignStudent = async (req, res) => {
    console.log(req.params, req.body);
    try {
        const student = await Student.findById(req.params.id).populate(
            'assessments'
        );
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const assessments = req.body;
        const updated = [];

        Object.keys(assessments).map((key) => {
            assessments[key].forEach((assessment) => {
                updated.push({
                    protocol: assessment.protocol,
                    file: assessment.link,
                    rater: key,
                });
            });
        });
        console.log(updated);
        const result = await Student.updateOne(
            { _id: student._id },
            {
                $set: {
                    assessments: updated,
                },
            }
        );
        res.json(result);
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
