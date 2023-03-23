import { getAnnoucementsByOrgID, getOrgPostByID, getOrgPostComments, getOrgPostSubComments, getPostsByOrgID } from "app/services/postsServices"
import { StoreContext } from "app/store/store"
import { useContext, useEffect, useState } from "react"

export const useOrgPosts = (limit) => {

  const { myOrgID } = useContext(StoreContext)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    if(myOrgID)
      getPostsByOrgID(myOrgID, setPosts, limit)
  }, [myOrgID, limit])

  return posts
}

export const useOrgPost = (postID) => {

  const { myOrgID } = useContext(StoreContext)
  const [post, setPost] = useState(null)

  useEffect(() => {
    if(myOrgID && postID) {
      getOrgPostByID(myOrgID, postID, setPost)
    }
  }, [myOrgID, postID])

  return post
}

export const useOrgPostComments = (postID, limit) => {

  const { myOrgID } = useContext(StoreContext)
  const [comments, setComments] = useState([])

  useEffect(() => {
    getOrgPostComments(myOrgID, postID, setComments, limit)
  }, [myOrgID, postID, limit])

  return comments
}

export const useOrgPostSubComments = (postID, commentID, limit) => {

  const { myOrgID } = useContext(StoreContext)
  const [subComments, setSubComments] = useState([])

  useEffect(() => {
    getOrgPostSubComments(myOrgID, postID, commentID, setSubComments, limit)
  }, [myOrgID, postID, commentID, limit])

  return subComments
}

export const useOrgAnnouncements = (limit) => {
  
    const { myOrgID } = useContext(StoreContext)
    const [announcements, setAnnouncements] = useState([])
  
    useEffect(() => {
      getAnnoucementsByOrgID(myOrgID, setAnnouncements, limit)
    }, [myOrgID, limit])
  
    return announcements
  }