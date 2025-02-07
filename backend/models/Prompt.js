const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
    humanPrompt: String,
    systemPrompt: String,
    attachments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attachment'
    }]
});

module.exports = mongoose.model('Prompt', promptSchema);
