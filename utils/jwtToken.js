const sendToken = async (user, statusCode, res) => {
  const token = await user.getJWTToken();

  user.password = null;

  res.status(statusCode).json({
    success: true,
    message: "Welcome To Victor Harris",
    user,
    token,
  });
};

module.exports = sendToken;
