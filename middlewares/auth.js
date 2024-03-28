const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const isAuthenticatedUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return next(new ErrorHandler("Token Not Found", 401));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    return next(new ErrorHandler("Please Login to Access this Page", 401));
  }
};

const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (user) {
      if (!roles.includes(user.role)) {
        return next(
          new ErrorHandler(`You are not allowed to access this resource`, 403)
        );
      }
    }
    next();
  };
};

module.exports = {
  isAuthenticatedUser,
  authorizeRoles,
};
