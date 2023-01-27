import PostCard from "app/components/posts/PostCard"
import PostConsole from "app/components/posts/PostConsole"
import AppModal from "app/components/ui/AppModal"
import HelmetTitle from "app/components/ui/HelmetTitle"
import { useOrgPosts } from "app/hooks/postsHooks"
import React, { useState } from 'react'
import './styles/PostsPage.css'

export default function PostsPage() {

  const limitsNum = 10
  const [postsLimit, setPostsLimit] = useState(limitsNum)
  const [showReportModal, setShowReportModal] = useState(false)
  const posts = useOrgPosts(postsLimit)

  const postsList = posts?.map((post, index) => {
    return <PostCard
      key={index}
      post={post}
      setShowReportModal={setShowReportModal}
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
      <AppModal
        showModal={showReportModal}
        setShowModal={setShowReportModal}
        label="Report Post"
        portalClassName="report-post-modal"
      >
        {/* reports go to the org admin, not to system admin */}
      </AppModal>
    </div>
  )
}
