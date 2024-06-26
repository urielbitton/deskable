import React from 'react'
import { Helmet } from 'react-helmet-async'

export default function HelmetTitle(props) {

  const { title, meta, link, script } = props

  return (
    <Helmet>
      {meta}
      <title>
        {
          title ?
          `${title} | Deskable` :
          'Deskable - All your team tasks in one place'
        }
      </title>
      {link}
      {script}
    </Helmet>
  )
}
