const { Client } = require('@notionhq/client');

const getNotionData = async (req, res) => {
    res.send('Notion data');
};

module.exports = {
    getNotionData,
};
