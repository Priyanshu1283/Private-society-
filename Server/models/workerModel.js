const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profilePicture: {
    data: Buffer,
    contentType: String,
  },
  password: {
    type: String,
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  }
});

const workerModel = mongoose.model('worker', workerSchema);
module.exports = workerModel;
