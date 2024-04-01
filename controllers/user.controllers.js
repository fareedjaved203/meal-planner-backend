import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import sendToken from "../utils/jwtToken.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  if ([email, name, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    email,
  });

  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  const user = await User.create({
    ...req.body,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  const user = await User.findOne({
    email,
  });

  if (!user) {
    return res.status(404).json({ success: false, message: "User Not Found" });
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid User Credentials" });
  }

  sendToken(user, 200, res);
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ success: true, message: "Logout successful" });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    sendToken(user, 200, res, "Access Token Refreshed");
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  try {
    const [key, value] = Object.entries(req.body)[0];
    const user = await User.findOne({ email: key });
    if (!user) {
      throw new ApiError(404, "user not found");
    }
    const resetToken = await user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.RESET_TOKEN_URL}/${resetToken}`;

    const emailData = {
      resetPasswordUrl: resetPasswordUrl,
    };

    const path = require("path");
    const templatePath = path.join(
      __dirname,
      "..",
      "public",
      "views",
      "templates",
      "resetPasswordTemplate.html"
    );
    const emailContent = renderEmailTemplate(templatePath, emailData);

    try {
      await sendEmail({
        email: user.email,
        subject: "Meal Planner Password Recovery",
        html: emailContent,
      });

      res
        .status(200)
        .json(new ApiResponse(200, {}, `email sent to ${user?.email}`));
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      throw new ApiError(401, error?.message || "something went wrong");
    }
  } catch (error) {
    throw new ApiError(401, error?.message || "something went wrong");
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(400, "token expired or invalid");
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res, "Password Reset Successful");
  } catch (error) {
    throw new ApiError(500, error.message || "something went wrong");
  }
});

const userDetails = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -refreshToken"
    );
    if (user) {
      return res
        .status(200)
        .json(new ApiResponse(200, user, "User details fetched"));
    }
  } catch (error) {
    throw new ApiError(500, error.message || "something went wrong");
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  resetPassword,
  forgotPassword,
  generateAccessAndRefreshTokens,
  userDetails,
};
