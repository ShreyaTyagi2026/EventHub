const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const venueRoutes = require("./routes/venueRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const aiRoutes = require("./routes/aiRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/ai", aiRoutes);
app.use(errorMiddleware);
// Test Route
app.get("/", (req, res) => {
  res.send(" EventHub Backend is Running");
});

module.exports = app;