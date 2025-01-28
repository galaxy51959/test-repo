const multer = require('multer');

const Report = require('../models/Report');
const Student = require('../models/Student');
const reportGenerationService = require('../services/reportGenerationService');
const accessOutSideService = require('../services/accessOutSideService');
const files = [];
const MHSbotService = require('../services/MHSbot');
const extractSEIS = require('../services/extractSEISService');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/tests');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });
// const upload = multer({ dest: 'public/tests' });

// Create new report
const createReport = async (req, res) => {
    try {
        const { studentId, type, testScores, summary } = req.body;
        const report = new Report({
            student: studentId,
            type,
            testScores,
            summary,
            author: req.user.id,
        });
        await report.save();
        res.status(201).json(report);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Generate report using OpenAI
const generateReport = async (req, res) => {
    try {
        console.log('Request Body: ', req.body);
        console.log('Request Files: ', req.file);

        if (req.file) {
            if (
                files.findIndex((f) => f.protocol === req.body?.protocol) === -1
            ) {
                files.push({
                    protocol: req.body?.protocol,
                    file: req.file.originalname,
                });
            }
            res.json({ files });
            return;
        }
        const studentId = req.params.id;

        const studentInfo = await Student.findById(studentId);
        if (!studentInfo) {
            return res.status(404).json({ message: 'Student not found' });
        }

        console.log('Files: ', files);

        // return res.json({ content: studentInfo });
        const generatedContent =
            await reportGenerationService.generateReport(studentInfo);

        // const templateType = "Psychoeducational";

        // Save or Update Report
        // const findReport = await Report.findOne({
        //   student: studentId,
        //   type: templateType
        // })

        // if (!findReport) {
        //   const report = new Report({
        //     student: studentId,
        //     type: templateType,
        //     testScores,
        //     summary,
        //     author: 'Alexis E. Carter',
        //     file: generatedContent.fileName,
        //   });

        //   await report.save();
        // } else {
        //   await Report.updateOne(
        //     { student: studentId, type: templateType },
        //     { $set: { testScores, summary, author: 'Alexis E. Carter', file: generatedContent.fileName }}
        //   );
        // }

        res.json({ ...generatedContent });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const extractInfo = async (req, res) => {
    try {
        const file = req.file;

        const result = await extractSEIS(file);
        res.json(JSON.parse(result));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all reports
const getReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('student');
        // .populate('author', 'name');
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get report by ID
const getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('student')
            .populate('author', 'name');
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update report
const updateReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        Object.assign(report, req.body);
        report.updatedAt = Date.now();
        await report.save();
        res.json(report);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete report
const deleteReport = async (req, res) => {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.json({ message: 'Report deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const accessReport = async (req, res) => {
    try {
        const total_Result = [];
        const { studentInfo, targetInfo } = req.body;
        console.log(req.body);
        const result_Gobal = await accessOutSideService(
            studentInfo,
            targetInfo
        );
        const result_Mhs = await MHSbotService(studentInfo, targetInfo);

        total_Result.push(result_Gobal);
        total_Result.push(result_Mhs);
        console.log(total_Result);

        res.json(total_Result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
    createReport,
    generateReport: [upload.single('file'), generateReport],
    extractInfo: [upload.single('file'), extractInfo],
    getReports,
    getReportById,
    updateReport,
    deleteReport,
    accessReport,
};
