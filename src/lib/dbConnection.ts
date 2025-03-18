import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

let globalCache = global as unknown as { mongoose?: MongooseCache };
if (!globalCache.mongoose) {
  globalCache.mongoose = { conn: null, promise: null };
}

export async function dbConnection(): Promise<mongoose.Connection> {
  if (globalCache.mongoose!.conn) return globalCache.mongoose!.conn;

  if (!globalCache.mongoose!.promise) {
    globalCache.mongoose!.promise = mongoose.connect(MONGODB_URI, {}).then((mongoose) => mongoose.connection);
  }

  globalCache.mongoose!.conn = await globalCache.mongoose!.promise;
  return globalCache.mongoose!.conn;
}

export default dbConnection;
