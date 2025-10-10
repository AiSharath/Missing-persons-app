import {useState} from "react";

function registerUser(){
    
    const [formData,setFormData]=useState(
        {
            name:"",
            email:"",
            password:"",
            confirmPassword:""
        }
    );
    return(
        <>

        </>
    );
}

export default registerUser;