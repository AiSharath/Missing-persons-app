import express from 'express';
import { findBestMatch } from '../utils/faceMatch.js';
import User from '../model/User.js'; // Assuming you have a User model

const router = express.Router();

router.post('/match', async (req, res) => {
  try {
    const { descriptor } = req.body;
    
    // Get all Users from database
    const User = await User.find({});
    
    // Find the best match
    const result = findBestMatch(descriptor, User);
    
    if (result.match) {
      res.json({
        found: true,
        User: result.match,
        confidence: 1 - result.distance
      });
    } else {
      res.json({
        found: false,
        message: "No matching User found"
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;