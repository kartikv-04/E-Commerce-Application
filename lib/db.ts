import mongoose from "mongoose";
import logger from "./logger";


const mongoURI = process.env.MONGO_URI as string;
let isConnected = false;

export const connectDatabase = async (): Promise<typeof mongoose> => {
  try {
    if (!mongoURI) {
      console.error("Mongo URI missing, check your .env file!");
      throw new Error("Missing Mongo URI");
    }

    if (isConnected || mongoose.connection.readyState >= 1) {
      console.log("Using existing MongoDB connection");
      return mongoose;
    }

    const db = await mongoose.connect(mongoURI, { dbName: "ecommerce" });
    isConnected = !!db.connections[0].readyState;
    console.log("Database Connected Successfully");
    console.log(`Database Host: ${mongoose.connection.host}`);
    return db;


  } catch (error: any) {
    console.error({ error, msg: " Database connection failed" });
    throw new Error("Database connection failed");
  }
};
