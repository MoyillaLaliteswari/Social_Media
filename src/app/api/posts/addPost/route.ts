
import { NextRequest,NextResponse } from "next/server";
import Post from "@/src/models/postModel";
import { connect } from "@/src/dbConfig/dbConfig";
import { getDataFromToken } from "@/src/helpers/getDataFromToken";
import multer from "multer";
import {v4 as uuidv4} from "uuid";
import path from "path";
import fs from "fs";

connect();

const upload=multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            const uploadDir=path.join(process.cwd(),"public/uploads");
            if((!fs.existsSync(uploadDir))){
                fs.mkdirSync(uploadDir,{recursive:true});
            }
            cb(null,uploadDir);
        },
        filename:(req,file,cb)=>{
            cb(null,`${uuidv4()}-${file.originalname}`);
        },
    }),
    limits:{fileSize:5*1024*1024},
});
export const config={
    api:{
        bodyParser:false,
    },
}
export async function POST(request:NextRequest){
    return new Promise((resolve,reject)=>{
        upload.single("image")(request as any,{} as any,async(err)=>{
            if(err){
                return resolve(NextResponse.json({error:err.message,status:500}));
            }
            try{
                const req=await request.json();
                const userId=await getDataFromToken(req.token);
                if(!userId){
                    return resolve(NextResponse.json({error:"Unauthorized",status:401}));
                }
                const {title,caption}=req.body;
                const image=`/uploads/${(request as any).file?.filename}`
                if(!title || !caption || !image){
                    return resolve(NextResponse.json({ error: "All fields are required", status: 400 }));
                }
                const post=await Post.create({
                    title,
                    caption,
                    images:image,
                    createdBy:userId,
                });
                return resolve(NextResponse.json({message: "Post added successfully", post, status: 200 }))
            }catch(err:any){
                return resolve(NextResponse.json({ error: err.message, status: 500 }));
            }
        });
    });
    
}