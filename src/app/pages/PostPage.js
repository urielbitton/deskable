import PostCard from "app/components/posts/PostCard"
import LikesStatsModal from "app/components/ui/LikesStatsModal"
import { useOrgPost } from "app/hooks/postsHooks"
import React, { useState } from 'react'
import { useParams } from "react-router-dom"

export default function PostPage() {

  const postID = useParams().postID
  const post = useOrgPost(postID)
  const [showLikesModal, setShowLikesModal] = useState(false)
  const [likesStats, setLikesStats] = useState(null)
  const [showSavedModal, setShowSavedModal] = useState(false)
  const [savedStats, setSavedStats] = useState(null)

  return post ? (
    <div className="single-post-page">
      <h4>Post</h4>
      <PostCard
        post={post}
        setShowLikesModal={setShowLikesModal}
        setLikesStats={setLikesStats}
        setShowSavedModal={setShowSavedModal}
        setSavedStats={setSavedStats}
        postAlone
        openCommentsDefault
      />
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
  ) : null
}
