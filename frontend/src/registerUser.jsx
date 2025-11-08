import {useState} from "react";
import "./RegisterUser.css"

function RegisterUser(){
    const [formData,setFormData]=useState(
        {
            name:"",
            email:"",
            password:"",
            confirmPassword:""
        }
    );
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value});
    }

    const handleSubmit=async (e)=>{
        e.preventDefault();
        setError("");
        
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        
        setLoading(true);
        
        try {
            const result = await registerUser({ 
                name: formData.name, 
                email: formData.email, 
                password: formData.password 
            });
            
            console.log("Registration successful:", result);
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result));
            alert("Registration successful!");
            window.location.href = "/";
        } catch (err) {
            console.error("Registration error:", err);
            setError(err.message || "Registration failed");
            alert(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    }


    return(
        <>
            <form onSubmit={handleSubmit} className="form-container" >
                <div className="inside-form">
                    <h2>Register</h2>
                    <input 
                        type="text"
                        placeholder="Enter your name"
                        name="name"
                        onChange={handleChange}
                        value={formData.name}
                     />
                    <input 
                        type="email" 
                        placeholder="Enter your email"
                        name="email"
                        onChange={handleChange}
                        value={formData.email}
                    />
                    <input 
                        type="password" 
                        placeholder="Enter your password"
                        name="password"
                        onChange={handleChange}
                        value={formData.password}
                    />
                    <input 
                        type="password"
                        placeholder="Confirm your password"
                        name="confirmPassword"
                        onChange={handleChange}
                        value={formData.confirmPassword}
                        required
                    />
                    {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
                    <button type="submit" disabled={loading}>
                        {loading ? "Registering..." : "Submit"}
                    </button>
                </div>
            </form>
        </>
    );
}

export async function registerUser({ name, email, password, descriptor }) {
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  try {
    const faceDescriptor =
      descriptor == null
        ? undefined
        : Array.isArray(descriptor)
        ? descriptor
        : Array.from(descriptor); // convert Float32Array -> Array

    const payload = { name, email, password };
    if (faceDescriptor && faceDescriptor.length) payload.faceDescriptor = faceDescriptor;

    const res = await fetch(`${API}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = body.message || body.error || JSON.stringify(body);
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }

    return body;
  } catch (err) {
    throw err;
  }
}

export default RegisterUser;