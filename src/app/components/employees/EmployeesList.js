import { employeesIndex } from "app/algolia"
import { useInstantSearch } from "app/hooks/searchHooks"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import AppPagination from "../ui/AppPagination"
import AppTable from "../ui/AppTable"
import EmployeeRow from "./EmployeeRow"

export default function EmployeesList(props) {

  const { setPageLoading } = useContext(StoreContext)
  const { query, filters, setNumOfHits,
    setNumOfPages, pageNum, setPageNum, numOfPages, hitsPerPage, showAll,
    dbEmployees } = props

  const employees = useInstantSearch(
    query,
    employeesIndex,
    filters,
    setNumOfHits,
    setNumOfPages,
    pageNum,
    hitsPerPage,
    setPageLoading,
    showAll
  )

  const employeesList = employees?.map((employee, index) => {
    return (
      <EmployeeRow
        key={index}
        employee={employee}
      />
    )
  })

  const dbEmployeesList = dbEmployees?.map((employee, index) => {
    return (
      <EmployeeRow
        key={index}
        employee={employee}
      />
    )
  })

  return (
    <div className="employees-list">
      <AppTable
        headers={[
          "ID",
          "Name",
          "Email",
          "Phone",
          "Address",
          "City/State",
          "Country",
          "Position",
          "Actions"
        ]}
        rows={query?.length ? employeesList : dbEmployeesList}
      />
      {
        query?.length > 0 &&
        <div className="pagination-section">
          <AppPagination
            pageNum={pageNum}
            setPageNum={setPageNum}
            numOfPages={numOfPages}
            dimensions="30px"
          />
        </div>
      }
    </div>
  )
}
