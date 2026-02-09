const jwt = require("jsonwebtoken");
const authenticate = (req, res, next) => {
  try {
    let jwtToken;
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    jwtToken = authHeader.split(" ")[1];
    if (!jwtToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    jwt.verify(jwtToken, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({ message: "Invalid Token" });
      }
      req.user = user;
    });
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }
    res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};

module.exports = authenticate;
