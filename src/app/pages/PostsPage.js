import PostCard from "app/components/posts/PostCard"
import PostConsole from "app/components/posts/PostConsole"
import AppModal from "app/components/ui/AppModal"
import HelmetTitle from "app/components/ui/HelmetTitle"
import LikesStatsModal from "app/components/ui/LikesStatsModal"
import { useOrgPosts } from "app/hooks/postsHooks"
import React, { useState } from 'react'
import './styles/PostsPage.css'

export default function PostsPage() {

  const limitsNum = 10
  const [postsLimit, setPostsLimit] = useState(limitsNum)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showLikesModal, setShowLikesModal] = useState(false)
  const [likesStats, setLikesStats] = useState([])
  const [showSavedModal, setShowSavedModal] = useState(false)
  const [savedStats, setSavedStats] = useState([])
  const posts = useOrgPosts(postsLimit)

  const postsList = posts?.map((post, index) => {
    return <PostCard
      key={index}
      post={post}
      setShowReportModal={setShowReportModal}
      setLikesStats={setLikesStats}
      setShowLikesModal={setShowLikesModal}
      setShowSavedModal={setShowSavedModal}
      setSavedStats={setSavedStats}
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
      <LikesStatsModal
        showModal={showLikesModal}
        setShowModal={setShowLikesModal}
        users={likesStats}
        label="Likes"
      />
      <LikesStatsModal
        showModal={showSavedModal}
        setShowModal={setShowSavedModal}
        users={savedStats}
        label="Saves"
      />
    </div>
  )
}
