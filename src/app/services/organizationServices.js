import { db } from "app/firebase/fire"
import { collection, doc, onSnapshot } from "firebase/firestore"

export const getOrganizationByID = (orgID, setOrg) => {
  const docRef = doc(db, 'organizations', orgID)
  onSnapshot(docRef, snapshot => {
    setOrg(snapshot.data())
  })
}
