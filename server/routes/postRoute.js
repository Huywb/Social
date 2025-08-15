import express from 'express'
import {protect} from '../middleware/auth.js'
import { addPost, getPost, likePost } from '../controllers/Post.controller.js'
import { upload } from '../config/multer.js'
const Router = express.Router()


Router.post('/add',upload.array('images',4),protect,addPost)
Router.get('/feed',protect,getPost)
Router.post('/like',protect,likePost)

export default Router