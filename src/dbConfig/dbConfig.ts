import mongoose from "mongoose";
let isConnected = false;

export async function connect() {
  try {
    if (isConnected) {
      console.log("MongoDB is already connected");
      return;
    }

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected successfully");
      isConnected = true; 
    });

    connection.on("error", (err) => {
      console.log("MongoDB connection error:", err);
      process.exit(1); 
    });
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

