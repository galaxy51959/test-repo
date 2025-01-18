const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['assessment', 'meeting', 'review', 'other'],
    required: true
  },
  attendees: [{
    email: String,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending'
    }
  }],
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  location: String,
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'notification'],
    },
    time: Number // minutes before event
  }],
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Calendar', calendarSchema);