import { errorToast, successToast } from "app/data/toastsTemplates"
import { db } from "app/firebase/fire"
import { removeNullOrUndefined } from "app/utils/generalUtils"
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore"
import { deleteDB, getRandomDocID, setDB, updateDB } from "./CrudDB"
import { deleteMultipleStorageFiles, uploadMultipleFilesToFireStorage } from "./storageServices"

export const getPostsByOrgID = (orgID, setPosts, lim) => {
  const docRef = collection(db, `organizations/${orgID}/posts`)
  const q = query(
    docRef, 
    orderBy('dateCreated', 'desc'), 
    limit(lim)
  )
  onSnapshot(q, snapshot => {
    setPosts(snapshot.docs.map(doc => doc.data()))
  })
}

export const createOrgPostService = (userID, orgID, message, uploadedImgs, setLoading, setToasts) => {
  setLoading(true)
  const postsPath = `organizations/${orgID}/posts`
  const docID = getRandomDocID(postsPath)
  const postStoragePath = `organizations/${orgID}/posts/${docID}/files`
  return uploadMultipleFilesToFireStorage(uploadedImgs.length > 0 ? removeNullOrUndefined(uploadedImgs.map(img => img?.file)) : null, postStoragePath, null)
    .then(data => {
      return setDB(postsPath, docID, {
        authorID: userID,
        commentsNum: 0,
        likesNum: 0,
        dateCreated: new Date(),
        isEdited: false,
        postText: message,
        postID: docID,
        orgID,
        ...(data && {
          files: data.map((file, i) => ({
            url: file.downloadURL,
            name: file.filename,
            type: file.file.type,
            size: file.file.size
          }))
        })
      })
      .catch(err => console.log(err))
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
  const postStoragePath = `organizations/${orgID}/posts/${postID}/files`
  uploadMultipleFilesToFireStorage(uploadedImgs.length > 0 ? removeNullOrUndefined(uploadedImgs.map(img => img.file)) : null, postStoragePath, null)
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
            name: file.filename,
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
  const postStoragePath = `organizations/${orgID}/posts/${postID}/files`
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
