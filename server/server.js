import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import {inngest,functions} from './inngest/index.js'
import {serve} from 'inngest/express'
import { clerkMiddleware } from '@clerk/express'
import userRouter from './routes/userRoute.js'
import postRouter from './routes/postRoute.js'
import { requireAuth } from '@clerk/express';


const app = express()

await connectDB()

app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())


app.get('/',(req,res)=>{
    res.send('Server is running')
})
console.log('Loaded functions:', functions.length);
console.log("INNGEST_EVENT_KEY:", process.env.INNGEST_EVENT_KEY);
console.log("INNGEST_SIGNING_KEY:", process.env.INNGEST_SIGNING_KEY);


app.use("/api/inngest",(req,res,next)=>{
    console.log("📥 Received request from Inngest:", req.method, req.url, req.headers["user-agent"]);
  next();
},serve({client: inngest, functions}))

app.use("/api/user",userRouter)
app.use("/api/post",postRouter)
app.use("/api/comment",postRouter)
app.use("/api/getP",postRouter)

const PORT = process.env.PORT || 4000

app.listen(PORT,()=>{
    console.log(`Server is running!!!!! ${PORT}`)
})
