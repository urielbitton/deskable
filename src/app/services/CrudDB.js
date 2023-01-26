import { auth, db } from 'app/firebase/fire'
import { browserSessionPersistence, setPersistence } from "firebase/auth"
import firebase from 'firebase/compat/app'
import { addDoc, collection, deleteDoc, 
  doc, getCountFromServer, query, setDoc, updateDoc } from "firebase/firestore"

export function setDB(path, doc_, value, merge=true) {
  return setDoc(doc(db, path, doc_), value, { merge })
}

export function updateDB(path, doc_, value) {
  return updateDoc(doc(db, path, doc_), value)
}

export function deleteDB(path, doc_) {
  return deleteDoc(doc(db, path, doc_))
}

export const addDB = (path, value) => {
  return addDoc(collection(db, path), value)
}

export const getRandomDocID = (path) => {
  return doc(collection(db, path)).id
}

export const getFireTimeStampFromDate = (date) => {
  return firebase.firestore.Timestamp.fromDate(date)
}

export const firebaseIncrement = (num) => {
  return firebase.firestore.FieldValue.increment(num)
}

export const firebaseArrayAdd = (value) => {
  return firebase.firestore.FieldValue.arrayUnion(value)
}

export const firebaseArrayRemove = (value) => {
  return firebase.firestore.FieldValue.arrayRemove(value)
}

export const getDocsCount = (path) => {
  const docRef = collection(db, path)
  const q = query(docRef)
  return getCountFromServer(q)
  .then((snap) => {
    return snap.data().count
  })
  .catch(err => console.log(err))
}

export const clearAuthState = (checked) => {
  return setPersistence(auth, browserSessionPersistence)
}

export const signOut = (setLoading) => {
  setLoading(true)
  auth.signOut()
  .then(() => {
    setLoading(false)
    window.location.reload()
  })
  .catch(err => {
    console.log(err)
    setLoading(false)
  })
}