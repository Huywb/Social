import React, { useEffect, useState } from 'react'
import { dummyRecentMessagesData } from '../assets/assets'
import {Link} from 'react-router-dom'

const RecentMessage = () => {
    
    const [messages,setMessages] = useState([])
    const fetchRecenMessage = async()=>{
        setMessages(dummyRecentMessagesData)
    }

    useEffect(()=>{
        fetchRecenMessage()
    },[])
 
    return (
    <div className='bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs text-slate-800'>
      <h3 className='font-semibold text-slate-800 mb-4'>Recennt Messages</h3>
      <div className='flex  flex-col max-h-56 overflow-y-scroll no-scrollbar'>
        {
            messages.map((message,index)=>(
                <Link key={index} className='flex items-start gap-2 py-2 hover:bg-slate-100'>
                    <img src={message.from_user_id.profile_picture} alt=""
                    className='w-8 h-8 rounded-full' />
                </Link>
            ))
        }
      </div>
    </div>
  )
}

export default RecentMessage
