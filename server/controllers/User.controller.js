import imageKit from "../config/imagekit.js"
import Connection from "../models/Connection.js"
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

{/*Find user on username, email, full_name, location */}
export const findUserData = async(req,res)=>{
    try {
     const {userId} = req.auth()
     const {input} = req.body
     
     const allUsers = await User.find({
        $or: [
            {username: new RegExp(input,"i")},
            {email: new RegExp(input,"i")},
            {full_name: new RegExp(input,"i")},
            {location: new RegExp(input,"i")}
        ]
     })

     const filteredUsers = allUsers.filter(user=>user._id !== userId)

     res.json({success:true, users: filteredUsers})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

{/*Get user followers */}

export const followUser = async(req,res)=>{
    try {
        const {userId} = req.auth()
        const {id} = req.body

        const user = await User.findById(userId)

        if(user.following.includes(id)){
            return res.json({success:false, message:"You are already following this user"})
        }

        user.following.push(id)
        await user.save()

        const toUser = await User.findById(id)
        toUser.followers.push(userId)
        await toUser.save()

        res.json({success:true, message:"You are following this user"})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
        
    }
}

{/*Un following User */}
export const unFollowUser = async(req,res)=>{
    try {
        const {userId} = req.auth()
        const {id} = req.body

        const user = await User.findById(userId)

        user.following = user.following.filter((user)=>user !== id)
        await user.save()

        const toUser = await User.findById(id)
        user.followers = toUser.followers.filter((user)=>user !== userId)
        await user.save()
        
        res.json({success:true, message:"You are unfollowing this user"})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
        
    }
}

{/*Send connection */}
export const sendConnectionRequest = async(req,res)=>{
    try {
        const {userId} = req.auth()
        const {id} = req.body

        const last24Hours = new Date(Date.now() -24*60*80*1000)
        const connectionRequests = await Connection.find({from_user_id : userId,created_at: {$gt: last24Hours}})
        if(connectionRequests.length>=20){
            return res.json({success: false, message: "You have sent more than 20 connection requests in the 24 hour"})
        }
        

        const connection = await Connection.findOne({
            $or: [
                {from_user_id: userId, to_user_id : id},
                {from_user_id: id, to_user_id : userId},
            ]
        })

        if(!connection){
            await Connection.create({
                from_user_id: userId,
                to_user_id: id,
            })

            return res.json({success:true, message:"Connection request sent success"})
        }else if(connection && connection.status === 'accepted'){
            return res.json({success: false,message:"You are already connected with this user"})
        }

        return res.json({success:false, message:"Connect request pending"})
    } catch (error) {
         console.log(error)
        res.json({success:false, message:error.message})
    }
}

{/**Get user connection */}
export const getUserConnection = async(req,res)=>{
    try {
        const {userId} = req.auth()
        const user = await User.findById(userId).populate('connections followers following')

        const connections = user.connections
        const followers = user.followers
        const following = user.following

        const pendingConnections = ((await Connection.find({to_user_id: userId, status: 'pending'}).populate('from_user_id')).map(connection=>connection.from_user_id))
        
        res.json({success:true, connections, followers,following, pendingConnections})
    
    } catch (error) {
         console.log(error)
        res.json({success:false, message:error.message})
    }
}

