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
  	firstName: String,
	lastName: String,
	gender: {
		type: String,
		enum: ['Male', 'Female']
	},
	dateOfBirth: Date,
	grade: Number,
	school: String,
	language: String,
	parent: {
		name: String,
		email: String,
		phone: String
	},
	teacher: {
		name: String,
		email: String,
		phone: String
	},
	// assessments: [assessmentSchema],
	createdAt: {
		type: Date,
		default: Date.now
	},
	uploads: {
		type: Object,
		default: {}
	},
	report: {
		type: String,
		default: ""		
	},
	updatedAt: {
		type: Date,
		default: Date.now
	},
});

module.exports = mongoose.model('Student', studentSchema);