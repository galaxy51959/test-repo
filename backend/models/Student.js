const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
	protocol: String,
	file: String,
});

const studentSchema = new mongoose.Schema({
  	firstName: {
		type: String,
		required: true
	},
	middleName: String,
	lastName: String,
	dateOfBirth: {
		type: Date,
		required: true
	},
	gender: {
		type: Boolean,
		required: true
	},
	grade: {
		type: Number,
		required: true
	},
	school: {
		type: String, 
		require: true,
	},
	guardian: String,
	language: String,
	tests: [testSchema],
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	},
});

module.exports = mongoose.model('Student', studentSchema);