import PhotosModal from "app/components/ui/PhotosModal"
import { useOrgPost } from "app/hooks/postsHooks"
import React, { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from "react-router-dom"

export default function PostPhotosModalPage() {

  const [searchParams, setSearchParams] = useSearchParams()
  const photoIndex = searchParams.get("index") || 0
  const [slideIndex, setSlideIndex] = useState(+photoIndex)
  const postID = useParams().postID
  const post = useOrgPost(postID)
  const photos = post?.files?.filter(file => file?.type?.includes("image"))
  const navigate = useNavigate()
  const photosDocPath = `organizations/${post?.orgID}/posts`
  const photosNum = photos?.length
  const currentPhoto = photos?.[slideIndex]

  const handlePrevious = () => {
    if(slideIndex > 0) {
      setSlideIndex(slideIndex - 1)
      setSearchParams({ index: (slideIndex - 1).toString() })
    }
  }

  const handleNext = () => {
    if(slideIndex < photosNum - 1) {
      setSlideIndex(slideIndex + 1)
      setSearchParams({ index: (slideIndex + 1).toString() })
    }
  }

  return (
    <PhotosModal
      showModal
      photos={photos}
      onClose={() => navigate('/posts')}
      photosOwnerID={post?.authorID}
      photosDocPath={photosDocPath}
      parentDocID={postID}
      onPrevious={handlePrevious}
      onNext={handleNext}
      photosNum={photosNum}
      currentPhoto={currentPhoto}
      slideIndex={slideIndex}
    />
  )
}
