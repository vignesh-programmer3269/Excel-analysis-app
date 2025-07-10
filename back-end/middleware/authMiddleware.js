const jwtToken = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (request, response, next) => {
  const token = request.header("Authorization").split(" ")[1];

  if (!token) {
    return response
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwtToken.verify(token, process.env.JWT_SECRET);
    request.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    return response.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;
