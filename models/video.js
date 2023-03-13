const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;