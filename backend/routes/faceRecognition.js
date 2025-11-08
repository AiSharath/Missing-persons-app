import express from 'express';
import { findBestMatch } from '../utils/faceMatch.js';
import User from '../model/User.js'; // Assuming you have a User model

const router = express.Router();

router.post('/match', async (req, res) => {
  try {
    const { descriptor } = req.body;
    
    if (!descriptor || !Array.isArray(descriptor) || descriptor.length === 0) {
      return res.status(400).json({ error: "Invalid descriptor provided" });
    }
    
    // Get all Users from database that have face descriptors
    const users = await User.find({ 
      faceDescriptor: { $exists: true, $ne: [], $not: { $size: 0 } }
    });
    
    if (users.length === 0) {
      return res.json({
        found: false,
        message: "No users with face data found in database"
      });
    }
    
    // Find the best match
    const result = findBestMatch(descriptor, users);
    
    if (result.match) {
      // Remove sensitive data before sending
      const userData = {
        _id: result.match._id,
        name: result.match.name,
        email: result.match.email,
        createdAt: result.match.createdAt
      };
      
      res.json({
        found: true,
        user: userData,
        confidence: 1 - result.distance
      });
    } else {
      res.json({
        found: false,
        message: "No matching person found in the database"
      });
    }
  } catch (error) {
    console.error("Face matching error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;