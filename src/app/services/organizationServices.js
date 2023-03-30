import { db } from "app/firebase/fire"
import { doc, onSnapshot } from "firebase/firestore"

export const getOrganizationByID = (orgID, setOrg) => {
  const docRef = doc(db, 'organizations', orgID)
  onSnapshot(docRef, snapshot => {
    setOrg(snapshot.data())
  })
}
