import { db } from "app/firebase/fire"

export const getOrganizationByID = (orgID, setOrg) => {
  return db.collection("organizations")
  .doc(orgID)
  .onSnapshot((doc) => {
    setOrg(doc.data())
  })
}
