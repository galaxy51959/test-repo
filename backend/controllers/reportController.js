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
        const { type, eligibility, recommendations } = req.body;

        const { uploads } = await Student.findById(id);
        console.log(eligibility);
        const generatedContent = await reportGenerationService.generateReport(
            { type, eligibility, recommendations },
            uploads
        );

        console.log(generatedContent);

        console.log('Generate Success!!!');

        await Student.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    report: generatedContent.fileName,
                },
            },
            { new: true, runValidators: true }
        );
        res.json({ file: generatedContent.fileName });
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
