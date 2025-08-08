import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        mongoose.connection.on("connected",()=> console.log("Database connected"))
        await mongoose.connect(`${process.env.MONGOOSE_DB_URL}/Social_2025`)
    } catch (error) {
        console.log(error.message)
    }
}

export default connectDB