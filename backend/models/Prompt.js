const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
    section: String,
    need: Array,
    humanPrompt: String,
    systemPrompt: String,
});

module.exports = mongoose.model('Prompt', promptSchema);
