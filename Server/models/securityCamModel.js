const mongoose = require('mongoose');

const securityCamSchema = new mongoose.Schema({
  cameraName: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  streamURL: {
    type: String,
    required: true,
    trim: true,
  }
});

const securityCam = mongoose.model('securityCam', securityCamSchema);
module.exports = securityCam;
