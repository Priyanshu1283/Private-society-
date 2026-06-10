const express = require("express");
const cors = require("cors");
const path = require("path");
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
  "http://127.0.0.1:5173",
  "https://private-society.vercel.app",
  "https://societysync-890y.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman, mobile apps, server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
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
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "dist")));

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

// Wildcard route to serve React Router frontend from dist folder
app.get("*all", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

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
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;