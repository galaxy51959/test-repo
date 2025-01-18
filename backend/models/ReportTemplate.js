const mongoose = require('mongoose');

const reportSectionSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	prompt: {
		type: String,
		required: true
	},
	order: {
		type: Number,
		required: true
	},
	context: {
		type: String,
		required: true
	},
	promptInstructions: String,
	requiredFields: [String]
});

const reportTemplateSchema = new mongoose.Schema({
	type: {
		type: String,
		required: true,
		enum: ['Psychoeducational', 'Triennial', 'Initial']
	},
	sections: [reportSectionSchema],
	basePrompt: {
		type: String,
		required: true
	},
	formatting: {
		type: String,
		enum: ['markdown', 'plain'],
		default: 'markdown'
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model("ReportTemplate", reportTemplateSchema);