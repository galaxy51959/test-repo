const { ChatOpenAI } = require('@langchain/openai');
const {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
} = require('@langchain/core/prompts');
const fs = require('fs');
const ReportSection = require('../models/Prompt');
const { generateAndSavePDF } = require('./pdfGenerationService');
const { calculateAge, getFullName, parsePdf, parseDocx } = require('../utils');

const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-4o-mini',
    temperature: 0.5,
});

const generateReportSection = async (section, studentInfo, files) => {
    try {
        // const prompt = constructSectionPrompt(section, studentInfo);

        // console.log('Prompt: ', prompt);

        // if (prompt.includes("file: [NOT PROVIDED]")) {
        //     console.log("FILE");
        //     return "File Not Provided";
        // }

        const chatPrompt = ChatPromptTemplate.fromMessages([
            SystemMessagePromptTemplate.fromTemplate(section.systemPrompt),
            HumanMessagePromptTemplate.fromTemplate(section.humanPrompt),
        ]);
        // You are a professional report writer specialized in eucational psychological reports

        const chain = chatPrompt.pipe(model);

        const res = await chain.invoke({
            input: studentInfo,
        });

        console.log(section.order, res.content);

        return {
            order: section.order,
            content: res.content,
        };
    } catch (error) {
        console.error('Error generating report section:', error);
        throw error;
    }
};

const constructSectionPrompt = (section, data) => {
    let prompt = section.prompt;

    for (const field of section.requiredFields) {
        const value = data[field] || '[NOT PROVIDED]';
        prompt += `\n${field}: ${value}`;
    }

    return prompt;
};

// const generateTotalReport = async (sections, studentData) => {
//     let htmlContent = '';

//     // Process sections in parallel
//     const processedSections = await Promise.all(
//         sections.map(async (section) => {
//             const index = section.content.search('<body>');
//             if (index > -1) {
//                 return section.content.substring(
//                     index + 6,
//                     section.content.search('</body>')
//                 );
//             }
//             return section.content;
//         })
//     );

//     htmlContent = processedSections.join('<br />');

//     try {
//         const pdf = await generateAndSavePDF(
//             htmlContent,
//             `${studentData.firstName} ${studentData.lastName}-${studentData._id}.pdf`
//         );
//         return pdf;
//     } catch (err) {
//         console.error('Error generating total report:', err);
//         throw err;
//     }
// };

const generateReport = async (studentInfo) => {
    try {
        console.log(
            'Starting report generation for:',
            getFullName(studentInfo)
        );
        const sections = await ReportSection.find();
        const targetTemplate = sections[0];

        if (!targetTemplate) {
            throw new Error('Template not found');
        }

        studentInfo.years = calculateAge(studentInfo.dateOfBirth).years;
        studentInfo.months = calculateAge(studentInfo.dateOfBirth).months;
        studentInfo.name = getFullName(studentInfo);

        const sectionPromises = targetTemplate.sections.map((section) =>
            generateReportSection(targetTemplate, section, studentInfo)
        );

        const generatedSections = await Promise.all(sectionPromises);

        // Sort sections by order
        generatedSections.sort((a, b) => a.order - b.order);

        // Generate final PDF
        const generatedReport = await generateTotalReport(
            generatedSections,
            studentInfo
        );

        return generatedReport;
    } catch (error) {
        console.error('Error in report generation:', error);
        throw error;
    }
};

module.exports = {
    generateReport,
    generateReportSection,
};
