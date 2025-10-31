const mongoose = require('mongoose');

const contentBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'quiz', 'code', 'link'],
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { _id: true, timestamps: false });

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  durationSeconds: {
    type: Number,
    default: 0,
    min: 0
  },
  videoUrl: String,
  youtubeId: String,
  contentBlocks: {
    type: [contentBlockSchema],
    default: []
  }
}, { _id: true, timestamps: false });

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  lessons: {
    type: [lessonSchema],
    default: []
  }
}, { _id: true, timestamps: false });

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  description: {
    type: String,
    default: ''
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  language: {
    type: String,
    default: 'en'
  },
  thumbnailUrl: String,
  promoVideoUrl: String,
  priceInPaise: {
    type: Number,
    default: 0,
    min: 0
  },
  isPublished: {
    type: Boolean,
    default: false,
    index: true
  },
  modules: {
    type: [moduleSchema],
    default: []
  },
  tags: {
    type: [String],
    default: []
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

courseSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Course', courseSchema);


