import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Feed from './pages/Feed'
import Login from './pages/Login'
import Chatbox from './pages/Chatbox'
import Connection from './pages/Connection'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import Message from './pages/Message'
import { useUser } from '@clerk/clerk-react'
import Layout from './pages/Layout'
import {Toaster} from 'react-hot-toast'

const App = () => {
  const { user } = useUser()

  return (
    <>
      <Toaster></Toaster>
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Layout></Layout>} >
          <Route index element={<Feed />} />
          <Route path="message" element={<Message />} />
          <Route path="message/:userId" element={<Chatbox />} />
          <Route path="connections" element={<Connection />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
