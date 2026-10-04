const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Import route auth
const authRoutes = require("./routes/auth");

// Baca file .env
dotenv.config();

// Buat aplikasi Express
const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Backend Habit Tracker is running! 🚀",
  });
});

app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route tidak ditemukan.",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
