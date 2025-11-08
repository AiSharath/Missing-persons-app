import React, { useState } from "react";
import "./Register.css";
import { registerUser } from "./registerUser.jsx";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    lastSeen: "",
    photo: null,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Extract face descriptor from photo if available
      let descriptor = null;
      if (formData.photo) {
        try {
          const { getFaceDescriptor } = await import("./extractDescriptor.js");
          descriptor = await getFaceDescriptor(formData.photo);
        } catch (faceErr) {
          console.warn("Face detection failed, continuing without descriptor:", faceErr);
        }
      }

      // For now, this form is for reporting missing persons
      // We'll need to create a separate endpoint for this
      // For now, let's use the user registration as a workaround
      const result = await registerUser({ 
        name: formData.name, 
        email: `${formData.name.replace(/\s+/g, '').toLowerCase()}@missing.local`, 
        password: "temp123", 
        descriptor 
      });
      
      console.log("Missing person reported:", result);
      alert("Missing person report submitted successfully!");
      // Reset form
      setFormData({ name: "", age: "", lastSeen: "", photo: null });
    } catch (err) {
      console.error("Report failed:", err.message || err);
      setError(err.message || "Report submission failed");
      alert(err.message || "Report submission failed");
    } finally {
      setLoading(false);
    }
  }

  return (
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
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            required
          />
        </label>

        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Register"}
        </button>
      </form>
    </div>
  );
}
export default Register;
