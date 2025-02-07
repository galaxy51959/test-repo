const Template = require('../models/Template');

exports.getTemplateByType = async (req, res) => {
    try {
        const { type } = req.params;
        const template = await Template.findOne({ type });

        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        res.json(template);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
