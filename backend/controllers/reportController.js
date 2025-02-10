const multer = require('multer');
const Template = require('../models/Template');
const reportGenerationService = require('../services/reportGenerationService');
const accessOutSideService = require('../services/accessOutSideService');
let files = {};
const MHSbotService = require('../services/MHSbot');
const extractSEIS = require('../services/extractSEISService');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/tests');
    },
    filename: (req, file, cb) => {
        console.log(file);
        files[req.body.type] = {
            mimetype: file.mimetype,
            name: `${req.body?.type && req.body.type + '---'}${file.originalname}`,
        };
        cb(
            null,
            `${req.body?.type && req.body.type + '---'}${file.originalname}`
        );
    },
});

const upload = multer({ storage: storage });

// Generate report using OpenAI
const generateReport = async (req, res) => {
    try {
        const { type } = req.body;
        // return res.json({ content: studentInfo });

        console.log(type);

        files = {
            SEIS: {
              mimetype: 'application/pdf',
              name: 'SEIS---SEIS Information Eligibility.pdf'
            },
            'Developmental and Health History': {
              mimetype: 'application/pdf',
              name: 'Developmental and Health History---I.M. Parent Interview summary.pdf'
            },
            'Home Background': {
              mimetype: 'application/pdf',
              name: 'Home Background---I.M. Parent Interview summary.pdf'
            },
            'Previous Evaluation History': {
              mimetype: 'application/pdf',
              name: 'Previous Evaluation History---I.M. Parent Interview summary.pdf'
            },
            'Hearing and Vision Result': {
              mimetype: 'application/pdf',
              name: 'Hearing and Vision Result---I.M. Parent Interview summary.pdf'
            },
            'Academic History': {
              mimetype: 'application/pdf',
              name: 'Academic History---I.M attendance Records.pdf'
            },
            'Interviews-Parent': {
              mimetype: 'application/pdf',
              name: 'Interviews-Parent---I.M. Parent Interview summary.pdf'
            },
            'Interviews-Teacher': {
              mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              name: 'Interviews-Teacher---I.M. Student Interview form.docx'
            },
            'Interviews-Student': {
              mimetype: 'application/pdf',
              name: 'Interviews-Student---I.M. Parent Interview summary.pdf'
            },
            Observations: {
              mimetype: 'application/pdf',
              name: 'Observations---I.M Lunch and Classroom Observation on 1-9-25.pdf'
            },
            'WISC-5': {
              mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              name: 'WISC-5---I.M WISC 5 Results.docx'
            },
            'TAPS-4': {
              mimetype: 'application/pdf',
              name: 'TAPS-4---Barrett_Simon_TAPS-4_2023_10_10.pdf'
            },
            'TVPS-4': {
              mimetype: 'application/pdf',
              name: 'TVPS-4---Barrett_Simon_TVPS-4_2023_10_05.pdf'
            },
            VMI: {
              mimetype: 'application/pdf',
              name: 'VMI---Berry VMi and VP Example.pdf'
            },
            'BG-2': {
              mimetype: 'application/pdf',
              name: 'BG-2---Berry VMi and VP Example.pdf'
            },
            'BASC-3-Parent': {
              mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              name: 'BASC-3-Parent---A. Ortega Parent BASC-3-Report-with-Intervention-Recommendations_56178024_1707772448853.docx'
            },
            'BASC-3-Teacher': {
              mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              name: 'BASC-3-Teacher---A, Ortega- Teacher BASC-3-Report-with-Intervention-Recommendations_56179846_1707772370282.docx'
            },
            'ASRS-3-Parent': {
              mimetype: 'application/pdf',
              name: 'ASRS-3-Parent---II.M Parent ASRS Results.pdf'
            },
            'ASRS-3-Teacher': {
              mimetype: 'application/pdf',
              name: 'ASRS-3-Teacher---I.M Teacher ASRS Results.pdf'
            },
            'WIAT-4': {
              mimetype: 'application/pdf',
              name: 'WIAT-4---I.M WIAT-4-Score-Report_65663998_1737953358612 (1) (1).pdf'
            }
        };

        const generatedContent = await reportGenerationService.generateReport(
            type,
            files
        );

        console.log(generatedContent);

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

        console.log('Generate Success!!!');

        res.json({ file: generatedContent.fileName });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const uploadFile = async (req, res) => {
    try {
        const file = req.file;
        const { type } = req.body;
        res.json({ file: files[type] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTemplate = async (req, res) => {
    try {
        // console.log('123');
        const template = await Template.findOne({ type: 'Initial' }).populate(
            'sections.prompts'
        );
        res.json(template);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all reports
// const getReports = async (req, res) => {
//     try {
//         const reports = await Template.find().populate('student');
//         // .populate('author', 'name');
//         res.json(reports);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// Get report by ID
// const getReportById = async (req, res) => {
//     try {
//         const report = await Template.findById(req.params.id)
//             .populate('student')
//             .populate('author', 'name');
//         if (!report) {
//             return res.status(404).json({ message: 'Report not found' });
//         }
//         res.json(report);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// Update Template
const updateTemplate = async (req, res) => {
    try {
        const template = await Template.aggregate([
            {
                $match: {
                    'sections.prompts._id': req.params.id,
                },
            },
            {
                $unwind: '$sections',
            },
            {
                $unwind: '$sections.prompts',
            },
            {
                $match: {
                    'sections.prompts._id': req.params.id,
                },
            },
        ]);

        console.log(template);

        if (!template) {
            return res.status(404).json({ message: 'Template Not Found' });
        }
        Object.assign(template, req.body);
        await template.save();
        res.status(200).json(template);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// // Update report
// const updateReport = async (req, res) => {
//     try {
//         const report = await Template.findById(req.params.id);
//         if (!report) {
//             return res.status(404).json({ message: 'Report not found' });
//         }

//         Object.assign(report, req.body);
//         report.updatedAt = Date.now();
//         await report.save();
//         res.json(report);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// // Delete report
// const deleteReport = async (req, res) => {
//     try {
//         const report = await Template.findByIdAndDelete(req.params.id);
//         if (!report) {
//             return res.status(404).json({ message: 'Report not found' });
//         }
//         res.json({ message: 'Report deleted' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// const accessReport = async (req, res) => {
//     try {
//         const total_Result = [];
//         const { studentInfo, targetInfo } = req.body;
//         console.log(req.body);
//         const result_Gobal = await accessOutSideService(
//             studentInfo,
//             targetInfo
//         );
//         const result_Mhs = await MHSbotService(studentInfo, targetInfo);

//         total_Result.push(result_Gobal);
//         total_Result.push(result_Mhs);
//         console.log(total_Result);

//         res.json(total_Result);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
module.exports = {
    // createReport,
    generateReport,
    uploadFile: [upload.single('file'), uploadFile],
    // getReports,
    // getReportById,
    getTemplate,
    // updateReport,
    // deleteReport,
    // accessReport,
};
