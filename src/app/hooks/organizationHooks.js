import { getOrganizationByID } from "app/services/organizationServices"
import { useEffect, useState } from "react"

export const useOrganization = (orgID) => {

  const [organization, setOrganization] = useState(null)

  useEffect(() => {
    if (orgID) {
      getOrganizationByID(orgID, setOrganization)
    }
  }, [orgID])

  return organization
}