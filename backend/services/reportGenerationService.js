const OpenAI = require('openai');
const fs = require('fs');
const ReportTemplate = require('../models/ReportTemplate');
const { generateAndSavePDF } = require('./pdfGenerationService');
const { calculateAge, getFullName, parsePdf, parseDocx } = require('../utils');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateReportSection = async (template, section, studentInfo, files) => {
    try {

        // const file = files.find(f => f.protocol === section.name);

        // console.log(file, section.name)

        // if (file) {
        //     let fileContent
        //     if (file.file.includes(".pdf"))
        //         fileContent = parsePdf(`${file.protocol}-${file.file}`);
        //     else if (file.file.includes(".docx"))
        //         fileContent = parseDocx(`${file.protocol}-${file.file}`);
        //     console.log(fileContent);
            
        //     studentInfo.file = fileContent;
        // }

        const prompt = constructSectionPrompt(section, studentInfo);

        console.log("Prompt: ", prompt);

        // if (prompt.includes("file: [NOT PROVIDED]")) {
        //     console.log("FILE");
        //     return "File Not Provided";
        // }

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
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

    // Process sections in parallel
    const processedSections = await Promise.all(
        sections.map(async section => {
            const index = section.content.search('<body>');
            if (index > -1) {
                return section.content.substring(
                index + 6, 
                section.content.search('</body>')
                );
            }
            return section.content;
        })
    );

    htmlContent = processedSections.join('<br />');

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
};

const generateReport = async (studentInfo) => {
    try {
        console.log('Starting report generation for:', getFullName(studentInfo));
        const templates = await ReportTemplate.find();
        const targetTemplate = templates[0];

        if (!targetTemplate) {
            throw new Error('Template not found');
        }

        studentInfo.years = calculateAge(studentInfo.dateOfBirth).years;
        studentInfo.months = calculateAge(studentInfo.dateOfBirth).months;
        studentInfo.name = getFullName(studentInfo);

        const sectionPromises = targetTemplate.sections.map(section => 
            generateReportSection(targetTemplate, section, studentInfo)
        )

        // Generate sections in parallel
        // const sectionPromises = targetTemplate.sections.map(section => 
        //     generateReportSection(targetTemplate, section, studentInfo)
        // );

        const generatedSections = await Promise.all(sectionPromises);
        
        // Sort sections by order
        generatedSections.sort((a, b) => a.order - b.order);

        // Generate final PDF
        const generatedReport = await generateTotalReport(generatedSections, studentInfo);
        
        return generatedReport;
    } catch (error) {
        console.error("Error in report generation:", error);
        throw error;
    }
};

module.exports = {
    generateReport,
    generateReportSection
};