import React,{useState} from "react"

function Login(){
    return(
        <>
            <div className="form-container">
                <h2>Login</h2>
                <input type="email" placeholder="Enter your email" required/>
                <input type="text" placeholder="Enter your password" required/>
                <button>Login</button>
            </div>
        </>
    )
}

export default Login;