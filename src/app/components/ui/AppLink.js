import { detectAndUnderlineAllLinksInText } from "app/utils/generalUtils"
import React from 'react'

export default function AppLink({text, className=''}) {
  return (
    <p 
      dangerouslySetInnerHTML={{ __html: detectAndUnderlineAllLinksInText(text) }} 
      className={`app-link ${className}`}
    />
  )
}
