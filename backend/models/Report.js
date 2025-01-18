const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Psychoeducational', 'Triennial', 'Initial', 'Progress', 'Behavioral', 'Assessment']
  },
  testScores: {
    cognitive: {
      score: Number,
      classification: String,
      date: Date
    },
    academic: {
      reading: Number,
      math: Number,
      writing: Number,
      date: Date
    },
    behavioral: {
      score: Number,
      classification: String,
      date: Date
    }
  },
  summary: {
    type: String,
    // required: true
  },
  recommendations: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['draft', 'review', 'final'],
    default: 'draft'
  },
  author: {
    type: String,
    required: true
  },
  // author: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // },
  file: {
    type: String,
    required: true
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

module.exports = mongoose.model('Report', reportSchema);