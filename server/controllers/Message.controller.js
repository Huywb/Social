import fs from 'fs'
import imageKit from '../config/imagekit'
import Message from '../models/Message'



const connections = {}

export const sseController = (req,res)=>{
    const {userId} = req.params

    console.log("New client connected: ",userId)

    res.setHeader("Content-Type","text/event-stream")
    res.setHeader("Cache-Control","no-cache")
    res.setHeader("Connection","keep-alive")
    res.setHeader("Access-Control-Allow-Origin","*")

    connections[userId] = res

    res.write("Log: Connected to SSE stream")

    req.on('close',()=>{
        delete connections[userId]
        console.log("Client dissconected")
    })
}

//Send message
export const sendMessage = async(req,res)=>{
    try {
        const {userId} = req.auth()
        const {to_user_id, text} = req.body
        const image=  req.file

        let media_url = ''
        let message_type = image ? 'image' : 'text'

        if(message_type === 'image'){
            const fileBuffer = fs.readFileSync(image.path)
            const response = await imageKit.upload({
                file : fileBuffer,
                fileName: image.originalname
            })

            media_url = imageKit.url({
                path: response.filePath,
                transformation:[
                    {quality: 'auto'},
                    {format: 'webp'},
                    {width: '1280'}
                ]
            })
        }

        const message = await Message.create({
            from_user_id: userId,
            to_user_id,
            text,
            message_type,
            media_url
        })

        res.json({success:true, message})

        const messageWithUserData = await Message.findById(message._id).populate('from_user_id')

        if(connections[to_user_id]){
            connections[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`)
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}