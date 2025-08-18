import fs from 'fs'
import imageKit from '../config/imagekit'
import Story from '../models/Story.js'
import User from '../models/User.js'

// Add user story 
export const addStory = async(req,res)=>{
    try {
        const {userId} = req.auth()
        const {content, media_type, background_color} = req.body
        const media = req.file
        let media_url = ""

        if(media_type == 'image' || media_type == 'video'){
            const fileBuffer = fs.readFileSync(media.path)
            const response = await imageKit.upload({
                file: fileBuffer,
                fileName: media.originalname,       
            })
            media_url = response.url
        }

        const story = await Story.create({
            user: userId,
            content,
            media_type,
            media_url,
            background_color
        })

        res.json({success:true, message:"Add story success"})

        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

