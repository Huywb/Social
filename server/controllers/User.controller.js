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

{/*Update user */}

export const updateUserData = async(req,res)=>{
    try {
        const {userId} = req.auth()
        let {username,bio,location, full_name} = req.body

        if(!username || !bio || !location || !full_name){
           return res.json({success:false, message:"All fields are required"})
        }

        const user = await User.findById(userId)

        if(user.username !== username){
            const tempUser = await User.findOne({username})
            if(tempUser){
                username = user.username
            }
        }
        if(!user) {
           return res.json({success:false, message:"User not found"})
        }

        const dataUpdate = {
            username,
            bio,
            location,
            full_name
        }

        const profile = req.files.profile && req.files.profile[0]
        const cover = req.files.cover && req.files.cover[0]
        if(profile){
            const buffer = fs.readFileSync(profile.path)
            const response = await imageKit.upload({
                file: buffer,
                fileName: profile.originalname,

            })
            const url = imageKit.url({
                path: response.filePath,
                transformation:[
                    {quality: 'auto'},
                    {format: 'webp'},
                    {width: '512'}
                ]
            })
            dataUpdate.profile_picture = url
        }
        if(cover){
            const buffer = fs.readFileSync(cover.path)
            const response = await imageKit.upload({
                file: buffer,
                fileName: cover.originalname,

            })
            const url = imageKit.url({
                path: response.filePath,
                transformation:[
                    {quality: 'auto'},
                    {format: 'webp'},
                    {width: '1280'}
                ]
            })
            dataUpdate.cover_photo = url
        }

        const updateUser = await User.findByIdAndUpdate(userId,dataUpdate,{new:true})

        res.json({success:true, updateUser,message:"Update user success"})
        
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

