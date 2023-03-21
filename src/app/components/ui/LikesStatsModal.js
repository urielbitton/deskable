import React, { useContext } from 'react'
import './styles/LikesStatsModal.css'
import Avatar from "./Avatar"
import AppButton from "./AppButton"
import useUser from "app/hooks/userHooks"
import AppModal from "./AppModal"
import { StoreContext } from "app/store/store"

export default function LikesStatsModal(props) {

  const { users, showModal, setShowModal, label, portalClassName,
    actions } = props

  const usersRender = users?.map((userID, i) => {
    return (
      <UserLike
        userID={userID}
        key={i}
      />
    )
  })

  return (
    <AppModal
      showModal={showModal}
      setShowModal={setShowModal}
      label={`${label} (${users?.length})`}
      portalClassName={portalClassName}
      actions={actions}
    >
      <div className="likes-stats">
        {usersRender}
      </div>
    </AppModal>
  )
}

export function UserLike({ userID }) {

  const { myOrgID } = useContext(StoreContext)
  const user = useUser(userID)

  return (
    <div className="like-row">
      <div className="left">
        <Avatar
          src={user?.photoURL}
          dimensions={35}
        />
        <h5>{user?.firstName} {user?.lastName}</h5>
      </div>
      <div className="right">
        <AppButton
          label="View Profile"
          url={`/organizations/${myOrgID}/user/${user?.userID}`}
          buttonType="small"
        />
      </div>
    </div>
  )
}