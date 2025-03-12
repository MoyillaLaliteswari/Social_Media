import React,{useEffect,useState} from "react";
import axios from "axios";

type Story={
    _id:string;
    media:string;
    mediaType:string;
    createdAt:string;
    author:{
        _id:string;
        username:string;
        profileImageURL:string;
    };
};

type StoriesListProps={
    userId:string;
};

const StoriesList:React.FC<StoriesListProps>=({userId})=>{
    const [stories,setStories]=useState<Story[]>([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState<string | null>(null);
    
    return(
        <div className=""></div>
    )
}