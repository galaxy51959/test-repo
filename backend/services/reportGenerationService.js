const { ChatOpenAI } = require('@langchain/openai');
const {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
} = require('@langchain/core/prompts');
const Template = require('../models/Template');
const { generateAndSavePDF } = require('./pdfGenerationService');
const { parseFile } = require('../utils');

const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-4o-mini',
    temperature: 0.5,
});

const generateReportPart = async (prompt, idx, files, sectionTitle, eligibility) => {
    const needAttachments = Object.keys(files).filter((key) =>
        prompt.attachments.includes(key)
    );

    if (needAttachments.length < prompt.attachments.length && sectionTitle !== 'Summary and Diagnostic Impression' && sectionTitle !== 'Eligibility Considerations')
        return { content: '' };

    const fileContents = await Promise.all(
        needAttachments.map(async (attachment) => {
            const fileContent = await parseFile(files[attachment]);
            return { type: attachment, content: fileContent };
        })
    );

    const file = fileContents.map((content) => content.content).join('\n\n');

    const chatPrompt = ChatPromptTemplate.fromMessages([
        SystemMessagePromptTemplate.fromTemplate(
            `${file ? `Uploaded File: ${file} \n\n` : ''}
            ${sectionTitle === 'Summary and Diagnostic Impression' || sectionTitle == 'Eligibility Considerations' ? `Eligibility Category: ${eligibility} \n\n` : ''}
            ${prompt.systemPrompt}`
        ),
        HumanMessagePromptTemplate.fromTemplate(prompt.humanPrompt),
    ]);

    const chain = chatPrompt.pipe(model);

    const res = await chain.invoke();

    console.log(idx);

    return {
        order: idx,
        content: res.content.substring(
            res.content.indexOf('<'),
            res.content.lastIndexOf('>') + 1
        ),
    };
};

const generateReportSection = async (section, files, eligibility) => {
    try {
        const plainSection = section.toObject ? section.toObject() : section;

        const parts = plainSection.prompts.map((prompt, idx) =>
            generateReportPart(prompt, idx, files, plainSection.title, eligibility)
        );

        const generatedParts = await Promise.all(parts);

        const sectionTitle = `<h4 style="text-align: center; border:1px solid black; text-transform: uppercase; background-color:#9ca3af">${plainSection.title}</h4>`;

        const isEmpty = generatedParts.every((part) => part.content === '');

        if (isEmpty && !plainSection.required) {
            return;
        }

        let res;
        if (!isTitleExcepted(plainSection.title)) {
            res = generatedParts.reduce(
                (acc, part) => {
                    acc.content += part.content;
                    acc.content += '<br />';
                    return acc;
                },
                { content: sectionTitle }
            );
            return res;
        }

        res = generatedParts.reduce(
            (acc, part) => {
                acc.content += part.content;
                acc.content += '<br />'
                return acc;
            },
            { content: '' }
        );

        return res;
    } catch (error) {
        console.error('Error generating report section:', error);
        throw error;
    }
};

const generateTotalReport = async (sections) => {
    // let htmlContent = '';

    // Process sections in parallel
    const htmlContent = sections.reduce((acc, section) => {
        acc += section.content;
        return acc;
    }, '');

    console.log('Total Content: ', htmlContent);

    try {
        const pdf = await generateAndSavePDF(
            htmlContent,
            `${new Date().toLocaleDateString('en-CA', {
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

const generateReport = async ({ type, eligibility }, files) => {
    try {
        console.log('Starting report generation for:');
        const template = await Template.findOne({ type });

        const sectionPromises = template.sections.slice(15, 17).map((section) =>
            generateReportSection(section, files, eligibility)
        );

        const generatedSections = await Promise.all(sectionPromises);

        // Sort sections by order
        const filteredSection = generatedSections.filter(
            (section) => section !== undefined
        );

        // Generate final PDF
        const generatedReport = await generateTotalReport(filteredSection);

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

const titleExcept = [
    'Confidential Multidisciplinary Report',
    'Report Information',
    'Purpose of Assessment',
    'Validity Statement',
    'Assessment Information',
    'Cultural and Linguistic Factors',
    'Recommendations',
    'Signature Area',
];

const isTitleExcepted = (title) => titleExcept.includes(title);
