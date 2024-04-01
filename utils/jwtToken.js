import User from "../models/user.model.js";

import { generateAccessAndRefreshTokens } from "../controllers/user.controllers.js";
import { ApiResponse } from "./ApiResponse.js";

const sendToken = async (user, statusCode = 200, res) => {
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(statusCode)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      success: true,
      message: "User Logged In Successfully",
      user: loggedInUser,
      accessToken,
      refreshToken,
    });
};

export default sendToken;
