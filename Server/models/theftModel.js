const mongoose = require('mongoose');

const theftSchema = new mongoose.Schema({
  residentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  media: {
    type: String,
    default: '',
  },
  detail: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

const theft = mongoose.model('theft', theftSchema);
module.exports = theft;
