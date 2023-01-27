import { errorToast, successToast } from "app/data/toastsTemplates"
import { db } from "app/firebase/fire"
import { removeNullOrUndefined } from "app/utils/generalUtils"
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore"
import { deleteDB, firebaseArrayAdd, firebaseArrayRemove, getRandomDocID, setDB, updateDB } from "./CrudDB"
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
        dateCreated: new Date(),
        isEdited: false,
        postText: message,
        postID: docID,
        likes: [],
        saved: [],
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

export const updateOrgPostService = (orgID, postID, message, files, uploadedImgs, deletedFiles, setLoading, setToasts) => {
  setLoading(true)
  const postStoragePath = `organizations/${orgID}/posts/${postID}/files`
  const deletedFilesFiltered = files.filter(file => !deletedFiles.find(name => name === file.name))
  uploadMultipleFilesToFireStorage(uploadedImgs.length > 0 ? removeNullOrUndefined(uploadedImgs.map(img => img.file)) : null, postStoragePath, null)
    .then(res => {
      const postsPath = `organizations/${orgID}/posts`
      return updateDB(postsPath, postID, {
        dateModified: new Date(),
        isEdited: true,
        postText: message,
        ...(deletedFiles.length > 0 && {
          files: deletedFilesFiltered
        }),
        ...(res.length > 0 && {
          files: [
            ...deletedFilesFiltered,
            ...res.map((file) => ({
              url: file.downloadURL,
              name: file.filename,
              type: file.file.type,
              size: file.file.size
            }))
          ]
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

export const addPostLikeService = (userID, orgID, postID, setToasts) => {
  return updateDB(`organizations/${orgID}/posts`, postID, {
    likes: firebaseArrayAdd(userID)
  })
  .catch(err => {
    console.log(err)
    setToasts(errorToast("Error liking post. Please try again later.")) 
  })
}

export const removePostLikeService = (userID, orgID, postID, setToasts) => {
  return updateDB(`organizations/${orgID}/posts`, postID, {
    likes: firebaseArrayRemove(userID)
  })
  .catch(err => {
    console.log(err)
    setToasts(errorToast("Error unliking post. Please try again later.")) 
  })
}

export const addPostSavedService = (userID, orgID, postID, setToasts) => {
  return updateDB(`organizations/${orgID}/posts`, postID, {
    saved: firebaseArrayAdd(userID)
  })
  .catch(err => {
    console.log(err)
    setToasts(errorToast("Error saving post. Please try again later.")) 
  })
}

export const removePostSavedService = (userID, orgID, postID, setToasts) => {
  return updateDB(`organizations/${orgID}/posts`, postID, {
    saved: firebaseArrayRemove(userID)
  })
  .catch(err => {
    console.log(err)
    setToasts(errorToast("Error unsaving post. Please try again later.")) 
  })
}