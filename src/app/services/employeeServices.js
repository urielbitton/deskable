import { db } from "app/firebase/fire"
import {
  collection, doc, limit,
  onSnapshot, orderBy, query,
  where
} from "firebase/firestore"
import { doGetUserByID } from "./userServices"

export const getEmployeeByID = (userID, setEmployee) => {
  const employeeRef = doc(db, `users`, userID)
  onSnapshot(employeeRef, snapshot => {
    setEmployee(snapshot.data())
  })
}

export const getEmployeesByOrgID = (userIDs, setEmployees) => {
  const promises = userIDs?.map(userID => doGetUserByID(userID))
  Promise.all(promises)
  .then(users => {
    setEmployees(users)
  })
}

export const getYearEmployeesByOrgID = (orgID, year, setEmployees, lim) => {
  const employeeRef = collection(db, `users`)
  const q = query(
    employeeRef,
    where('activeOrgID', '==', orgID),
    where('dateJoined', '>=', new Date(year, 0, 0)),
    where('dateJoined', '<=', new Date(year, 11, 31)),
    orderBy('dateJoined', 'desc'),
    limit(lim)
  )
  onSnapshot(q, snapshot => {
    setEmployees(snapshot.docs.map(doc => doc.data()))
  })
}

export const getYearAndMonthEmployeesByOrgID = (orgID, year, month, setEmployees, lim) => {
  const employeeRef = collection(db, `users`)
  const q = query(
    employeeRef,
    where('activeOrgID', '==', orgID),
    where('dateJoined', '>=', new Date(year, month, 0)),
    where('dateJoined', '<=', new Date(year, month, 31)),
    orderBy('dateJoined', 'desc'), limit(lim)
  )
  onSnapshot(q, snapshot => {
    setEmployees(snapshot.docs.map(doc => doc.data()))
  })
}

export const createEmployeeService = (orgID, userID, setLoading, setToasts) => {

}

export const updateEmployeeService = (orgID, userID, setLoading, setToasts) => {

}

export const removeEmployeeService = (orgID, userID, setLoading, setToasts) => {
  setLoading(true)

}
