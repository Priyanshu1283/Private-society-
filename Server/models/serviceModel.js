const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  residentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  houseNo: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Plumbing', 'Carpentering', 'Electrical', 'Masonry', 'Cleaning', 'Other'],
    required: true,
  },
  detail: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
  },
  request: {
    type: Date,
    default: Date.now,
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'worker',
    default: null,
  },
});

const serviceModel = mongoose.model('service', serviceSchema);
module.exports = serviceModel;
