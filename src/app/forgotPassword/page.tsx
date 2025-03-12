"use client";
import React,{useState} from "react";
import axios from "axios";
export default function ForgotPassword(){
    const [email,setEmail]=useState("");
    const [message,setMessage]=useState("");
    const [error,setError]=useState("");

    const handleForgotPassword=async(e: any)=>{
        e.preventDefault();
        try{
            const response=await axios.post("http://localhost:3000/api/users/forgotPassword",{email});
            setMessage(response.data.message);
        }
        catch(err:any){
            setError(err.response.data.error);
        }
    }
    return(
        <div>
            <h1>Forgot Password</h1>
            <form onSubmit={handleForgotPassword}>
                <label className="email">email</label>
                <input type="email"
                        placeholder="enter your email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                ></input>
                <button type="submit">Send Reset Link</button>
            </form>
            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
        </div>
    )
    
}