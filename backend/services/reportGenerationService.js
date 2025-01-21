const OpenAI = require('openai');
const ReportTemplate = require('../models/ReportTemplate');
const { generateAndSavePDF } = require('./pdfGenerationService');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateReportSection = async (template, section, data) => {
    try {
        const prompt = constructSectionPrompt(section, data);

        const completion = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                {
                    role: "system",
                    content: `You are a professional report writer specialized in deucational psychological reports.
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

const constructSectionPrompt = (section, data) => {
    let prompt = section.prompt;

    for (const field of section.requiredFields) {
        const value = data[field] || '[NOT PROVIDED]';
        prompt += `\n${field}: ${value}`;
    }

    return prompt;
}

const generateTotalReport = async (sections, studentData, templateType) => {
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
        // const completion = await openai.chat.completions.create({
        //     model: 'gpt-4-turbo-preview',
        //     messages: [
        //         {
        //             role: "system",
        //             content: `Given the code about sections, output the completed html code(only body content without body tag).
        //                     There must be break lines between sections.`
        //         },
        //         {
        //             role: "user",
        //             content: prompt
        //         }
        //     ],
        //     temperature: 0.5,
        //     max_tokens: 2000
        // });

        const pdf = await generateAndSavePDF(
            htmlContent,
            `${studentData.firstName} ${studentData.lastName}-${templateType}.pdf`
        );

        return pdf;

    } catch (err) {
        console.error("Error generating total report:", err);
        throw err;
    }
}

const generateReport = async (studentData, templateType) => {

    console.log('studentData: ', studentData);
    console.log('templateType: ', templateType);

    const targetTemplate = await ReportTemplate.findOne({ type: templateType });

    console.log('targetTemplate: ', targetTemplate);

    if (!targetTemplate)
        throw new Error(`Template not found for type: ${templateType}`);

    const generatedReportSections = [];

    // targetTemplate.sections.forEach(section => {
    //     generatedReportSections.concat(generateReportSection(targetTemplate, section, testData));
    // })

    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[0], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[1], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[2], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[3], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[4], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[5], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[6], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[7], studentData));
    
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[8], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[9], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[10], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[11], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[12], studentData));

    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[12], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[13], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[14], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[15], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[16], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[17], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[18], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[19], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[20], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[21], studentData));
    // generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[22], studentData)); 

    for (let i=0; i<targetTemplate.sections.length; i++) {
        generatedReportSections.push(await generateReportSection(targetTemplate, targetTemplate.sections[i], studentData));
    }

    // console.log('GeneratedReportSection: ', generatedReportSections);

    generatedReportSections.sort((a, b) => a.order - b.order);

    const generatedReport = await generateTotalReport(generatedReportSections, studentData, templateType);
    
    return generatedReport;
}

module.exports = {
    generateReport,
    generateReportSection
}