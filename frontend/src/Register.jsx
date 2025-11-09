import React, { useState, useRef, useEffect } from "react";
import Navbar from "./components/navbar";
import "./Register.css";
import { loadFaceModels } from "./faceModelLoader.js";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    lastSeen: "",
    photo: null,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(true);
  const fileInputRef = useRef(null);

  // Load face models on component mount
  useEffect(() => {
    const initializeModels = async () => {
      try {
        setModelsLoading(true);
        setError(""); // Clear any previous errors
        console.log("Loading face recognition models...");
        await loadFaceModels();
        setModelsLoaded(true);
        console.log("✅ Face models loaded successfully");
      } catch (err) {
        console.error("Failed to load face models:", err);
        setModelsLoaded(false);
        // Don't set error state - just log it, form should still work without face recognition
        console.warn("Face recognition will be disabled, but registration will still work");
      } finally {
        setModelsLoading(false);
      }
    };

    initializeModels();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Convert photo to base64 first (required)
      let photoBase64 = null;
      if (formData.photo) {
        photoBase64 = await fileToBase64(formData.photo);
      }

      // Extract face descriptor from photo if available (optional, non-blocking)
      let descriptor = null;
      if (formData.photo && modelsLoaded) {
        try {
          console.log("Extracting face descriptor from photo...");
          const { getFaceDescriptor } = await import("./extractDescriptor.js");
          // Add timeout to prevent hanging
          const descriptorPromise = getFaceDescriptor(formData.photo);
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Face detection timeout")), 10000)
          );
          descriptor = await Promise.race([descriptorPromise, timeoutPromise]);
          
          if (descriptor && Array.isArray(descriptor) && descriptor.length > 0) {
            console.log(`✅ Face descriptor extracted successfully (${descriptor.length} dimensions)`);
          } else {
            console.warn("Face descriptor is empty or invalid");
            descriptor = null;
          }
        } catch (faceErr) {
          console.warn("Face detection failed, continuing without descriptor:", faceErr.message);
          descriptor = null;
          // Continue without descriptor - it's optional
        }
      } else if (formData.photo && !modelsLoaded) {
        console.warn("Face models not loaded, skipping face descriptor extraction");
      }

      // Register missing person
      const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
      
      console.log("Submitting to:", `${API}/api/missing-persons/register`);
      console.log("Payload:", {
        name: formData.name,
        age: formData.age,
        lastSeen: formData.lastSeen,
        hasPhoto: !!photoBase64,
        hasDescriptor: !!descriptor,
        descriptorLength: descriptor ? descriptor.length : 0
      });
      
      let response;
      try {
        response = await fetch(`${API}/api/missing-persons/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            age: formData.age,
            lastSeen: formData.lastSeen,
            photo: photoBase64,
            faceDescriptor: descriptor || null,
          }),
        });
      } catch (networkErr) {
        console.error("Network error:", networkErr);
        throw new Error("Cannot connect to server. Please make sure the backend server is running on port 5000.");
      }

      let result;
      try {
        result = await response.json();
      } catch (parseErr) {
        console.error("Failed to parse response:", parseErr);
        throw new Error("Server returned invalid response. Make sure the backend is running.");
      }

      if (!response.ok) {
        throw new Error(result.message || `Server error: ${response.status}`);
      }
      
      console.log("Missing person reported:", result);
      alert("Missing person report submitted successfully!");
      // Reset form
      setFormData({ name: "", age: "", lastSeen: "", photo: null });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Report failed:", err);
      const errorMessage = err.message || "Report submission failed. Please check if the backend server is running.";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="register-container">
        <h2>Register Missing Person</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Age:
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Last Seen:
          <input
            type="text"
            name="lastSeen"
            value={formData.lastSeen}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Upload Photo:
          <input
            ref={fileInputRef}
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            required
          />
        </label>

        {modelsLoading && (
          <div style={{ color: "blue", marginTop: 8, fontSize: "14px" }}>
            Loading face recognition models...
          </div>
        )}
        {modelsLoaded && !modelsLoading && (
          <div style={{ color: "green", marginTop: 8, fontSize: "14px" }}>
            ✅ Face recognition ready
          </div>
        )}
        {!modelsLoaded && !modelsLoading && (
          <div style={{ color: "orange", marginTop: 8, fontSize: "14px" }}>
            ⚠️ Face recognition models not loaded - face matching will be disabled (registration will still work)
          </div>
        )}
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Register"}
        </button>
      </form>
      </div>
    </>
  );
}
export default Register;
