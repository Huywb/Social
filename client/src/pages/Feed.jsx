import React, { useEffect, useState } from 'react'
import { assets, dummyPostsData } from '../assets/assets'
import Loading from '../components/Loading'
import StoriesBar from '../components/StoriesBar'
import PostCard from '../components/PostCard'
import RecentMessage from '../components/RecentMessage'

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
      <div className='max-xl:hidden sticky top-0'>
        <div className='max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow'>
          <h3 className='text-slate-800 font-semibold'>Sponsored</h3>
          <img src={assets.sponsored_img} className='w-75 h-50 rounded-md' alt="" />
          <p className='text-slate-600'>Email markerting</p>
          <p className='text-slate-400'>Supercharge your markerting with a powerfull</p>
        </div>
        <RecentMessage></RecentMessage>
      </div>
    </div>
  ) : <Loading></Loading>
}

export default Feed
