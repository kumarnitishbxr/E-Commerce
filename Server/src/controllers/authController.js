import { validate } from "../utils/validate.js";
import User from "../Models/User.js";
import redisClient from "../config/Redis.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sendEmail from "../utils/sendEmail.js";

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
};

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

const RegisterUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const errors = validate({ name, email, password });
        if (errors.length > 0) return res.status(400).json({ errors });

        const exist = await User.findOne({ email });
        if (exist) return res.status(409).json({ message: "Email already registered." });

        const hash = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hash });
        await user.save();

        return res.status(201).json({ message: "Registration successful" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const errors = validate({ email, password });
        if (errors.length > 0) return res.status(400).json({ errors });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        
        const accessToken = createAccessToken({ id: user._id });
        const refreshToken = createRefreshToken({ id: user._id });

        // Store refresh token in Redis
        res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Send response
    res.status(200).json({
        message: "Login successful",
        accessToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const LogoutUser = async (req, res) => {
    try {
        const userId = req.userId;
        const refreshToken = req.refreshToken;

        await redisClient.del(`refresh_${userId}`);

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        return res.status(200).json({ message: "Logout successful" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

const SendVerifyEmail = async (req, res) => {
    try {
      const userId = req.user.id;

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (user.isVerified)
        return res.status(400).json({ message: "Email already verified" });

      const verifyToken = jwt.sign(
        { id: userId },
        process.env.JWT_VERIFY_SECRET,
        { expiresIn: "1h" }
      );

      await redisClient.set(`verify_${userId}`, verifyToken, { EX: 3600 });

      const verifyURL = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;

      await sendEmail({
        to: user.email,
        subject: "Verify Your Email",
        html: `
          <h2>Email Verification</h2>
          <p>Click below to verify your email:</p>
          <a href="${verifyURL}" style="background:#4F46E5;color:white;padding:10px 20px;border-radius:5px;">
            Verify Email
          </a>
          <p>Or copy the link:</p>
          <p>${verifyURL}</p>
        `
      });

      return res.status(200).json({
        message: "Verification email sent",
        verifyURL // remove in production
      });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };

const VerifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const decoded = jwt.verify(token, process.env.JWT_VERIFY_SECRET);

        const storedToken = await redisClient.get(`verify_${decoded.id}`);
        if (!storedToken || storedToken !== token)
          return res.status(400).json({ message: "Invalid or expired token" });

        await User.findByIdAndUpdate(decoded.id, { isVerified: true });
        await redisClient.del(`verify_${decoded.id}`);

        return res.status(200).json({ message: "Email verified successfully" });

    } catch (err) {
        return res.status(400).json({ error: "Invalid or expired token" });
    }
};

const ForgotPass = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Email not registered" });

        const resetToken = jwt.sign(
          { id: user._id },
          process.env.JWT_RESET_SECRET,
          { expiresIn: "15m" }
        );

        await redisClient.set(`reset_${user._id}`, resetToken, { EX: 900 });

        const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        await sendEmail({
          to: email,
          subject: "Password Reset",
          html: `
            <p>Click below to reset your password:</p>
            <a href="${resetURL}">${resetURL}</a>
          `
        });
        // console.log("USER:", process.env.EMAIL_USER);
        // console.log("PASS:", process.env.EMAIL_PASS);


        return res.status(200).json({ message: "Password reset email sent" });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const ResetPass = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);

        const saved = await redisClient.get(`reset_${decoded.id}`);
        if (!saved || saved !== token)
          return res.status(400).json({ message: "Invalid or expired token" });

        const hash = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(decoded.id, { password: hash });
        await redisClient.del(`reset_${decoded.id}`);

        return res.status(200).json({ message: "Password reset successful" });

    } catch (err) {
        return res.status(400).json({ error: "Invalid or expired token" });
    }
};

const RefreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken)
          return res.status(401).json({ message: "Refresh token required" });

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const stored = await redisClient.get(`refresh_${decoded.id}`);
        if (!stored || stored !== refreshToken)
          return res.status(403).json({ message: "Invalid refresh token" });

        const newAccessToken = createAccessToken({ id: decoded.id });
        const newRefreshToken = createRefreshToken({ id: decoded.id });

        await redisClient.set(`refresh_${decoded.id}`, newRefreshToken, {
          EX: 7 * 24 * 60 * 60,
        });

        return res.status(200).json({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });

    } catch (err) {
        return res.status(403).json({ error: "Invalid refresh token" });
    }
};

export {
  RegisterUser,
  LoginUser,
  LogoutUser,
  ForgotPass,
  ResetPass,
  VerifyEmail,
  RefreshToken,
  SendVerifyEmail
};
