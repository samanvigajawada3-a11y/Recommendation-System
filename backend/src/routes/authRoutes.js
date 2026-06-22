const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const createToken = require("../utils/token");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 30 * 24 * 60 * 60 * 1000
};

const clearCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production"
};

const sendSession = (res, user, status = 200) => {
  const token = createToken(user._id);
  res.cookie("token", token, cookieOptions);
  return res.status(status).json({
    user: { id: user._id, name: user.name, email: user.email }
  });
};

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  return sendSession(res, user, 201);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  const passwordMatches = user ? await bcrypt.compare(password, user.password) : false;

  if (!user || !passwordMatches) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  return sendSession(res, user);
});

router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

router.post("/logout", (_req, res) => {
  res.clearCookie("token", clearCookieOptions);
  res.json({ message: "Logged out" });
});

module.exports = router;
