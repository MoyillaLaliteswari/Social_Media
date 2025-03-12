import {mongoose} from "mongoose";
const FriendRequestSchema = new mongoose.Schema({
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    receiver: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now
    }
  }, { timestamps: true });

  const FriendRequest=mongoose.models.FriendRequest || mongoose.model("FriendRequest",FriendRequestSchema);
  export default FriendRequest;

  