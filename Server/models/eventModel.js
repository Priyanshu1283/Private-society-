const mongoose = require('mongoose');

const defaultAdminId = '660000000000000000000000';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: defaultAdminId,
  },
  venue: {
    type: String,
    default: "Society Ground",
  }
});

const eventModel = mongoose.model('event', eventSchema);
module.exports = eventModel;
