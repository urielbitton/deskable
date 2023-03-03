import { useProjectPages } from "app/hooks/projectsHooks"
import { useDocsCount } from "app/hooks/userHooks"
import React, { useState } from 'react'
import AppButton from "../ui/AppButton"
import ProjectPageCard from "./ProjectPageCard"
import './styles/ProjectPages.css'

export default function ProjectPages({ project }) {


  const limitsNum = 20
  const [pagesLimit, setPagesLimit] = useState(limitsNum)
  const [showCardMenu, setShowCardMenu] = useState(null)
  const pages = useProjectPages(project?.projectID, pagesLimit)
  const pagesPath = `organizations/${project?.orgID}/projects/${project?.projectID}/pages`
  const pagesAmount = useDocsCount(pagesPath)

  const pagesList = pages?.map((page, index) => {
    return <ProjectPageCard
      key={index}
      page={page}
      showCardMenu={showCardMenu}
      setShowCardMenu={setShowCardMenu}
    />
  })

  return (
    <div className="project-pages">
      <div className="titles">
        <h5>Pages</h5>
        <small>Pages are documentation or notes for your projects or project tasks.</small>
      </div>
      <div className="content-flex">
        {pagesList}
        {
          pagesAmount > pagesLimit &&
          <AppButton
            label="Load More"
            buttonType="invertedBtn small"
            onClick={() => setPagesLimit(pagesLimit + limitsNum)}
            className="load-more-text"
          />
        }
      </div>
    </div>
  )
}
