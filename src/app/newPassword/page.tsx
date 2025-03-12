"use client";
import React,{ Suspense,useEffect,useState} from "react";
import {useRouter,useSearchParams} from "next/navigation";
import axios from "axios";

function NewPasswordPage(){
    const router=useRouter();
    const searchParams=useSearchParams();
    const [newPassword,setNewPassword] =useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const [email,setEmail]=useState("");
    const [equal,setEqual]=useState(true);

    useEffect(()=>{
        const emailId=searchParams.get("email");
        if(emailId){
            setEmail(emailId);
        }
    },[searchParams])

    useEffect(()=>{
        if(newPassword===confirmPassword && newPassword.length>7){
            setEqual(false);
        }else{
            setEqual(true);
        }
    },[confirmPassword,newPassword]);

    const onResetPassword=async()=>{
        try{
            const response=await axios.post("/api/users/newPassword",{email,newPassword});
            console.log(response);
            router.push("/login");
        }catch(error:any){
            console.error("Error resetting password: ",error);
        }  
    };
    return(
        <><div>Reset Your Password</div>
        <div>
            <label> New Password : </label>
            <input
            type="password"
            id="newpassword"
            onChange={(e)=>setNewPassword(e.target.value)}>
            </input>
        </div>
        <div>
        <label>Confirm New Password : </label>
        <input
        type="password"
        id="newpassword"
        onChange={(e)=>setConfirmPassword(e.target.value)}>
        </input>
    </div>
    <button 
    disabled={equal}
    onClick={onResetPassword}
    >Reset Password   
    </button></>
    );  
}

function NewPasswordPageWrapper() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <NewPasswordPage />
      </Suspense>
    );
  }
  
  export default NewPasswordPageWrapper;