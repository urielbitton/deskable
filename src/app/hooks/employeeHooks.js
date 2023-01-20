import { getEmployeesByOrgID, getYearAndMonthEmployeesByOrgID, 
  getYearEmployeesByOrgID } from "app/services/employeeServices"
import { useEffect, useState } from "react"

export const useYearMonthOrAllEmployees = (orgID, year, month, limit) => {

  const [employees, setEmployees] = useState([])

  useEffect(() => {
    if (orgID) {
      if(year !== 'all' && month === 'all') {
        getYearEmployeesByOrgID(orgID, year, setEmployees, limit)
      }
      else if(year !== 'all' && month !== 'all') {
        getYearAndMonthEmployeesByOrgID(orgID, year, month, setEmployees, limit)
      }
      else {
        getEmployeesByOrgID(orgID, setEmployees, limit)
      }
    }
  }, [orgID, year, month, limit])

  return employees
}