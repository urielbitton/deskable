import { db } from "app/firebase/fire"

export const getYearEmployeesByOrgID = (orgID, year, setEmployees, limit) => {
  db.collection('organizations')
    .doc(orgID)
    .collection('employees')
    .where('dateJoined', '>=', new Date(year, 0, 1))
    .where('dateJoined', '<=', new Date(year, 11, 31))
    .orderBy('dateJoined', 'desc')
    .limit(limit)
    .onSnapshot(snapshot => {
      setEmployees(snapshot.docs.map(doc => doc.data()))
    })
}

export const getYearAndMonthEmployeesByOrgID = (orgID, year, month, setEmployees, limit) => {
  db.collection('organizations')
    .doc(orgID)
    .collection('employees')
    .where('dateJoined', '>=', new Date(year, month, 0))
    .where('dateJoined', '<=', new Date(year, month, 31))
    .orderBy('dateJoined', 'desc')
    .limit(limit)
    .onSnapshot(snapshot => {
      setEmployees(snapshot.docs.map(doc => doc.data()))
    })
}

export const getEmployeesByOrgID = (orgID, setEmployees, limit) => {
  db.collection('organizations')
    .doc(orgID)
    .collection('employees')
    .orderBy('dateJoined', 'desc')
    .limit(limit)
    .onSnapshot(snapshot => {
      setEmployees(snapshot.docs.map(doc => doc.data()))
    })
}