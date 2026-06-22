const jwt = require("jsonwebtoken");

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "dev_secret", {
    expiresIn: "30d"
  });

module.exports = createToken;
