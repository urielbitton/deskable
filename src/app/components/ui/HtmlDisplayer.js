import React from 'react'

export default function HtmlDisplayer({html}) {

  return (
    <p 
      dangerouslySetInnerHTML={{ __html: html }} 
      className="html-displayer"
    />
  )
}
 