import PostCard from "app/components/posts/PostCard"
import PostConsole from "app/components/posts/PostConsole"
import HelmetTitle from "app/components/ui/HelmetTitle"
import { useOrgPosts } from "app/hooks/postsHooks"
import React, { useState } from 'react'
import './styles/PostsPage.css'

export default function PostsPage() {

  const limitsNum = 10
  const [postsLimit, setPostsLimit] = useState(limitsNum)
  const posts = useOrgPosts(postsLimit)

  const postsList = posts?.map((post, index) => {
    return <PostCard
      key={index}
      post={post}
    />
  })

  return (
    <div className="posts-page">
      <HelmetTitle title="Posts" />
      <div className="posts-column">
        <PostConsole
          title="Write a post"
        />
        <div className="posts-list">
          {postsList}
        </div>
      </div>
      <div className="posts-sidebar">

      </div>
    </div>
  )
}
