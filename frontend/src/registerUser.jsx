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
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value});
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log(formData);
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
                    />
                    <button>Submit</button>
                </div>
            </form>
        </>
    );
}

export default RegisterUser;