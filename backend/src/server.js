const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://recommendation-system-beryl.vercel.app",
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({ message: "Netflix-inspired recommendation API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
