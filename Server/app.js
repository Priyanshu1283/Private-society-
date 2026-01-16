const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./configs/mongodb-connection");

const authRoutes = require("./routes/auth-routes");
const eventRoutes = require("./routes/event-routes");
const complaintRoutes = require("./routes/complaint-routes");
const serviceRoutes = require("./routes/service-routes");
const meRoutes = require("./routes/me-routes");
const adminRoutes = require("./routes/admin-routes");

const app = express();
const PORT = process.env.PORT || 5000;

  //  DATABASE CONNECTION
connectDB();

  //  BODY PARSERS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

  //CORS CONFIG (FIXED)

const allowedOrigins = [
  "http://localhost:5173",
  "https://private-society.vercel.app/login",
  // "https://societysync-production.up.railway.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman, mobile apps, server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, origin); 
      }

      return callback(new Error("CORS not allowed"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =========================
   STATIC FILES (IMAGES)
========================= */
app.use(express.static("public"));

  //  ROUTES
app.get("/api", (req, res) => {
  res.send("SocietySync API is running ");
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/me", meRoutes);
app.use("/api/admin", adminRoutes);

  //  GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

  //  START SERVER
app.listen(PORT, () => {
  console.log(`☝️ Server running on port ${PORT}`);
});
module.exports = app;