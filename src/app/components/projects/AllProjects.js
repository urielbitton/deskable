import React, { useState } from 'react'
import AppButton from "../ui/AppButton"
import { AppInput, AppReactSelect } from "../ui/AppInputs"
import './styles/AllProjects.css'

export default function AllProjects() {

  const [searchString, setSearchString] = useState('')
  const [sortBy, setSortBy] = useState('')

  return (
    <div className="all-projects-page">
      <h3>Projects</h3>
      <div className="toolbar">
        <div className="left">
          <AppInput
            placeholder="Search projects..."
            value={searchString}
            onChange={e => setSearchString(e.target.value)}
            iconright={<i className="fal fa-search" />}
          />
          <AppReactSelect
            label="Sort By"
            options={[]}
            onChange={(option) => setSortBy(option.value)}
            value={sortBy}
            placeholder={
              <h5 className="placeholder">
                {/* <i className={recentTasksSortBySwitch(sortBy).icon} /> */}
                {/* {recentTasksSortBySwitch(sortBy).name} */}
              </h5>
            }
          />
        </div>
        <div className="right">
          <AppButton
            label="New Project"
            url="/projects/new"
            leftIcon="fal fa-plus"
          />
        </div>
      </div>
      <div className="content">

      </div>
      <div className="footer">

      </div>
    </div>
  )
}
