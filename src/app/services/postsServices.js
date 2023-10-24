import { errorToast, successToast } from "app/data/toastsTemplates"
import { db } from "app/firebase/fire"
import { removeNullOrUndefined } from "app/utils/generalUtils"
import { collection, doc, limit, onSnapshot, orderBy, query } from "firebase/firestore"
import { getFunctions, httpsCallable } from "firebase/functions"
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

export const getOrgPostByID = (orgID, postID, setPost) => {
  const docRef = doc(db, `organizations/${orgID}/posts`, postID)
  onSnapshot(docRef, snapshot => {
    setPost(snapshot.data())
  })
}

export const createOrgPostService = (pathPrefix, userID, orgID, message, uploadedImgs, setLoading, setToasts) => {
  setLoading(true)
  const docID = getRandomDocID(pathPrefix)
  const postStoragePath = `${pathPrefix}/${docID}/files`
  return uploadMultipleFilesToFireStorage(uploadedImgs.length > 0 ? uploadedImgs.map(img => img?.file) : null, postStoragePath, null)
    .then(data => {
      return setDB(pathPrefix, docID, {
        authorID: userID,
        dateCreated: new Date(),
        isEdited: false,
        postText: message,
        postID: docID,
        likes: [],
        saved: [],
        orgID,
        ...(data.length > 0 && {
          files: data.map((file, i) => ({
            url: file.downloadURL,
            name: file.filename,
            type: file.file.type,
            size: file.file.size,
            dateUploaded: new Date(),
            description: ''
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
      setToasts(errorToast("Error creating post. Please try again later.", true))
    })
}

export const updateOrgPostService = (pathPrefix, postID, message, files, uploadedImgs, deletedFiles, setLoading, setToasts) => {
  setLoading(true)
  const orgID = pathPrefix.split('/')[1]
  const storagePath = `${pathPrefix}/${postID}/files`
  const deletedFilesFiltered = files.filter(file => !deletedFiles.find(name => name === file.name))
  uploadMultipleFilesToFireStorage(uploadedImgs.length > 0 ? removeNullOrUndefined(uploadedImgs.map(img => img.file)) : null, storagePath, null)
    .then(data => {
      const postsPath = `organizations/${orgID}/posts`
      return updateDB(postsPath, postID, {
        dateModified: new Date(),
        isEdited: true,
        postText: message,
        ...(deletedFiles.length > 0 && {
          files: deletedFilesFiltered
        }),
        ...(data.length > 0 && {
          files: [
            ...deletedFilesFiltered,
            ...data.map((file) => ({
              url: file.downloadURL,
              name: file.filename,
              type: file.file.type,
              size: file.file.size,
              dateUploaded: new Date(),
              description: ''
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
      setToasts(errorToast("Error updating post. Please try again later.", true))
    })
}

export const deleteOrgPostService = (pathPrefix, postID, setLoading, setToasts) => {
  setLoading(true)
  const orgID = pathPrefix.split('/')[1]
  return httpsCallable(getFunctions(), 'onOrgPostDelete')({ 
    pathPrefix, postID 
  })
    .then(() => {
      setLoading(false)
      setToasts(successToast("Post deleted successfully!"))
    })
    .catch(err => {
      console.log(err)
      setLoading(false)
      setToasts(errorToast("Error deleting post. Please try again later.", true))
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

export const getOrgPostComments = (orgID, postID, setComments, lim) => {
  const docRef = collection(db, `organizations/${orgID}/posts/${postID}/comments`)
  const q = query(
    docRef,
    orderBy('dateCreated', 'desc'),
    limit(lim)
  )
  onSnapshot(q, snapshot => {
    setComments(snapshot.docs.map(doc => doc.data()))
  })
}

export const getOrgPostSubComments = (orgID, postID, commentID, setSubComments, lim) => {
  const docRef = collection(db, `organizations/${orgID}/posts/${postID}/comments/${commentID}/subComments`)
  const q = query(
    docRef,
    orderBy('dateCreated', 'desc'),
    limit(lim)
  )
  onSnapshot(q, snapshot => {
    setSubComments(snapshot.docs.map(doc => doc.data()))
  })
}

export const getAnnoucementsByOrgID = (orgID, setAnnouncements, lim) => {
  const docRef = collection(db, `organizations/${orgID}/announcements`)
  const q = query(
    docRef,
    orderBy('dateCreated', 'desc'),
    limit(lim)
  )
  onSnapshot(q, snapshot => {
    setAnnouncements(snapshot.docs.map(doc => doc.data()))
  })
}

export const createOrgPostCommentService = (userID, orgID, postID, message, uploadedImgs, setLoading, setToasts) => {
  setLoading(true)
  const commentsPath = `organizations/${orgID}/posts/${postID}/comments`
  const docID = getRandomDocID(commentsPath)
  const commentsStoragePath = `organizations/${orgID}/posts/${postID}/comments/${docID}/files`
  return uploadMultipleFilesToFireStorage(uploadedImgs.length > 0 ? removeNullOrUndefined(uploadedImgs.map(img => img.file)) : null, commentsStoragePath, null)
    .then((data) => {
      return setDB(commentsPath, docID, {
        authorID: userID,
        dateCreated: new Date(),
        isEdited: false,
        commentText: message,
        commentID: docID,
        orgID,
        postID,
        likes: [],
        ...(data.length > 0 && {
          file: {
            url: data[0].downloadURL,
            name: data[0].filename,
            type: data[0].file.type,
            size: data[0].file.size,
            dateUploaded: new Date(),
            description: ''
          }
        })
      })
    })
    .then(() => {
      return updateDB(`organizations/${orgID}/posts`, postID, {
        dateUpdated: new Date()
      })
    })
    .then(() => {
      setLoading(false)
    })
    .catch(err => {
      console.log(err)
      setLoading(false)
      setToasts(errorToast("Error creating comment. Please try again later.", true))
    })
}

export const updateOrgPostCommentService = (commentsPath, storagePath, commentID, message, uploadedImgs, setLoading, setToasts) => {
  setLoading(true)
  return uploadMultipleFilesToFireStorage(uploadedImgs.length > 0 ? removeNullOrUndefined(uploadedImgs.map(img => img.file)) : null, storagePath, null)
    .then((data) => {
      return updateDB(commentsPath, commentID, {
        dateModified: new Date(),
        isEdited: true,
        commentText: message,
        ...(uploadedImgs.length > 0 && {
          file: {
            url: data[0].downloadURL,
            name: data[0].filename,
            type: data[0].file.type,
            size: data[0].file.size,
            dateUploaded: new Date(),
            description: ''
          }
        })
      })
    })
    .then(() => {
      setLoading(false)
    })
    .catch(err => {
      console.log(err)
      setLoading(false)
      setToasts(errorToast("Error updating comment. Please try again later.", true))
    })
}

export const createOrgPostSubCommentService = (userID, orgID, postID, commentID, message, uploadedImgs, setLoading, setToasts) => {
  setLoading(true)
  const commentsPath = `organizations/${orgID}/posts/${postID}/comments/${commentID}/subComments`
  const docID = getRandomDocID(commentsPath)
  const commentsStoragePath = `organizations/${orgID}/posts/${postID}/comments/${commentID}/subComments/${docID}/files`
  return uploadMultipleFilesToFireStorage(uploadedImgs.length > 0 ? removeNullOrUndefined(uploadedImgs.map(img => img.file)) : null, commentsStoragePath, null)
    .then((data) => {
      return setDB(commentsPath, docID, {
        authorID: userID,
        dateCreated: new Date(),
        isEdited: false,
        commentText: message,
        commentID,
        subCommentID: docID,
        orgID,
        postID,
        likes: [],
        ...(data.length > 0 && {
          file: {
            url: data[0].downloadURL,
            name: data[0].filename,
            type: data[0].file.type,
            size: data[0].file.size,
            dateUploaded: new Date(),
            description: ''
          }
        })
      })
    })
    .then(() => {
      setLoading(false)
    })
    .catch(err => {
      console.log(err)
      setLoading(false)
      setToasts(errorToast("Error creating comment. Please try again later.", true))
    })
}

export const deleteOrgPostCommentService = (commentsPath, storagePath, commentID, filenames, setLoading, setToasts) => {
  setLoading(true)
  return deleteMultipleStorageFiles(storagePath, filenames)
    .then(() => {
      return deleteDB(commentsPath, commentID)
    })
    .then(() => {
      setToasts(successToast("Comment deleted successfully."))
      setLoading(false)
    })
    .catch(err => {
      console.log(err)
      setLoading(false)
      setToasts(errorToast("Error deleting comment. Please try again later."))
    })
}

export const addPostCommentLikeService = (path, userID, commentID, setToasts) => {
  return updateDB(path, commentID, {
    likes: firebaseArrayAdd(userID)
  })
    .catch(err => {
      console.log(err)
      setToasts(errorToast("Error liking comment. Please try again later."))
    })
}

export const removePostCommentLikeService = (path, userID, commentID, setToasts) => {
  return updateDB(path, commentID, {
    likes: firebaseArrayRemove(userID)
  })
    .catch(err => {
      console.log(err)
      setToasts(errorToast("Error unliking comment. Please try again later."))
    })
}

export const updatePostFileDescriptionService = (path, docID, files, updateFile, description, setToasts) => {
  updateFile.description = description
  return updateDB(path, docID, {
    files
  })
    .then(() => {
      setToasts(successToast("File description updated successfully."))
    })
    .catch(err => {
      console.log(err)
      setToasts(errorToast("Error updating file description. Please try again later."))
    })
}
