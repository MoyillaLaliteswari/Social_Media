import {mongoose} from "mongoose";

const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    caption:{
        type:String,
        required:[true,"Please provide a caption to the post!"]
    },
    images:[{
        type:String,
        required:true,
    },],
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    likes:{
        type:Number,
        default:0,
    },
    comments: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comment' 
    }],
    createdAt: { 
        type: Date, 
        default: Date.now
    }

},{timestamps:true});

const Post=mongoose.models.Post || mongoose.model("Post",postSchema);
export default Post;