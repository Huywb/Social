import fs from 'fs'
import imageKit from '../config/imagekit'
import Post from '../models/Post.js'
import User from '../models/User'


//Add Post

export const addPost = async(req,res)=>{
    try {
        const {userId} = req.auth()
        const {content,post_type} = req.body
        const images = req.files

        let image_urls = []
        if(images.length){
            image_urls = await Promise.all(
                images.map(async(image)=>{
                    const fileBuffer = fs.readFileSync(image.path)
                    const response = await imageKit.upload({
                        file: fileBuffer,
                        fileName: image.originalname,
                    })

                    const url = imageKit.url({
                        path: response.filePath,
                        transformation: [
                            {quality: 'auto'},
                            {format: 'webp'},
                            {width: '1280'}
                        ]
                    })
                    return url
                })
            )
        }

        await Post.create({
            user: userId,
            content,
            image_urls,
            post_type
        })
        res.json({success:true,message:"Add Post success"})
    } catch (error) {
        console.log(error)
        res.json({sucees:false, message:error.message})
    }
}
