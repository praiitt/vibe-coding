const mongoose = require('mongoose');

const activityProgressSchema = new mongoose.Schema({
  moduleId: String,
  lessonId: String,
  completed: {
    type: Boolean,
    default: false
  },
  score: {
    type: Number,
    default: null,
    min: 0,
    max: 100
  },
  timeSpentSeconds: {
    type: Number,
    default: 0,
    min: 0
  },
  lastVisitedAt: Date
}, { _id: false });

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    index: true
  },
  activities: {
    type: [activityProgressSchema],
    default: []
  },
  overallPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastActivity: {
    moduleId: String,
    lessonId: String,
    visitedAt: Date
  }
}, { timestamps: true });

progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);


