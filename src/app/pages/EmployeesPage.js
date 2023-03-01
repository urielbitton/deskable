import AppSelectBar from "app/components/ui/AppSelectBar"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import './styles/EmployeesPage.css'
import noResultsImg from 'app/assets/images/no-results.png'
import HelmetTitle from "app/components/ui/HelmetTitle"
import AppButton from "app/components/ui/AppButton"
import { monthSelectOptions } from "app/data/general"
import EmptyPage from "app/components/ui/EmptyPage"
import EmployeesList from "app/components/employees/EmployeesList"
import { pastUserYearsOptions } from "app/services/userServices"
import { useYearMonthOrAllEmployees } from "app/hooks/employeeHooks"
import { useOrganization } from "app/hooks/organizationHooks"

export default function EmployeesPage() {

  const { myUser, myOrgID } = useContext(StoreContext)
  const [searchString, setSearchString] = useState("")
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [numOfPages, setNumOfPages] = useState(1)
  const [pageNum, setPageNum] = useState(0)
  const [numOfHits, setNumOfHits] = useState(0)
  const [hitsPerPage, setHitsPerPage] = useState(10)
  const [selectedYear, setSelectedYear] = useState('all')
  const [selectedMonth, setSelectedMonth] = useState('all')
  const limitsNum = 10
  const [employeesLimit, setEmployeesLimit] = useState(limitsNum)
  const organization = useOrganization(myOrgID)
  const dbEmployees = useYearMonthOrAllEmployees(myOrgID, organization?.employeesIDs, selectedYear, selectedMonth, employeesLimit)
  const filters = `activeOrgID:${myOrgID}`
  const showAll = false
  const userYearJoined = myUser?.dateJoined?.toDate().getFullYear()

  const labelText1 = query.length > 0 ?
    <>Showing <span className="bold">{hitsPerPage < numOfHits ? hitsPerPage :
      numOfHits}</span> of {numOfHits} invoices</> :
    <>Showing <span className="bold">
      {employeesLimit <= dbEmployees?.length ? employeesLimit : dbEmployees?.length}
    </span> of {dbEmployees?.length} invoices</>

  const executeSearch = (e) => {
    if (e.key === 'Enter') {
      setQuery(searchString)
    }
  }

  const handleOnChange = (e) => {
    if (e.target.value.length < 1) {
      setQuery('')
    }
    setSearchString(e.target.value)
  }

  return (
    <div className="employees-page">
      <HelmetTitle title="Employees" />
      <AppSelectBar
        title="Employees"
        labelText1={labelText1}
        searchQuery={query}
        sortSelectOptions={[
          { value: 'date', label: 'Date Joined' },
          { value: 'name', label: 'Employee Name' },
        ]}
        rightComponent={query.length > 0 && <i className="fas fa-file-search search-mode-icon" />}
        searchValue={searchString}
        searchOnChange={(e) => handleOnChange(e)}
        handleOnKeyPress={(e) => executeSearch(e)}
        showAmountSelect
        amountSelectValue={employeesLimit}
        amountSelectOnChange={(e) => {
          setEmployeesLimit(e.target.value)
          setHitsPerPage(e.target.value)
        }}
        searchPlaceholder="Search Employees"
        yearSelectOptions={[{label: 'All', value: 'all'}, ...pastUserYearsOptions(userYearJoined)]}
        monthSelectOptions={monthSelectOptions}
        yearValue={selectedYear}
        yearOnChange={(e) => setSelectedYear(e.target.value)}
        monthValue={selectedMonth}
        monthOnChange={(e) => setSelectedMonth(e.target.value)}
      />
      {
        dbEmployees?.length > 0 ?
          <div className="employees-content">
            <EmployeesList
              query={query}
              searchResults={searchResults}
              setSearchResults={setSearchResults}
              filters={filters}
              setNumOfHits={setNumOfHits}
              numOfPages={numOfPages}
              setNumOfPages={setNumOfPages}
              pageNum={pageNum}
              setPageNum={setPageNum}
              hitsPerPage={hitsPerPage}
              showAll={showAll}
              dbEmployees={dbEmployees}
            />
            {
              employeesLimit <= dbEmployees?.length && query.length < 1 &&
              <AppButton
                label="Show More"
                onClick={() => setEmployeesLimit(employeesLimit + limitsNum)}
                className="show-more-btn"
              />
            }
            {
              query.length > 0 && searchResults.length === 0 &&
              <div className="no-results">
                <img src={noResultsImg} alt="no results" />
                <h5>No results found.</h5>
              </div>
            }
          </div> :
          <EmptyPage
            label="No Employees found"
            sublabel="Refine your search or create a new employee."
            btnLink="/employees/new"
            btnIcon="fal fa-user-plus"
          />
      }
    </div>
  )
}
