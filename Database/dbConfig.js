import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGODBCONNECTIONSTRING
    );
    console.log("connected to the mongoDB");
    return connection;
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
