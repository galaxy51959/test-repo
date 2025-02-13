const Prompt = require('../models/Prompt');
const Template = require('../models/Template');
const template = require('../models/Template');

// Create new Prompt
const createPrompt = async (req, res) => {
    try {
        const prompt = new Prompt(req.body);
        await prompt.save();
        res.status(201).json(prompt);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all Prompts
const getPrompts = async (req, res) => {
    try {
        const prompts = await Template.findOne({ type: 'Initial' });

        res.json(prompts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Prompt by ID
const getPromptById = async (req, res) => {
    try {
        const prompt = await Prompt.findById(req.params.id);
        if (!prompt) {
            return res.status(404).json({ message: 'Prompt not found' });
        }
        res.json(prompt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPromptsBySection = async (req, res) => {
    try {
        const prompts = await Prompt.aggregate([
            {
                $group: {
                    _id: '$section',
                    types: { $push: '$type' },
                    order: { $min: '$order' },
                },
            },
            { $sort: { order: 1 } },
        ]);
        res.json(prompts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update report
const updatePrompt = async (req, res) => {
    try {
        const prompt = await Prompt.findById(req.params.id);
        if (!prompt) {
            return res.status(404).json({ message: 'Prompt not found' });
        }
        Object.assign(prompt, req.body);
        prompt.updatedAt = Date.now();
        await prompt.save();
        res.json(prompt);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Prompt
const deletePrompt = async (req, res) => {
    try {
        const prompt = await Prompt.findByIdAndDelete(req.params.id);
        if (!prompt) {
            return res.status(404).json({ message: 'Prompt not found' });
        }
        res.json({ message: 'Prompt deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPrompt,
    getPrompts,
    getPromptById,
    getPromptsBySection,
    updatePrompt,
    deletePrompt,
};
