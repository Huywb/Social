import express from 'express'
import { acceptConnectionRequest, findUserData, followUser, getUserConnection, getUserData, getUserProfile, sendConnectionRequest, unFollowUser, updateUserData } from '../controllers/User.controller.js'
import {protect} from '../middleware/auth.js'
import { upload } from '../config/multer.js'

const Router = express.Router()


Router.get("/data",protect,getUserData)
Router.post("/update",upload.fields([{name: 'profile', maxCount: 1},{name: 'cover', maxCount: 1}]),protect,updateUserData)
Router.post("/discover",protect,findUserData)
Router.post("/follow",protect,followUser)
Router.post("/unfollow",protect,unFollowUser)
Router.post("/connect",protect,sendConnectionRequest)
Router.post("/accept",protect,acceptConnectionRequest)
Router.get("/connections",protect,getUserConnection)
Router.post("/profile",protect,getUserProfile)

export default Router