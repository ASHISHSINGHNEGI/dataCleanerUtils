// lib/mongoose.ts or utils/db.ts
import mongoose from "mongoose";

// Use a fallback or throw if not defined
const MONGODB_URI = process.env.MONGO_URI;

// 1. Setup the global cache
// In a Node.js environment, 'global' is used to persist state across hot reloads
// or multiple serverless function invocations on the same instance.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// 2. The main connection function
/**
 * Establishes and caches a connection to MongoDB using Mongoose.
 * @returns {Promise<mongoose.Connection>} The active Mongoose connection object.
 */
async function connect() {
  if (!cached) {
    throw new Error("Global mongoose cache is undefined");
  }

  // Check 1: Return cached connection if it exists and is ready
  if (cached.conn && cached.conn.readyState === 1) {
    console.log("🚀 Using cached MongoDB connection");
    return cached.conn;
  }

  // Check 2: If connection exists but is disconnected, reset the cache
  // readyState 0: disconnected
  if (cached.conn && cached.conn.readyState === 0) {
    console.log("🔄 Connection disconnected, resetting cache");
    cached.conn = null;
    cached.promise = null;
  }

  // const dbName = "kovon-nurse-preprod";
  const dbName = process.env.NURSE_DB_NAME;
  if (!dbName) {
    throw new Error("Db name Invalid");
  }

  // Check 3: If no active promise, create a new one
  if (!cached.promise) {
    if (!MONGODB_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    console.log("✨ Creating new MongoDB connection promise");

    // Create the promise and store it in the cache
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName,
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        maxPoolSize: 5, // Limit connection pool
        minPoolSize: 1,
      })
      .then((mongooseInstance) => {
        console.log("✅ Connected to MongoDB");
        // Store the actual connection object on success
        cached.conn = mongooseInstance.connection;
        return mongooseInstance.connection;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        // Reset promise on error to allow future retries
        cached.promise = null;
        throw err;
      });
  }

  // Check 4: Wait for the existing promise to resolve
  console.log("⏳ Awaiting existing MongoDB connection promise");
  return await cached.promise;
}

// 3. The disconnect function (primarily for development/testing)
/**
 * Closes the Mongoose connection and clears the cache.
 * Note: Avoid calling this in serverless functions unless strictly necessary.
 * @returns {Promise<void>}
 */
async function disconnect() {
  if (!cached) {
    return;
  }

  if (cached.conn) {
    await cached.conn.close();
    cached.conn = null;
  }
  cached.promise = null;
  console.log("🛑 Disconnected from MongoDB");
}

export { connect, disconnect };
