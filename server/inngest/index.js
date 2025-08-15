import { Inngest } from "inngest";
import User from "../models/User.js";
import Connection from "../models/Connection.js";
import sendEmail from "../config/nodemailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "Social-2025",eventKey: process.env.INNGEST_EVENT_KEY,
    signingKey: process.env.INNGEST_SIGNING_KEY });

const syncUserCreation = inngest.createFunction(
    {id: 'sync-user-from-clerk'},
    {event: 'clerk/user.created'},
    async ({event})=>{
        try {
        console.log("Event payload:", JSON.stringify(event, null, 2));
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        let username = email_addresses[0].email_address

        const user = await User.findOne({username})

        if(user){
            username = username + Math.floor(Math.random() * 10000)
        }

        const userData = {
            _id : id,
            email : email_addresses[0].email_address,
            full_name : first_name + " " + last_name,
            profile_picture : image_url,
            username
        }
        await User.create(userData)    
        } catch (error) {
            console.log('inngest errorr',error.message)
        }
        
    }
)


const syncUserUpdation = inngest.createFunction(
    {id: 'update-user-from-clerk'},
    {event: 'clerk/user.updated'},
    async ({event})=>{
        try {
        console.log("Event payload:", JSON.stringify(event, null, 2));

        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const updateUserData = {
            email : email_addresses[0].email_address,
            full_name: first_name + " " + last_name,
            profile_picture : image_url,
        }
        await User.findByIdAndUpdate(id, updateUserData)    
        } catch (error) {
            console.log("inngest error", error.message)
        }
        
    }
)

const syncUserDeletion = inngest.createFunction(
    {id: 'delete-user-from-clerk'},
    {event: 'clerk/user.deleted'},
    async ({event})=>{
        try {
        console.log("Event payload:", JSON.stringify(event, null, 2));
        const {id} = event.data
        await User.findByIdAndDelete(id)    
        } catch (error) {
            console.log('inngest error',error.message)
        }
        
    }
)



const sendNewConnectionRequestReminder = inngest.createFunction(
    {id: 'send-new-connection-request-reminder'},
    {event: 'app/connection-request'},
    async({event,step})=>{
        const {connection} = event.data

        await step.run('send-connection-request-email',async()=>{
            const connection = await Connection.findById(connectionId).populate("from_user_id to_user_id")

            const subject = `New connection request`
            const body = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2> Hi ${connection.to_user_id.full_name},</h2>
                <p>You have a new connection request from ${connection.from_user_id.full_name} - 
                @${connection.from_user_id.username}</p>
                <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color:#10b981;"</a> to accept or reject the request </p>
                <br/>
                <p>Thanks,<br/>Stay Connected</p>
            </div>
            `

            await sendEmail({
                to: connection.to_user_id.email,
                subject,
                body
            })
        })

    }
)
// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
    sendNewConnectionRequestReminder
];