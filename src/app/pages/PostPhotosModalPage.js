import PhotosModal from "app/components/ui/PhotosModal"
import { useOrgPost } from "app/hooks/postsHooks"
import React from 'react'
import { useNavigate, useParams } from "react-router-dom"

export default function PostPhotosModalPage() {

  const postID = useParams().postID
  const post = useOrgPost(postID)
  const photos = post?.files?.filter(file => file?.type?.includes("image"))
  const navigate = useNavigate()

  return (
    <PhotosModal
      showModal
      photos={photos}
      onClose={() => navigate(-1)}
    />
  )
}
