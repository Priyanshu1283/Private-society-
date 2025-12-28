const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    const conn = await mongoose.connect(uri);

    console.log('MongoDB Connected');

  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
