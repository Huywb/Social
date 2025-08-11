import express from 'express'
import { findUserData, followUser, getUserData, unFollowUser, updateUserData } from '../controllers/User.controller.js'
import {protect} from '../middleware/auth.js'
import { upload } from '../config/multer.js'

const Router = express.Router()


Router.get("/data",protect,getUserData)
Router.post("/update",upload.fields([{name: 'profile', maxCount: 1},{name: 'cover', maxCount: 1}]),protect,updateUserData)
Router.post("/discover",protect,findUserData)
Router.post("/follow",protect,followUser)
Router.post("/unfollow",protect,unFollowUser)

export default Router