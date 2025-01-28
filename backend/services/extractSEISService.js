const { ChatOpenAI } = require('@langchain/openai');
const {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
} = require('@langchain/core/prompts');
const { calculateAge, getFullName, parsePdf, parseDocx } = require('../utils');

const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-4o-mini',
    temperature: 0.5,
});

const extractSEIS = async (file) => {
    const fileContent = await parsePdf(file.originalname);

    const chatPrompt = ChatPromptTemplate.fromMessages([
        SystemMessagePromptTemplate.fromTemplate(
            'Analyze and extract info related to student from the given file. Note:Output must be an object'
        ),
        HumanMessagePromptTemplate.fromTemplate('{file}'),
    ]);
    const chain = chatPrompt.pipe(model);

    const res = await chain.invoke({ file: fileContent });

    return res.content.substring(7, res.content.length - 3);
};

module.exports = extractSEIS;
