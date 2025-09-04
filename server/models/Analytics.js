const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  label: {
    type: String,
    trim: true
  },
  value: {
    type: Number
  },
  userId: {
    type: String,
    trim: true
  },
  sessionId: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  ip: {
    type: String,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analytics', analyticsSchema);
