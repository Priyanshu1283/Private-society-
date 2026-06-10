const mongoose = require('mongoose');

// Create a User schema for Google OAuth
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, 
    trim: true,
  },
  profilePicture: {
    data: Buffer,
    contentType: String
  },
  houseNo: {
    type: String,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "worker", "security", "admin"],
    default: "user",
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  }
});

// Create a model from the schema
const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
