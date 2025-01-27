const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
	protocol: String,
	file: String,
	rater: {
		type: String,
		required: true,
		enum: ['teacher', 'parent'],
		}
});

const studentSchema = new mongoose.Schema({
  	firstName: {
		type: String,
		required: true
	},
	middleName: String,
	lastName: String,
	gender: {
		type: Boolean,
		required: true
	},
	dateOfBirth: {
		type: Date,
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
	language: String,
	parent: {
		firstName: String,
		lastName: String,
		email: String,
		phone: String
	},
	teacher: {
		firstName: String,
		lastName: String,
		email: String,
		phone: String
	},
	assessments: [assessmentSchema],
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