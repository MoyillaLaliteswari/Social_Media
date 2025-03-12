import React,{useState,useEffect} from "react";
import {FiPlus} from "react-icons/fi";
import axios from "axios";
const AddStory=()=>{
    const [media,setMedia]=useState<File | null>(null);
    const [mediaType,setMediaType]=useState<"image" | "video">("image");
    const [uploadStatus,setUploadStatus]=useState<"idle" | "uploading" | "success" | "error">("idle");
    const [profileImage,setProfileImage]=useState<string>("/noAvatar.png");

    useEffect(()=>{
        const fetchUserInfo=async()=>{
            try{
                const res = await fetch("/api/user", { method: "GET", credentials: "include" });
                const data = await res.json();

                if (res.ok && data.data.profileImageURL) {
                    setProfileImage(data.data.profileImageURL);
                }
            }catch(error){
                console.error("Failed to fetcg user Info:",error);
            }
        };
        fetchUserInfo();
    },[]);
    const handleUpload=async()=>{
        if(!media) return alert("Please select a file");
        setUploadStatus("uploading");
        const formData=new FormData();
        formData.append("file",media);
        formData.append("mediaType",mediaType);

        const res=await fetch("/api/stories/upload",{
            method:"POST",
            body:formData,
        });
        if(res.ok){
            setUploadStatus("success");
            alert("Story uploaded!");
        }else{
            setUploadStatus("error");
            alert("Upload failed.Please try again.")
        }
        setMedia(null);
    };
    return (
        <div className="flex flex-col items-center">
            {/* Profile Circle with + Button */}
            <div className="relative">
                <label htmlFor="story-upload" className="cursor-pointer">
                    <div className="w-24 h-24 rounded-full border-4 border-pink-500 overflow-hidden relative">
                        <img 
                            src={profileImage} 
                            alt="Profile" 
                            className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                            <FiPlus className="text-white text-3xl" />
                        </div>
                    </div>
                </label>
                <input 
                    id="story-upload"
                    type="file" 
                    accept="image/*,video/*" 
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            setMedia(file);
                            setMediaType(file.type.startsWith("video") ? "video" : "image");
                            handleUpload();
                        }
                    }} 
                />
            </div>
            
            {/* Caption */}
            <p className="text-sm mt-2 text-gray-600">Add Story</p>

            {/* Upload Status */}
            {uploadStatus === "uploading" && <p className="text-xs text-blue-500">Uploading...</p>}
            {uploadStatus === "success" && <p className="text-xs text-green-500">Story uploaded!</p>}
            {uploadStatus === "error" && <p className="text-xs text-red-500">Upload failed!</p>}
        </div>
    );
};

export default AddStory;