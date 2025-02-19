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

const constRecommendations = {
    'Academic Support Recommendations': {
        'Small Group or 1:1 Instruction':
            'Provide (NAME) with additional academic support through small group interventions or one-on-one instruction to help her stay on track, particularly in reading, writing, and math',
        'Extended Time on Assignments & Assessments':
            "Due to (NAME)'s challenges with processing speed and working memory, allow extra time to complete tasks, tests, and in-class assignments.",
        'Chunking Assignments':
            'Break assignments into smaller, manageable sections with clear, step-by-step instructions.',
        'Check-ins for Understanding':
            'Regularly check for comprehension before moving on to new content to ensure she understands assignments.',
        'Visual Supports':
            'Utilize graphic organizers, visual schedules, and step-by-step task lists to help with comprehension and organization.',
        'Preferential Seating':
            'Seat (NAME) near the teacher or away from distractions to help with focus and engagement in classroom activities.',
        'Consistent Routines':
            'Maintain predictable routines in the classroom to help with her adaptability and comfort level in academic settings.',
        'Use of Assistive Technology':
            'Provide access to text-to-speech and speech-to-text programs to support her written expression and comprehension.',
        'Alternative Assignment Formats':
            'Allow (NAME) to present information in various ways (e.g., oral presentations, videos, drawing) rather than requiring extensive written assignments.',
        'Frequent Movement Breaks':
            'Provide short, structured movement breaks to support focus and prevent frustration.',
    },
    'Behavioral and Social-Emotional Support Recommendations': {
        'Social Skills Training':
            'Implement structured social skills groups to help (NAME) improve peer interactions, learn social norms, and manage interpersonal relationships effectively.',
        'Behavior Intervention Plan(BIP)':
            'Develop a structured behavior plan with clear expectations, rewards, and consequences to address impulse control, hyperactivity, and compliance issues.',
        'Check-In/Check-Out System':
            'Assign a trusted adult mentor or case manager to check in with (NAME) at the beginning and end of the day to provide encouragement and review her goals.',
        'Counseling Services':
            'Continue or expand school-based counseling or therapy sessions to support emotional regulation, coping skills, and trauma recovery.',
        'Self-Regulation Strategies':
            'Teach and reinforce coping strategies such as deep breathing exercises, mindfulness, and sensory breaks.',
        'Positive Reinforcement':
            "Use a strengths-based approach, recognizing and rewarding (NAME)'s positive behaviors to reinforce motivation and engagement.",
        'Safe Space in the Classroom':
            'Establish a designated quiet space for (NAME) to use when feeling overwhelmed or frustrated.',
        'Peer Buddies or Mentoring Program':
            'Pair (NAME) with a peer buddy to provide positive social modeling and guidance in group activities.',
        'Clear and Consistent Expectations':
            'Provide structured rules and behavioral expectations with visual reminders to help with impulse control and following directions.',
        'Emotional Check-Ins':
            'Provide regular emotional check-ins throughout the school day to help her process feelings and prevent emotional dysregulation.',
    },
    'Executive Functioning and Organizational Skills Recommendations': {
        'Daily Planner or Agenda':
            'Encourage the use of an organizational tool to help (NAME) keep track of assignments, deadlines, and upcoming tests.',
        'Task Initiation Support':
            'Provide prompts and cues to help her get started on tasks, as she may struggle with initiation.',
        'Structured Transitions':
            'Prepare (NAME) for transitions between activities by using countdowns, timers, or verbal reminders.',
        'Frequent Redirection and Prompts':
            'Gently redirect (NAME) when off-task using a discrete prompt rather than public correction.',
        'Goal-Setting Strategies':
            'Work with (NAME) to set small, achievable academic and behavioral goals and celebrate progress.',
    },
    'Environmental Modifications': {
        'Reduced Distractions in the Classroom':
            'Limit excessive visual and auditory distractions in her learning environment.',
        'Flexible Seating Options':
            'Allow (NAME) to choose from various seating options (standing desk, wobble chair, etc.) to support focus and sensory needs.',
        'Sensory Tools':
            'Provide fidget tools, noise-canceling headphones, or other sensory supports as needed.',
        'Quiet Work Space Access':
            'Offer (NAME) a designated quiet area where she can complete work with minimal distractions.',
        'Visual Cues and Checklists':
            'Implement visual reminders for expectations, schedules, and multi-step tasks.',
    },
};

