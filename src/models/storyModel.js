import {mongoose} from "mongoose";

const StorySchema = new mongoose.Schema({
    author: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'User', 
         required: true
        },
    media: { 
        type: String, 
        required: true 
    },
    mediaType:{
        type:String,
        enum:['image','video'],
        required:true
    },
    expiresAt: { 
        type: Date, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now
    }
  }, { timestamps: true });

const Story=mongoose.models.Story || mongoose.model("Story",StorySchema);
export default Story;
  