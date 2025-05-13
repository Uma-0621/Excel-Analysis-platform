const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const chartHistoryRoutes = require("./routes/chart-history");
const aiSummaryRoutes = require("./routes/ai-summary");

const app = express();

// CORS configuration
app.use(cors({
  origin: 'https://your-frontend-domain.com', // Replace with the actual frontend URL
  methods: 'GET,POST,PUT,DELETE',
}));

// Middleware for JSON parsing
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/file", uploadRoutes);
app.use("/api/chart-history", chartHistoryRoutes);
app.use("/api/ai-summary", aiSummaryRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong, please try again later' });
});
