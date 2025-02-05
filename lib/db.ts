import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in the .env file");
}

declare global {
  var mongoose: { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null };
}

// Use a cached connection in development to prevent multiple connections
const mongooseCache = global.mongoose || { conn: null, promise: null };
global.mongoose = mongooseCache;  // Assigning the cache to global so other files can access it

export async function connectToDatabase() {
  if (mongooseCache.conn) {
    console.log("Using existing MongoDB connection");
    return mongooseCache.conn;
  }

  if (!mongooseCache.promise) {
    console.log("Connecting to MongoDB...");

    mongooseCache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: true,
      maxPoolSize: 10,
    }).then((mongoose) => {
      console.log("MongoDB Connected Successfully!");
      return mongoose.connection;
    }).catch((err) => {
      console.error("MongoDB Connection Error:", err);
      throw err;
    });
  }

  try {
    mongooseCache.conn = await mongooseCache.promise;
  } catch (error) {
    mongooseCache.promise = null;
    throw error;
  }

  return mongooseCache.conn;
}

// Automatically connect when this file is imported
connectToDatabase();
