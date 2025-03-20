import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
    },
    profileImageURL: {
        type: String,
        default: "/noAvatar.png"
    },
    password: {
        type: String,
        required: [true, "Please provide a password"], 
    },
    bio: {
        type: String,
        default: "",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
    hashedEmail: String,
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        },
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    blockedUser: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    sentRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FriendRequest",
            default: []
        }
    ],
    receivedRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FriendRequest",
            default: []
        }
    ],    
    stories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Story",  // Fixed typo
            default: []
        }
    ]
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
