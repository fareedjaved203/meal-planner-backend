const { asyncHandler } = require("./asyncHandler");

const User = require("../models/user.model");

const {
  generateAccessAndRefreshTokens,
} = require("../controllers/user.controllers");

const sendToken = asyncHandler(async (user, statusCode = 200, res, msg) => {
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
    .json(
      new ApiResponse(
        statusCode,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        msg
      )
    );
});

module.exports = sendToken;
