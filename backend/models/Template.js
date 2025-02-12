const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
    humanPrompt: String,
    systemPrompt: String,
    attachments: [String]
});

const sectionSchema = new mongoose.Schema({
    name: String,
    description: String,
    prompts: [promptSchema],
    required: {
        type: Boolean,
        default: false
    }
});

const templateSchema = new mongoose.Schema({
    type: String,
    sections: [sectionSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

templateSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Template', templateSchema);