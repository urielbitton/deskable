import { getPostsByOrgID } from "app/services/postsServices"
import { StoreContext } from "app/store/store"
import { useContext, useEffect, useState } from "react"

export const useOrgPosts = (limit) => {

  const { myOrgID } = useContext(StoreContext)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    getPostsByOrgID(myOrgID, setPosts, limit)
  },[myOrgID, limit])

  return posts
}