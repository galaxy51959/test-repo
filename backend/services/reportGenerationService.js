const { ChatOpenAI } = require('@langchain/openai');
const {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
} = require('@langchain/core/prompts');
const fs = require('fs');
const Prompt = require('../models/Prompt');
const { generateAndSavePDF } = require('./pdfGenerationService');
const { parseFile } = require('../utils');

const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-4o-mini',
    temperature: 0.5,
});

const generateReportSection = async (section, studentInfo, file) => {
    try {
        // const prompt = constructSectionPrompt(section, studentInfo);

        // console.log(file);

        const fileContent = await parseFile(file);

        const chatPrompt = ChatPromptTemplate.fromMessages([
            SystemMessagePromptTemplate.fromTemplate(
                'You are a professional report writer specialized in education psychological reports. Given the prompt, output result like html code only body content. Note: Each Table Style must follow styles: border-collapse. Each Paragraph Style: Bold Style, Strong Tag, Left Align.'
            ),
            HumanMessagePromptTemplate.fromTemplate(` ${section.humanPrompt}`),
        ]);
        // You are a professional report writer specialized in eucational psychological reports

        const chain = chatPrompt.pipe(model);

        const res = await chain.invoke({
            file: fileContent,
            ...studentInfo,
        });

        console.log(section.order);

        return {
            order: section.order,
            content: res.content,
        };
    } catch (error) {
        console.error('Error generating report section:', error);
        throw error;
    }
};

// const constructSectionPrompt = (section, data) => {
//     let prompt = section.prompt;

//     for (const field of section.requiredFields) {
//         const value = data[field] || '[NOT PROVIDED]';
//         prompt += `\n${field}: ${value}`;
//     }

//     return prompt;
// };

const generateTotalReport = async (sections, studentData) => {
    let htmlContent = '';

    // Process sections in parallel
    const processedSections = await Promise.all(
        sections.map(async (section) => {
            // const index = section.content.search('<body>');
            // if (index > -1) {
            //     const idx = section.content.indexOf()
            // }
            // return section.content;
            return section.content.substring(7, section.content.length - 4);
        })
    );

    htmlContent = processedSections.join('<br />');

    try {
        const pdf = await generateAndSavePDF(
            htmlContent,
            `${studentData.name}-${new Date().toLocaleDateString('en-CA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            })}.pdf`
        );
        return pdf;
    } catch (err) {
        console.error('Error generating total report:', err);
        throw err;
    }
};

const generateReport = async (studentInfo, files) => {
    try {
        console.log('Starting report generation for:', studentInfo.name);
        const sections = await Prompt.find().sort({ order: 1 });

        // if (!targetTemplate) {
        //     throw new Error('Template not found');
        // }

        // const generatedSections = [];

        // const file = files.find(f => f.type === sections[0].type);

        // generatedSections.push(await generateReportSection(sections[0], studentInfo, file));

        const sectionPromises = sections.map((section) => {
            const file = files.find((f) => f.type === section.type);
            if (file) return generateReportSection(section, studentInfo, file);
        });

        const generatedSections = await Promise.all(sectionPromises);

        // Sort sections by order
        const filteredSection = generatedSections
            .filter((section) => section !== undefined)
            .sort((a, b) => a.order - b.order);

        // Generate final PDF
        const generatedReport = await generateTotalReport(
            filteredSection,
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
