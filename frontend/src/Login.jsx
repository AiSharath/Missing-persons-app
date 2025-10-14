import React,{useState} from "react"

function Login(){
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