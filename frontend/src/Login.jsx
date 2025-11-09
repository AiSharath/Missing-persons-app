import React,{useState} from "react"
import Navbar from "./components/navbar";
import "./Login.css"

function Login(){
    const [form,setForm]=useState({
        email:"",
        password:""
    })
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange=(e)=>{
        setForm(f=>({...f,[e.target.name]:e.target.value}));
    }
    
    const handleSubmit=async (e)=>{
        e.preventDefault();
        setError("");
        setLoading(true);
        
        try {
            const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
            const res = await fetch(`${API}/api/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }
            
            // Store token and user data
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data));
            
            console.log("Login successful", data);
            alert("Login successful!");
            // Redirect to home or dashboard
            window.location.href = "/";
        } catch (err) {
            console.error("Login error:", err);
            setError(err.message || "Login failed");
            alert(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return(
        <>
        <Navbar />
        <form onSubmit={handleSubmit} className="container-form">
            <div className="form-inside">
                <h2>Login</h2>
                <input
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    onChange={handleChange}
                    value={form.password}
                    required
                />
                {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </div>
        </form>
        </>
    )
}

export default Login;