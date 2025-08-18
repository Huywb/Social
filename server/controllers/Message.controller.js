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
