const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  residentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['paid', 'unpaid', 'pending'],
    default: 'unpaid',
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'upi', 'card', 'bank'],
    default: 'cash',
  },
});

const maintenance = mongoose.model('maintenance', maintenanceSchema);
module.exports = maintenance;
