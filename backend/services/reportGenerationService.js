const { ChatOpenAI } = require('@langchain/openai');
const {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
} = require('@langchain/core/prompts');
const fs = require('fs');
const Template = require('../models/Report');
const { generateAndSavePDF } = require('./pdfGenerationService');
const { parseFile } = require('../utils');

const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-4o-mini',
    temperature: 0.5,
});

const generateReportPart = async (prompt, idx, studentInfo, files) => {
    const needFiles = Object.keys(files).filter(key => prompt.need.includes(key));

    console.log("Need Files:", needFiles);

    if (needFiles.length < prompt.need.length)
        return { order: idx, content: '```html\n<body></body>\n```' }

    const fileContents = needFiles.map(need => {
        const fileContent = parseFile(files[need]);
        return { type: need.type, content: fileContent };
    });

    const contents = await Promise.all(fileContents);

    const chatPrompt = ChatPromptTemplate.fromMessages([
        SystemMessagePromptTemplate.fromTemplate(
            `You are a professional report writer specialized in education psychological reports.
            ${needFiles.length === 0 ? 
                "Please output the reuslts like html code only body content as the same as the give sentences according to the style."
                : "Output the results like html code only body content according to the prompt."
            }
            Note: Each Table must follow these Styles: border-collapse, grid, width-100%
            Each Title must follow these Styles: Bold Style, strong tag, Left Align.`
        ),
        HumanMessagePromptTemplate.fromTemplate(prompt.humanPrompt),
    ]);

    const chain = chatPrompt.pipe(model);

    const res = await chain.invoke({
        file: contents.map(content => content.content).join('\n\n'),
        ...studentInfo,
    });

    console.log(res.content);

    return {
        order: idx,
        content: res.content
    }
}

const generateReportSection = async (section, studentInfo, files) => {
    try {
        // const prompt = constructSectionPrompt(section, studentInfo);

        // console.log(file);
        // const needs = [...new Set(needFiles)];

        const parts = section.prompts.map((prompt, idx) => 
            generateReportPart(prompt, idx, studentInfo, files)
        );

        const generatedParts = await Promise.all(parts);

        const chatPrompt = ChatPromptTemplate.fromMessages([
            SystemMessagePromptTemplate.fromTemplate(
                `Given the html contents separated by '\n\n' symbol, output result like one html file(only body content) by adding contents.
                ${section.order !== 1 ? 'At the first, there is section title. Section Title must follow these styles: Bold, h4 tag, Center Align, Border, No padding, width-100%,, Uppercase': ''}`
            ),
            HumanMessagePromptTemplate.fromTemplate(`${section.order !== 1 ? '{sectionTitle}' : ''} \n ${generatedParts.map(part => part.content).join('\n\n')}`),
        ]);

        const chain = chatPrompt.pipe(model);

        const res = await chain.invoke({
            sectionTitle: section.title,
            ...studentInfo,
        });

        console.log(section.order, section.title);

        return {
            order: section.order,
            content: res.content,
        };
    } catch (error) {
        console.error('Error generating report section:', error);
        throw error;
    }
};

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
        const template = await Template.findOne({ type: 'Initial' }).populate('sections.prompts');

        const sectionPromises = template.sections.map((section) =>
            generateReportSection(section, studentInfo, files)
        );

        const generatedSections = await Promise.all(sectionPromises);

        // const generatedSections = sectionPromises;

        console.log(generatedSections);

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
