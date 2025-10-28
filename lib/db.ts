import mongoose from "mongoose";
import logger from "./logger";

const mongoURI = process.env.MONGO_URI as string;
let isConnected = false;

export const connectDatabase = async (): Promise<typeof mongoose> => {
  if (!mongoURI) {
    logger.error("Mongo URI missing, check your .env file!");
    throw new Error("Missing Mongo URI");
  }

  if (isConnected || mongoose.connection.readyState >= 1) {
    logger.info("Using existing MongoDB connection");
    return mongoose;
  }

  try {
    const db = await mongoose.connect(mongoURI, { dbName: "ecommerce" });
    isConnected = !!db.connections[0].readyState;
    logger.info("✅ Database Connected Successfully");
    logger.info(`Database Host: ${mongoose.connection.host}`);
    return db;
  } catch (error: any) {
    logger.error({ error, msg: "❌ Database connection failed" });
    throw new Error("Database connection failed");
  }
};
