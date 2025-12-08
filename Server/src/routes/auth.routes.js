import express from "express";
const authRoute = express.Router();

import authMiddleware from "../middleware/authUsermiddleware.js";

import {
  RegisterUser,
  LoginUser,
  LogoutUser,
  ForgotPass,
  ResetPass,
  VerifyEmail,
  RefreshToken,
  SendVerifyEmail
} from "../controllers/authController.js";

authRoute.post("/register", RegisterUser);
authRoute.post("/login", LoginUser);
authRoute.post("/logout", authMiddleware, LogoutUser);
authRoute.post("/forgot-password", ForgotPass);
authRoute.post("/reset-password/:token", ResetPass);
authRoute.post("/send-verify-email", authMiddleware, SendVerifyEmail);
authRoute.get("/verify-email/:token", VerifyEmail);
authRoute.post("/refresh-token", RefreshToken);

export default authRoute;
