const mongoose = require('mongoose');

const reportSectionSchema = new mongoose.Schema({
	protocol: {
		type: String,
		required: true
	},
	humanPrompt: {
		type: String,
		required: true
	},
	systemPrompt: {
		type: String,
		required: true
	},
	order: {
		type: Number,
		required: true
	},
	// requiredFields: [String]
});

// const reportTemplateSchema = new mongoose.Schema({
// 	type: {
// 		type: String,
// 		required: true,
// 		enum: ['Psychoeducational', 'Triennial', 'Initial']
// 	},
// 	sections: [reportSectionSchema],
// 	basePrompt: {
// 		type: String,
// 		required: true
// 	},
// 	formatting: {
// 		type: String,
// 		enum: ['markdown', 'plain'],
// 		default: 'markdown'
// 	},
// 	createdAt: {
// 		type: Date,
// 		default: Date.now
// 	},
// 	updatedAt: {
// 		type: Date,
// 		default: Date.now
// 	}
// });

module.exports = mongoose.model("ReportSection", reportSectionSchema);