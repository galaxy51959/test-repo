const Template = require('../models/Template');
const Student = require('../models/Student');
const reportGenerationService = require('../services/reportGenerationService');
const accessOutSideService = require('../services/accessOutSideService');
const MHSbotService = require('../services/MHSbot');
const extractSEIS = require('../services/extractSEISService');

// Generate report using OpenAI
const generateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body;
        // return res.json({ content: studentInfo });

		const { uploads } = await Student.findById(id);

		console.log(uploads);


        const generatedContent = await reportGenerationService.generateReport(
            type,
            uploads
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
        // const find = await Student.findOne({ _id: req.params.id });
        
        const student = await Student.findByIdAndUpdate(
              { _id: req.params.id },
              { $set: {
                report: generatedContent.fileName } 
              },
              { new: true, runValidators: true }
            );
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
    // getReports,
    // getReportById,
    getTemplate,
    // updateReport,
    // deleteReport,
    // accessReport,
};
