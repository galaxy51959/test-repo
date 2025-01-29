const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
	section: String,
	protocol: String,
	humanPrompt: String,
	systemPrompt: String,
	order: Number
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

module.exports = mongoose.model("Prompt", promptSchema);