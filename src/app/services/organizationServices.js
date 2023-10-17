import { db } from "app/firebase/fire"
import { doc, onSnapshot } from "firebase/firestore"
import { firebaseArrayAdd, updateDB } from "./CrudDB"

export const getOrganizationByID = (orgID, setOrg) => {
  const docRef = doc(db, 'organizations', orgID)
  onSnapshot(docRef, snapshot => {
    setOrg(snapshot.data())
  })
}

export const handleJoinOrgService = (joinCode, userID) => {
  return updateDB('users', userID, {
    activeOrgID: joinCode
  })
  .then(() => {
    return updateDB('organizations', joinCode, {
      employeesIDs: firebaseArrayAdd(userID) 
    })
  })
}