import { errorToast, successToast } from "app/data/toastsTemplates"
import { db } from "app/firebase/fire"
import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { deleteDB, getRandomDocID, setDB, updateDB } from "./CrudDB"
import { deleteMultipleStorageFiles, uploadMultipleFilesToFireStorage } from "./storageServices"

export const getEmployeeByID = (orgID, employeeID, setEmployee) => {
  const employeeRef = collection(db, 'organizations', orgID, 'employees', employeeID)
  const q = query(employeeRef)
  onSnapshot(q, snapshot => {
    setEmployee(snapshot.docs.map(doc => doc.data()))
  })
}

export const getYearEmployeesByOrgID = (orgID, year, setEmployees, lim) => {
  const employeeRef = collection(db, 'organizations', orgID, 'employees')
  const q = query(
    employeeRef, 
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
  const employeeRef = collection(db, 'organizations', orgID, 'employees')
  const q = query(
    employeeRef, 
    where('dateJoined', '>=', new Date(year, month, 0)), 
    where('dateJoined', '<=', new Date(year, month, 31)), 
    orderBy('dateJoined', 'desc'), limit(lim)
  )
  onSnapshot(q, snapshot => {
    setEmployees(snapshot.docs.map(doc => doc.data()))
  })
}

export const getEmployeesByOrgID = (orgID, setEmployees, lim) => {
  const employeeRef = collection(db, 'organizations', orgID, 'employees')
  const q = query(
    employeeRef, 
    orderBy('dateJoined', 'desc'), 
    limit(lim)
  )
  onSnapshot(q, snapshot => {
    setEmployees(snapshot.docs.map(doc => doc.data()))
  })
}

export const createEmployeeService = (orgID, uploadedImg, employee, setToasts, setLoading) => {
  setLoading(true)
  const storagePath = `organizations/${orgID}/employees`
  const storageDocID = getRandomDocID(storagePath)
  const employeeStoragePath = `${storagePath}/${storageDocID}`
  return uploadMultipleFilesToFireStorage(uploadedImg ? [uploadedImg.file] : null, employeeStoragePath, ['photo-url'])
    .then(fileURLS => {
      const path = `organizations/${orgID}/employees`
      const docID = getRandomDocID(path)
      return setDB(path, docID, {
        ...employee,
        orgID,
        employeeID: docID,
        dateCreated: new Date(),
        photoURL: fileURLS[0]?.downloadURL || null
      })
        .then(() => {
          return docID
        })
    })
    .catch(err => {
      console.log(err)
      setToasts(errorToast("There was an error creating the employee. Please try again."))
      setLoading(false)
    })
}

export const updateEmployeeService = (orgID, uploadedImg, employeeID, updatedProps, setLoading, setToasts) => {
  const employeeStoragePath = `organizations/${orgID}/employees/${employeeID}`
  const employeePath = `organizations/${orgID}/employees`
  return uploadMultipleFilesToFireStorage(uploadedImg ? [uploadedImg.file] : null, employeeStoragePath, ['photo-url'])
    .then(fileURLS => {
      return updateDB(employeePath, employeeID, {
        ...updatedProps,
        photoURL: fileURLS[0]?.downloadURL || updatedProps.photoURL,
      })
      .then(() => {
        setLoading(false)
        setToasts(successToast("Employee updated successfully."))
      })
    })
    .catch(err => {
      setLoading(false)
      setToasts(errorToast('An error occured while updating the contact. Please try again.'))
      console.log(err)
    })
}

export const deleteEmployeeService = (orgID, employeeID, setLoading, setToasts) => {
  setLoading(true)
  return deleteDB(`organizations/${orgID}/employees`, employeeID)
    .then(() => {
      return deleteMultipleStorageFiles(`organizations/${orgID}/employees/${employeeID}`, ['photo-url'])
    })
    .then(() => {
      setLoading(false)
      setToasts(successToast("Employee deleted successfully."))
    })
    .catch(err => {
      setLoading(false)
      setToasts(errorToast("There was an error deleting the employee. Please try again."))
      console.log(err)
    })
}
