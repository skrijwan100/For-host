import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
if(!process.env.MONGODB_URI){
   throw new Error(
      "Please Provide MONGOBD_URI in the .env fiele"
   )
}

async function connectDB(){
   try {
      await mongoose.connect(process.env.MONGODB_URI)
      console.log("Connect BD 🙂");
      
   } catch (error) {
      console.log("mongoDb failed",error);
      process.exit(1)
      
   }
}

export default connectDB