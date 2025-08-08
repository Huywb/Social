import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import {inngest,functions} from './inngest/index.js'
import {serve} from 'inngest/express'

const app = express()

await connectDB()

app.use(express.json())
app.use(cors())

app.get('/',(req,res)=>{
    res.send('Server is running')
})
console.log('Loaded functions:', functions.length);
console.log("INNGEST_EVENT_KEY:", process.env.INNGEST_EVENT_KEY);
console.log("INNGEST_SINGING_KEY:", process.env.INNGEST_SIGNING_KEY);


app.use('/api/inngest',serve({client: inngest, functions}))

const PORT = process.env.PORT || 4000

app.listen(PORT,()=>{
    console.log(`Server is running!!!!! ${PORT}`)
})
