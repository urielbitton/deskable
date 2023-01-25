import { errorToast, successToast } from "app/data/toastsTemplates"
import { db } from "app/firebase/fire"
import { deleteDB, getRandomDocID, setDB, updateDB } from "./CrudDB"
import { deleteMultipleStorageFiles, uploadMultipleFilesToFireStorage } from "./storageServices"

export const getPostsByOrgID = (orgID, setPosts, limit) => {
  db.collection('organizations')
  .doc(orgID)
  .collection('posts')
  .orderBy('dateCreated', 'desc')
  .limit(limit)
  .onSnapshot(snapshot => {
    setPosts(snapshot.docs.map(doc => doc.data()))
  })
}

export const createOrgPostService = (userID, orgID, message, uploadedImgs, setLoading, setToasts) => {
  setLoading(true)
  const postStoragePath = `organizations/${orgID}/posts`
  uploadMultipleFilesToFireStorage(uploadedImgs.length > 0 ? uploadedImgs.map(img => img.file) : null, postStoragePath)
    .then(res => {
      const postsPath = `organizations/${orgID}/posts`
      const docID = getRandomDocID(postsPath)
      return setDB(postsPath, docID, {
        authorID: userID,
        commentsNum: 0,
        likesNum: 0,
        dateCreated: new Date(),
        isEdited: false,
        postText: message,
        postID: docID,
        orgID,
        ...(res && {
          files: res.map((file, i) => ({
            url: file.downloadURL,
            name: file.file.name,
            type: file.file.type,
            size: file.file.size
          }))
        })
      })
    })
    .then(() => {
      setLoading(false)
      setToasts(successToast("Post created successfully!"))
    })
    .catch(err => {
      console.log(err)
      setLoading(false)
      setToasts(errorToast("Error creating post. Please try again later.")) 
    })
}

export const updateOrgPostService = (userID, orgID, postID, message, uploadedImgs, setLoading, setToasts) => {
  setLoading(true)
  const postStoragePath = `organizations/${orgID}/posts`
  uploadMultipleFilesToFireStorage(uploadedImgs.length > 0 ? uploadedImgs.map(img => img.file) : null, postStoragePath)
    .then(res => {
      const postsPath = `organizations/${orgID}/posts/${postID}`
      return updateDB(postsPath, {
        authorID: userID,
        commentsNum: 0,
        likesNum: 0,
        dateCreated: new Date(),
        isEdited: true,
        postText: message,
        postID,
        orgID,
        ...(res && {
          files: res.map((file, i) => ({
            url: file.downloadURL,
            name: file.file.name,
            type: file.file.type,
            size: file.file.size
          }))
        })
      })
    })
    .then(() => {
      setLoading(false)
      setToasts(successToast("Post updated successfully!"))
    })
    .catch(err => {
      console.log(err)
      setLoading(false)
      setToasts(errorToast("Error updating post. Please try again later.")) 
    })
}

export const deleteOrgPostService = (orgID, postID, fileNames, setLoading, setToasts) => {
  setLoading(true)
  const postStoragePath = `organizations/${orgID}/posts`
  return deleteMultipleStorageFiles(postStoragePath, fileNames)
  .then(() => {
    const postsPath = `organizations/${orgID}/posts`
    return deleteDB(postsPath, postID)
  })
  .then(() => {
    setLoading(false)
    setToasts(successToast("Post deleted successfully!"))
  })
  .catch(err => {
    console.log(err)
    setLoading(false)
    setToasts(errorToast("Error deleting post. Please try again later.")) 
  })
}
