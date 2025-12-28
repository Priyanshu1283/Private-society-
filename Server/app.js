const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./configs/mongodb-connection');

const authRoutes = require("./routes/auth-routes");
const eventRoutes = require("./routes/event-routes");
const complaintRoutes = require("./routes/complaint-routes");
const serviceRoutes = require("./routes/service-routes");
const meRoutes = require("./routes/me-routes");

const app = express();
const PORT = process.env.PORT || 5000;

// 🔗 Database Connection
connectDB();

// 🔹 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.static('public'));

// 🔹 Routes
app.get('/api', (req, res) => {
  res.send("SocietySync API is running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/me", meRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