const generateReportPart = async (
    prompt,
    idx,
    files,
    sectionTitle,
    eligibility,
    recommendations
) => {
    const needAttachments = Object.keys(files).filter((key) =>
        prompt.attachments.includes(key)
    );

    console.log(prompt.attachments);

    if (
        needAttachments.length < prompt.attachments.length &&
        sectionTitle !== 'Behavioral Observations' &&
        sectionTitle !== 'Summary and Diagnostic Impression' &&
        sectionTitle !== 'Eligibility Considerations'
    ) {
        return { content: '' };
    }

    const fileContents = await Promise.all(
        needAttachments.map(async (attachment) => {
            const fileContent = await parseFile(files[attachment]);
            return { type: attachment, content: fileContent };
        })
    );

    const file = fileContents.map((content) => content.content).join('\n\n');

    console.log(sectionTitle);
    console.log(file);

    const chatPrompt = ChatPromptTemplate.fromMessages([
        SystemMessagePromptTemplate.fromTemplate(
            `${file ? `Uploaded File: ${file} \n\n` : ''}
            ${sectionTitle === 'Summary and Diagnostic Impression' || sectionTitle == 'Eligibility Considerations' ? `Eligibility Category:  \n\n` : ''}
            ${prompt.systemPrompt}`
        ),
        HumanMessagePromptTemplate.fromTemplate(
            `${sectionTitle !== 'Recommendations' ? prompt.humanPrompt : prompt.humanPrompt + '\n' + generateRecommendationsPrompt(recommendations).content}`
        ),
    ]);

    const chain = chatPrompt.pipe(model);

    const res = await chain.invoke({});

    console.log(idx);

    return {
        order: idx,
        content: res.content.substring(
            res.content.indexOf('<'),
            res.content.lastIndexOf('>') + 1
        ),
    };
};

const generateReportSection = async (
    section,
    files,
    eligibility,
    recommendtaions
) => {
    try {
        const plainSection = section.toObject ? section.toObject() : section;

        const parts = plainSection.prompts.map((prompt, idx) =>
            generateReportPart(
                prompt,
                idx,
                files,
                plainSection.title,
                eligibility,
                recommendtaions
            )
        );

        console.log(plainSection.title);

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
                acc.content += '<br />';
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

const generateRecommendationsPrompt = (recommendations) => {
    const recommendationPart =
        Object.entries(constRecommendations)
            .map(
                ([key, value]) =>
                    `${key}:\n
        ${Object.entries(value)
            .filter(([subKey]) => recommendations[key][subKey])
            .map(([subKey, subValue]) =>
                recommendations[key][subKey] ? `${subKey}: ${subValue}` : ''
            )
            .join('\n')}`
            )
            .join('\n') +
        "Note: Please replace the (NAME) to the student's first name in the document that was uploaded.";
    return {
        content: recommendationPart,
    };
};

const generateTotalReport = async (sections) => {
    // let htmlContent = '';

    // Process sections in parallel
    const htmlContent = sections.reduce((acc, section) => {
        acc += section.content;
        return acc;
    }, '');

    // console.log('Total Content: ', htmlContent);

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

const generateReport = async (
    { type, eligibility, recommendations },
    files
) => {
    try {
        console.log('Starting report generation for:');
        const template = await Template.findOne({ type });

        const sectionPromises = template.sections.slice(14, 15).map((section) =>
            generateReportSection(section, files, eligibility, recommendations)
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
