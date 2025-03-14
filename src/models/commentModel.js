import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    comment: { 
        type: String, 
        required: true 
    },
    postId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post', 
        required: true 
    },
    createdBy: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'User',
          required: true 
    },
    parentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comment', 
        default: null 
    },
    replies: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comment'
    }],
    likes: { 
        type: Number, 
        default: 0
    },
}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
