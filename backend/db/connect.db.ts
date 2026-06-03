import mongoose from "mongoose";

export default async function connectDB() {
    try{
        const connection = await mongoose.connect(process.env.MONGO_URI!)
        console.log(`Connected to mongoDB: ${connection.connection.host}`)
    } catch (error) {
        console.error(`Error connecting to mongoDB: ${error instanceof Error? error.message: error }`)
        process.exit(1)
    }
}