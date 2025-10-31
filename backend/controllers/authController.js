import jwt from "jsonwebtoken";
import User from "../models/User.js";
import generateToken from "../utils/token.js";
import { sendEmail } from "../utils/mailer.js";
// SIGNUP
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.create({ username, email, password });

    const token = generateToken(user);

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
   
    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Reset URL (frontend should handle this route)
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send email
    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      text: `Click the following link to reset your password: ${resetUrl}`,
      html: `
        <p>Hello ${user.username},</p>
        <p>You requested a password reset. Click below link (valid for 60 minutes):</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you didn’t request this, please ignore this email.</p>
      `,
    });

    res.json({ message: "Reset link sent to your email" });
  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    
    const  {token}  = req.params;
    const { newPassword } = req.body;
   
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Set new password (will be hashed in pre-save hook)
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// GET /auth/me - return current user's profile
export const me = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("username email createdAt");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /auth/me - update current user's basic profile
export const updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email } = req.body;

    const update = {};
    if (username) update.username = username;
    if (email) update.email = email;

    // Enforce uniqueness checks if changing
    if (email) {
      const existing = await User.findOne({ email, _id: { $ne: userId } });
      if (existing) return res.status(400).json({ message: "Email already in use" });
    }
    if (username) {
      const existingU = await User.findOne({ username, _id: { $ne: userId } });
      if (existingU) return res.status(400).json({ message: "Username already in use" });
    }

    const user = await User.findByIdAndUpdate(userId, { $set: update }, { new: true, select: "username email createdAt" });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};