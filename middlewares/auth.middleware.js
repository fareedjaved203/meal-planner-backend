import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { JWT_SECRET } from "../constants.js";

export const isAuthenticatedUser = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (user) {
      if (!roles.includes(user.role)) {
        return next(
          new ApiError(403, `You are not allowed to access this resource`)
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
