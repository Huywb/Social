import express from 'express'
import { upload } from '../config/multer'
import { addStory, getStories } from '../controllers/Story.controller'
import { protect } from '../middleware/auth'


const Router = express.Router()


Router.post('/create',upload.single('media'),protect,addStory)
Router.get('/get',protect,getStories)

export default Router