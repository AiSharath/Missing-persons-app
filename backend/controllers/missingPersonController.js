import MissingPerson from "../model/MissingPerson.js";

export const registerMissingPerson = async (req, res) => {
  try {
    const { name, age, lastSeen, photo, faceDescriptor } = req.body;
    
    console.log("Received registration request:", { 
      name, 
      age, 
      lastSeen, 
      hasPhoto: !!photo, 
      hasDescriptor: !!faceDescriptor,
      descriptorType: faceDescriptor ? typeof faceDescriptor : "null",
      descriptorIsArray: Array.isArray(faceDescriptor),
      descriptorLength: Array.isArray(faceDescriptor) ? faceDescriptor.length : 0
    });
    
    if (!name || age === undefined || age === null || !lastSeen) {
      return res.status(400).json({ 
        message: "Name, age, and lastSeen are required" 
      });
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum <= 0) {
      return res.status(400).json({ 
        message: "Age must be a valid positive number" 
      });
    }

    // Process face descriptor
    let processedDescriptor = [];
    if (Array.isArray(faceDescriptor) && faceDescriptor.length > 0) {
      processedDescriptor = faceDescriptor;
      console.log(`✅ Face descriptor received: ${processedDescriptor.length} dimensions`);
    } else {
      console.log("⚠️ No face descriptor provided or descriptor is empty");
    }

    const missingPerson = await MissingPerson.create({
      name: name.trim(),
      age: ageNum,
      lastSeen: lastSeen.trim(),
      photo: photo || null,
      faceDescriptor: processedDescriptor,
      status: "missing",
    });

    console.log("Missing person created successfully:", {
      id: missingPerson._id,
      name: missingPerson.name,
      descriptorLength: missingPerson.faceDescriptor.length
    });

    return res.status(201).json({
      _id: missingPerson._id,
      name: missingPerson.name,
      age: missingPerson.age,
      lastSeen: missingPerson.lastSeen,
      photo: missingPerson.photo,
      status: missingPerson.status,
      createdAt: missingPerson.createdAt,
    });
  } catch (err) {
    console.error("registerMissingPerson error:", err);
    return res.status(500).json({ 
      message: err.message || "Server error",
      error: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
  }
};

export const getMissingPersons = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    
    const missingPersons = await MissingPerson.find(query)
      .select("-faceDescriptor")
      .sort({ createdAt: -1 });
    
    return res.json(missingPersons);
  } catch (err) {
    console.error("getMissingPersons error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

export const getMissingPersonById = async (req, res) => {
  try {
    const { id } = req.params;
    const missingPerson = await MissingPerson.findById(id)
      .select("-faceDescriptor");
    
    if (!missingPerson) {
      return res.status(404).json({ message: "Missing person not found" });
    }
    
    return res.json(missingPerson);
  } catch (err) {
    console.error("getMissingPersonById error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

export const updateMissingPersonStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !["missing", "found"].includes(status)) {
      return res.status(400).json({ 
        message: "Status must be either 'missing' or 'found'" 
      });
    }
    
    const missingPerson = await MissingPerson.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select("-faceDescriptor");
    
    if (!missingPerson) {
      return res.status(404).json({ message: "Missing person not found" });
    }
    
    console.log(`✅ Status updated for ${missingPerson.name}: ${status}`);
    
    return res.json({
      _id: missingPerson._id,
      name: missingPerson.name,
      age: missingPerson.age,
      lastSeen: missingPerson.lastSeen,
      photo: missingPerson.photo,
      status: missingPerson.status,
      createdAt: missingPerson.createdAt,
      updatedAt: missingPerson.updatedAt,
    });
  } catch (err) {
    console.error("updateMissingPersonStatus error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

