import { db } from "app/firebase/fire"
import { collection, onSnapshot, query } from "firebase/firestore"

export const getOrganizationByID = (orgID, setOrg) => {
  const docRef = collection(db, `organizations/${orgID}`)
  const q = query(docRef)
  onSnapshot(q, (snapshot) => {
    setOrg(snapshot.docs.map(doc => doc.data()))
  })
}
