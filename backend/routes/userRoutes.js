import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import { findBestMatch } from '../utils/faceMatch.js';
import User from '../model/User.js';

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Face matching route
router.post("/face-match", async (req, res) => {
  try {
    const { descriptor } = req.body;
    
    // Get all users from database (excluding password)
    const users = await User.find({}, { password: 0 });
    
    // Find the best match
    const result = findBestMatch(descriptor, users);
    
    if (result.match) {
      const { password, ...safeUserData } = result.match.toObject();
      res.json({
        found: true,
        user: safeUserData,
        confidence: 1 - result.distance
      });
    } else {
      res.json({
        found: false,
        message: "No matching user found"
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
