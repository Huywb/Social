import express from 'express'
import {protect} from '../middleware/auth.js'
import { addPost, getPost, likePost } from '../controllers/Post.controller.js'
const Router = express.Router()


Router.post('/add',protect,addPost)
Router.get('/data',protect,getPost)
Router.post('/like',protect,likePost)

export default Router