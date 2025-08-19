import express from 'express'
import { getChatMessages, sendMessage, sseController } from '../controllers/Message.controller'
import { upload } from '../config/multer'
import { protect } from '../middleware/auth'

const Router = express.Router()

Router.get('/:userId',sseController)
Router.post('/send',upload.single('image'),protect,sendMessage)
Router.post('/get',protect,getChatMessages)

export default Router