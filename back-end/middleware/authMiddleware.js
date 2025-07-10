const jwt = require("jsonwebtoken");

const authenticateUser = (request, response, next) => {
  const authHeader = request.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return response
      .status(401)
      .json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = { id: decoded.userId };
    next();
  } catch (error) {
    return response.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = authenticateUser;
