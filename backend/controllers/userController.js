import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, faceDescriptor } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: "User with that email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      faceDescriptor: Array.isArray(faceDescriptor) ? faceDescriptor : [],
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "30d",
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      faceDescriptor: user.faceDescriptor,
      token,
    });
  } catch (err) {
    console.error("registerUser error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "30d",
    });

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      faceDescriptor: user.faceDescriptor,
      token,
    });
  } catch (err) {
    console.error("loginUser error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password -faceDescriptor");
    return res.json(users);
  } catch (err) {
    console.error("getUsers error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};