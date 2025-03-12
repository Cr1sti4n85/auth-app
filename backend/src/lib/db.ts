import mongoose from "mongoose";
import { MONGO_URI } from "../config/envConfig";

//IIFE to connect to MongoDB
export default (async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
    process.exit(1);
  }
})();
