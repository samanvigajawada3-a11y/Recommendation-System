const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getToken = (req) => {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    return header.split(" ")[1];
  }

  return req.cookies?.token;
};

const protect = async (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: "Login required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    next();
  } catch (_error) {
    return res.status(401).json({ message: "Session expired. Please login again." });
  }
};

const optionalAuth = async (req, _res, next) => {
  const token = getToken(req);

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.user = await User.findById(decoded.id).select("-password");
  } catch (_error) {
    req.user = null;
  }

  next();
};

module.exports = { protect, optionalAuth };
