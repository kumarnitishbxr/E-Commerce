import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import redisClient from "../config/Redis.js";

const authenticateUser = async (req, res, next) => {
  try {
    // Get refresh token from cookies
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    // Check if the token is blacklisted (logged out)
    const isBlacklisted = await redisClient.get(`blacklist_${refreshToken}`);
    if (isBlacklisted) {
      return res.status(401).json({ message: "Token is invalid or logged out" });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Fetch user from DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user to request object
    req.user = user;

    next(); // pass control to next middleware/controller
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

export default authenticateUser;

