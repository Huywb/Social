import React, { useEffect, useState } from 'react'
import { dummyPostsData } from '../assets/assets'
import Loading from '../components/Loading'
import StoriesBar from '../components/StoriesBar'
import PostCard from '../components/PostCard'

const Feed = () => {
  const [feeds,setFeeds] = useState([])
  const [loading,setLoading] = useState(true)
  const fetchFeeds = async()=>{
    setFeeds(dummyPostsData)
    setLoading(false)
  }

  useEffect(()=>{
    fetchFeeds()
  },[])
  console.log(feeds)
  return !loading ? (
    <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8'>   
      {/*Story and post list */}

      <div>
        <StoriesBar></StoriesBar>
        <div className='p-4 space-y-6'>
        {feeds.map((post)=>(
          <PostCard key={post._id} post={post}></PostCard>
        ))}
        </div>
      </div>
      
      {/*right */}
      <div>
        <div>
          <h1>Sponsored</h1>
        </div>
        <h1>
          Recent messsages
        </h1>
      </div>
    </div>
  ) : <Loading></Loading>
}

export default Feed
