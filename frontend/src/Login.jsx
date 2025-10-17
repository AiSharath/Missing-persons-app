import React,{useState} from "react"
import "./Login.css"

function Login(){
    const [form,setForm]=useState({
        email:"",
        password:""
    })


    const handleChange=(e)=>{
        setForm(f=>({...f,[e.target.name]:e.target.value}));
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log("Login successfully",form);
    }

    return(
        <>
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
                    type="text"
                    placeholder="Enter your password"
                    name="password"
                    onChange={handleChange}
                    required
                />
                <button>Login</button>
            </div>
        </form>
        </>
    )
}

export default Login;