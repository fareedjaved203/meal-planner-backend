import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  logoutUser,
} from "../controllers/user.controllers.js";
import {
  isAuthenticatedUser,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", isAuthenticatedUser, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

export default router;
