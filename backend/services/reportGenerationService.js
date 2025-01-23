const OpenAI = require('openai');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const ReportTemplate = require('../models/ReportTemplate');
const { generateAndSavePDF } = require('./pdfGenerationService');
const { calculateAge } = require('../utils');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateReportSection = async (template, section, data) => {
    try {

        console.log(section);

        const prompt = constructSectionPrompt(section, data);

        const completion = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                {
                    role: "system",
                    content: `You are a professional report writer specialized in eucational psychological reports.
                    ${template.basePrompt}
                    ${section.promptInstructions || ''}`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.5,
            max_tokens: 3000
        });

        console.log(section.order);
        // console.log(completion.choices[0].message.content);

        return { order: section.order, content: completion.choices[0].message.content };

        // return formatResponse(completion.choices[0].message.content, template.formatting);
    } catch (error) {
        console.error("Error generating report section:", error);
        throw error;
    }
}

const summarizePdf = async (pdfPath) => {

    const pdfBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(pdfBuffer);
    const text = data.text;  

    return text;

    // try {
    //     const response = await openai.chat.completions.create({
    //         model: "gpt-4-turbo-preview",
    //         messages: [
    //             {
    //                 role: "user",
    //                 content: `Summarize the following pdf:\\n\\n${text}`
    //             }
    //         ]
    //     });

    //     console.log(response.choices[0].message.content);
    //     return response.choices[0].message.content;
    // } catch (error) {
    //     console.error("Error summarizing pdf:", error);
    //     throw error;
    // }

    
    
}

const constructSectionPrompt = (section, data) => {
    let prompt = section.prompt;

    for (const field of section.requiredFields) {
        const value = data[field] || '[NOT PROVIDED]';
        prompt += `\n${field}: ${value}`;
    }

    return prompt;
}

const generateTotalReport = async (sections, studentData) => {
    let htmlContent = '';

    for (let i=0; i<sections.length; i++) {
        console.log(sections[i].content);
        const index = sections[i].content.search('<body>');

        if (index > -1) {
            const sectionContent = sections[i].content.substring(index+6, sections[i].content.search('</body>'));
            htmlContent += `${sectionContent}\n`;
        } else {
            htmlContent += `${sections[i].content}`;
        }
        htmlContent += '<br />';
    }

    try {
        const pdf = await generateAndSavePDF(
            htmlContent,
            `${studentData.firstName} ${studentData.lastName}-${studentData._id}.pdf`
        );
        return pdf;
    } catch (err) {
        console.error("Error generating total report:", err);
        throw err;
    }
}

const generateReport = async (studentData, testFiles) => {

    console.log('studentData: ', studentData);
    console.log('testFiles: ', testFiles);

    const templates = await ReportTemplate.find();
    const targetTemplate = templates[0];

    if (!targetTemplate)
        throw new Error(`Template not found for type`);

    studentData.age = calculateAge(studentData.dateOfBirth);

    const generatedReportSections = [];

    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[4], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[5], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[6], studentData));
    generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[20], studentData));
    

    // return generatedReportSections;

    // for (let i=0; i<6; i++) {
    //     generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[i], studentData));
    // }

    // generatedReportSections.sort((a, b) => a.order - b.order);

    const generatedReport = await generateTotalReport(generatedReportSections, studentData);
    
    return generatedReport;
}

module.exports = {
    generateReport,
    generateReportSection
}