const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  	firstName: {
		type: String,
		required: true
	},
	lastName: String,
	dateOfBirth: {
		type: Date,
		require: true
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
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Student', studentSchema);