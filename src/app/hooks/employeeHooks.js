import { getEmployeeByID, 
  getEmployeesByOrgID, 
  getYearAndMonthEmployeesByOrgID, 
  getYearEmployeesByOrgID } from "app/services/employeeServices"
import { useEffect, useState } from "react"

export const useEmployee = (userID) => {

  const [employee, setEmployee] = useState(null)

  useEffect(() => {
    if (userID) {
      getEmployeeByID(userID, setEmployee)
    }
  }, [userID])

  return employee
}

export function useEmployees(userIDs) {

  const [employees, setEmployees] = useState([])

  useEffect(() => {
    if(userIDs?.length) {
      getEmployeesByOrgID(userIDs, setEmployees)
    }
    else {
      setEmployees([])
    }
  },[userIDs])

  return employees
}

export const useYearMonthOrAllEmployees = (orgID, userIDs, year, month, limit) => {

  const [employees, setEmployees] = useState([])

  useEffect(() => {
    if (orgID || userIDs?.length) {
      if(year !== 'all' && month === 'all') {
        getYearEmployeesByOrgID(orgID, year, setEmployees, limit)
      }
      else if(year !== 'all' && month !== 'all') {
        getYearAndMonthEmployeesByOrgID(orgID, year, month, setEmployees, limit)
      }
      else {
        getEmployeesByOrgID(userIDs, setEmployees)
      }
    }
  }, [orgID, userIDs, year, month, limit])

  return employees
}