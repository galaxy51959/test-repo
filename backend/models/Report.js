const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    title: {
        type: String,
        enum: [
            'Confidential Multidisciplinary Report',
            'Identifying Information',
            'Purpose of Assessment',
            'Procedures',
            'Validity Statement',
            'Assessment Information',
            'Background Information',
            'Academic History',
            'Interviews',
            'Behavioral Observations',
            'Current Assessment Results And Interpretation',
            'Cognitive Functioning Skills',
            'Auditory Processing',
            'Visual Processing',
            'Sensory-Motor Integration',
            'Socio-Emotional Functioning And Adaptive Behavior Skills',
            'Specialty Rating Scale',
            'Academic Evaluation Results',
            'Summary And Diagnostic Impressions',
            'Eligibility Considerations',
        ],
    },
    systemPrompt: String,
    prompts: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Prompt'
    }],
    order: Number,
});

const templateSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Initial', 'Re-Evaluation', 'Review', 'FBA'],
    },
    sections: [sectionSchema],
});

module.exports = mongoose.model('Template', templateSchema);
