const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  to: [{
    type: String,
    required: true
  }],
  from: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'scheduled', 'failed'],
    default: 'draft'
  },
  attachments: [{
    filename: String,
    path: String
  }],
  scheduledFor: {
    type: Date
  },
  related: {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Email', emailSchema);