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
    // Only match against missing persons (not found ones) and users
    const [users, missingPersons] = await Promise.all([
      User.find({ 
        faceDescriptor: { $exists: true, $ne: [], $not: { $size: 0 } }
      }),
      MissingPerson.find({ 
        faceDescriptor: { $exists: true, $ne: [], $not: { $size: 0 } },
        status: 'missing' // Only match against missing persons, not found ones
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
      // If it's a missing person, update it to "found"
      let updatedPerson = null;
      if (result.match.type === 'missingPerson') {
        try {
          // Ensure we're updating the status correctly with validation
          updatedPerson = await MissingPerson.findByIdAndUpdate(
            result.match._id,
            { $set: { status: 'found' } },
            { new: true, runValidators: true }
          );
          
          if (!updatedPerson) {
            console.error(`❌ Failed to update person ${result.match._id} - person not found`);
          } else {
            // Verify the update was successful by checking the database
            const verifyPerson = await MissingPerson.findById(result.match._id);
            if (verifyPerson && verifyPerson.status === 'found') {
              console.log(`✅ Auto-updated ${result.match.name} (ID: ${result.match._id}) status from 'missing' to 'found'`);
              console.log(`   Verified: Person status in DB is now: ${verifyPerson.status}`);
            } else {
              console.error(`❌ Status update verification failed - status in DB is: ${verifyPerson ? verifyPerson.status : 'null'}`);
              // Still use the updated person if available
              if (updatedPerson.status === 'found') {
                updatedPerson = verifyPerson || updatedPerson;
              }
            }
          }
        } catch (updateErr) {
          console.error("❌ Error updating status:", updateErr);
          console.error("   Error details:", {
            message: updateErr.message,
            name: updateErr.name,
            stack: updateErr.stack
          });
          // Continue even if update fails, use original match data
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
        // Use updated person data if available, otherwise use original match data
        const personToUse = updatedPerson || result.match;
        personData = {
          _id: personToUse._id,
          name: personToUse.name,
          age: personToUse.age,
          lastSeen: personToUse.lastSeen,
          status: 'found', // Status is now 'found' after update
          type: 'missingPerson',
          createdAt: personToUse.createdAt,
          updatedAt: personToUse.updatedAt
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
        statusUpdated: result.match.type === 'missingPerson' && !!updatedPerson
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