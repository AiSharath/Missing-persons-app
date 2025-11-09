import express from 'express';
import { findBestMatch } from '../utils/faceMatch.js';
import User from '../model/User.js';
import MissingPerson from '../model/MissingPerson.js';

const router = express.Router();

router.post('/match', async (req, res) => {
  try {
    const { descriptor } = req.body;
    
    console.log("Face matching request received:", {
      hasDescriptor: !!descriptor,
      descriptorLength: descriptor ? descriptor.length : 0
    });
    
    if (!descriptor || !Array.isArray(descriptor) || descriptor.length === 0) {
      return res.status(400).json({ error: "Invalid descriptor provided" });
    }
    
    // Get all records from both User and MissingPerson collections that have face descriptors
    const [users, missingPersons] = await Promise.all([
      User.find({ 
        faceDescriptor: { $exists: true, $ne: [], $not: { $size: 0 } }
      }),
      MissingPerson.find({ 
        faceDescriptor: { $exists: true, $ne: [], $not: { $size: 0 } }
      })
    ]);
    
    console.log(`Found ${users.length} users and ${missingPersons.length} missing persons with face descriptors`);
    
    // Combine all persons for matching
    const allPersons = [
      ...users.map(u => ({ ...u.toObject(), type: 'user' })),
      ...missingPersons.map(mp => ({ ...mp.toObject(), type: 'missingPerson' }))
    ];
    
    if (allPersons.length === 0) {
      return res.json({
        found: false,
        message: "No persons with face data found in database"
      });
    }
    
    // Find the best match
    const result = findBestMatch(descriptor, allPersons);
    
    console.log("Matching result:", {
      found: !!result.match,
      distance: result.distance,
      threshold: 0.6
    });
    
    if (result.match) {
      // If it's a missing person with status "missing", update it to "found"
      if (result.match.type === 'missingPerson' && result.match.status === 'missing') {
        try {
          await MissingPerson.findByIdAndUpdate(
            result.match._id,
            { status: 'found', updatedAt: new Date() },
            { new: true }
          );
          console.log(`✅ Auto-updated ${result.match.name} status from 'missing' to 'found'`);
        } catch (updateErr) {
          console.error("Error updating status:", updateErr);
          // Continue even if update fails
        }
      }
      
      // Prepare response data based on type
      let personData;
      if (result.match.type === 'user') {
        personData = {
          _id: result.match._id,
          name: result.match.name,
          email: result.match.email,
          type: 'user',
          createdAt: result.match.createdAt
        };
      } else {
        personData = {
          _id: result.match._id,
          name: result.match.name,
          age: result.match.age,
          lastSeen: result.match.lastSeen,
          status: 'found', // Status is now 'found' after update
          type: 'missingPerson',
          createdAt: result.match.createdAt
        };
      }
      
      const confidence = 1 - result.distance;
      console.log(`✅ Match found: ${personData.name} (${(confidence * 100).toFixed(2)}% confidence)`);
      
      res.json({
        found: true,
        person: personData,
        user: personData, // Keep for backward compatibility
        confidence: confidence,
        distance: result.distance,
        statusUpdated: result.match.type === 'missingPerson' && result.match.status === 'missing'
      });
    } else {
      console.log("❌ No match found (best distance:", result.distance, "threshold: 0.6)");
      res.json({
        found: false,
        message: "No matching person found in the database",
        bestDistance: result.distance,
        threshold: 0.6
      });
    }
  } catch (error) {
    console.error("Face matching error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;