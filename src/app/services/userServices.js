import { db } from "app/firebase/fire"
import { setDB, updateDB } from "./CrudDB"
import { createNotification } from "./notifServices"
import { uploadMultipleFilesToFireStorage } from "./storageServices"

export const getUserByID = (userID, setUser) => {
  db.collection('users')
    .doc(userID)
    .onSnapshot(snap => {
      setUser(snap.data())
    })
}

export const doGetUserByID = (userID) => {
  return db.collection('users')
    .doc(userID)
    .get()
    .then(snap => {
      return snap.data()
    })
}

export const getNotificationsByUserID = (userID, setNotifs, limit) => {
  db.collection('users')
    .doc(userID)
    .collection('notifications')
    .orderBy('dateCreated', 'desc')
    .limit(limit)
    .onSnapshot(snap => {
      setNotifs(snap.docs.map(doc => doc.data()))
    })
}

export const getUnreadNotificationsByUserID = (userID, setNotifs) => {
  db.collection('users')
    .doc(userID)
    .collection('notifications')
    .where('isRead', '==', false)
    .onSnapshot(snap => {
      setNotifs(snap.docs.map(doc => doc.data()))
    })
}

export const saveAccountInfoService = (userID, data, uploadedImg, contactStoragePath) => {
  return uploadMultipleFilesToFireStorage(uploadedImg ? [uploadedImg.file] : null, contactStoragePath, ['photo-url'])
    .then(imgURL => {
      return updateDB('users', userID, {
        ...data,
        ...(uploadedImg && { photoURL: imgURL[0].downloadURL })
      })
        .catch(err => console.log(err))
    })
} 

export const createUserDocService = (user, res, authMode, setLoading) => {
  const firstName = user?.displayName?.split(' ')[0] || ''
  const lastName = user?.displayName?.split(' ')[1] || ''
  const photoURLPlaceholder = 'https://firebasestorage.googleapis.com/v0/b/familia-app-1f5a8.appspot.com/o/admin%2Fprofile-placeholder.png?alt=media'
  return setDB('users', user.uid, {
    firstName: authMode === 'plain' ? firstName : authMode === 'google' ? res.additionalUserInfo.profile.given_name : res.first_name,
    lastName: authMode === 'plain' ? lastName : authMode === 'google' ? res.additionalUserInfo.profile.family_name : res.last_name,
    email: authMode === 'plain' ? user.email : authMode === 'google' ? res.additionalUserInfo.profile.email : res.email,
    photoURL: authMode === 'facebook' ? res.picture.data.url : photoURLPlaceholder,
    address: '',
    phone: '',
    city: '',
    region: '',
    regionCode: '',
    country: '',
    countryCode: '',
    userID: user.uid,
    dateJoined: new Date(),
    memberType: 'classc',
    title: 'Employee',
    teams: [],
    activeOrgID: null
  })
    .then(() => {
      return createNotification(
        user.uid, 
        'Welcome to Deskable!', 
        "Welcome to Deskable! We're glad you're here. Visit your account to complete your profile information.", 
        'fas fa-house-user', 
        '/my-account',
      )
        .catch(err => {
          console.log(err)
          setLoading(false)
        })
    })
    .catch(err => {
      console.log(err)
      setLoading(false)
    })
}

export const pastUserYearsOptions = (dateJoined) => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear; i <= dateJoined; i++) {
    years.push({
      label: i,
      value: i
    })
  }
  return years
}