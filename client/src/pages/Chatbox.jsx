import React, { useEffect, useRef, useState } from 'react'
import { dummyMessagesData, dummyUserData } from '../assets/assets'
import { ImageIcon, SendHorizonal } from 'lucide-react'

const Chatbox = () => {

  const message = dummyMessagesData
  const [text,setText] = useState('')
  const [image,setImage] = useState(null)
  const [user,setUser] = useState(dummyUserData)

  const messageRef = useRef(null)

  const sendMessage = async()=>{

  }

  useEffect(()=>{
    messageRef.current?.scrollIntoView({behavior: "smooth"})
  },[message])

  return user && (
    <div className='flex flex-col h-screen'>
        <div className='flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-gradient-to-r from-indigo-50 
        to-purple-50 border-b border-gray-300'>
            <img src={user.profile_picture} alt="" className='size-8 rounded-full' />
            <div>
              <p className='font-medium'>{user.full_name}</p>
              <p className='text-sm text-gray-500 -mt-1.5'>@{user.username}</p>
            </div>
        </div>
        <div className='p-5 md:px-10 h-full overflow-y-scroll'>
          <div className='space-y-4 max-w-4xl mx-auto'> 
              {
                message.toSorted((a,b)=> new Date(a.createdAt) - new Date(b.createdAt)).map((data,index)=>(
                  <div key={index} className={`flex flex-col ${data.to_user_id !== user._id ? 'items-start' : 'items-end'}`}>
                    <div className={`p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow
                      ${data.to_user_id !== user._id ? "rounded-bl-none" : "rounded-br-none"}`}>
                        {
                          
                          data.message_type === 'image' && <img src={data.media_url} 
                          className='w-full max-w-sm rounded-lg mb-1' alt=''></img>
                        }
                        <p>{data.text}</p>
                    </div>
                  </div>
                ))
              }
              <div ref={messageRef}>

              </div>
          </div>
        </div>
        
    </div>
  )
}

export default Chatbox
