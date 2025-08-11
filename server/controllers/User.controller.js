import imageKit from "../config/imagekit.js"
import User from "../models/User.js"
import fs, { stat } from 'fs'


{/*Get user by ID */}
export const getUserData = async(req,res)=>{

    try {
        const {userId} = req.auth()
        const user = await User.findById(userId)
        if(!user){
           return res.json({success:false,message:"User not found"})
        }
        res.json({success:true,user})
    } catch (error) {
        console.log(error)
        res.json({sucees:false, message:error.message})
    }
}
