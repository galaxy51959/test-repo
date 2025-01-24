const OpenAI = require('openai');
const fs = require('fs');
const ReportTemplate = require('../models/ReportTemplate');
const { generateAndSavePDF } = require('./pdfGenerationService');
const { calculateAge, getFullName, parsePdf, parseDocx } = require('../utils');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateReportSection = async (template, section, studentData, files) => {
    try {

        const file = files.find(f => f.protocol === section.name);

        console.log(file, section.name)

        if (file) {
            let fileContent
            if (file.file.includes(".pdf"))
                fileContent = parsePdf(`${file.protocol}-${file.file}`);
            else if (file.file.includes(".docx"))
                fileContent = parseDocx(`${file.protocol}-${file.file}`);
            console.log(fileContent);
            
            studentData.file = fileContent;
        }

        const prompt = constructSectionPrompt(section, studentData);

        console.log("Prompt: ", prompt);

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
    } catch (error) {
        console.error("Error generating report section:", error);
        throw error;
    }
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

const generateReport = async (studentData, files) => {

    console.log('studentData: ', studentData);
    console.log('files: ', files);

    const templates = await ReportTemplate.find();
    const targetTemplate = templates[0];

    if (!targetTemplate)
        throw new Error(`Template not found for type`);

    studentData.years = calculateAge(studentData.dateOfBirth).years;
    studentData.months = calculateAge(studentData.dateOfBirth).months;
    studentData.name = getFullName(studentData);

    const generatedReportSections = [];

    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[4], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[5], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[6], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[16], studentData, files));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[17], studentData, files));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[19], studentData, files));
    generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[20], studentData, files));


    // return generatedReportSections;

    // for (let i=0; i<9; i++) {
    //     generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[i], studentData, files));
    // }

    // generatedReportSections.sort((a, b) => a.order - b.order);

    const generatedReport = await generateTotalReport(generatedReportSections, studentData);
    
    return generatedReport;
}

module.exports = {
    generateReport,
    generateReportSection
}