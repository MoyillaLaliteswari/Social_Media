"use client";
import React,{useState,useEffect} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ResetPassword(){
    const router=useRouter();
    const [token,setToken]=useState("");
    const [verified,setVerified]=useState(false);
    const [email,setEmail]=useState("");
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState(true);

    useEffect(()=>{
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get("token");
        const emailParam=urlParams.get("id");

        if(urlToken) setToken(urlToken);
        if(emailParam) setEmail(emailParam);

        if(!urlToken || !emailParam){
            setError(true);
            setLoading(false);
        }
    },[])

    useEffect(()=>{
        const resetUser=async()=>{
            try{
                const response=await axios.post("/api/users/resetPassword",{token});
                console.log(response);
                setVerified(true);
                setError(false);
            }catch(err:any){
                setError(true);
                console.log("Reset User Error:",err.response?.data || err.message);
            }finally{
                setLoading(false);
            }
        };
        if(token) resetUser();
    },[token]);

    const onResetPassword=()=>{
        router.push(`/newPassword?email=${encodeURIComponent(email)}`);
    }

    const onRetry=()=>{
        setError(false);
        setLoading(true);
        setToken("");
    }

    return (
        <div>
            {loading?(
                <h1>Verfying...</h1>
            ):verified?(
                <><h1>Email Verified</h1>
                <p>Your email has been successfully verified.</p>
                <button onClick={onResetPassword}>Reset Password
                    </button></>
            ):error?(
                <><h1>Oops, Something went wrong!</h1>
                <p>Please check the link or try again later.</p>
                <button onClick={onRetry}>Retry</button></>
            ):null}
        </div>
    ); 
}

