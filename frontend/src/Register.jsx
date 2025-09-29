import React, { useState } from "react";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    lastSeen: "",
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // TODO: send formData to backend later
  };

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

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
export default Register;
