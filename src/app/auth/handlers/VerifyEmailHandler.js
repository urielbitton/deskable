import AuthHandlerPage from "app/components/ui/AuthHandlerPage"
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { createUserDocService } from "app/services/userServices"
import { StoreContext } from "app/store/store"
import verifyAccountImg from 'app/assets/images/verify-account.png'
import { errorToast, successToast } from "app/data/toastsTemplates"
import { applyActionCode } from "firebase/auth"
import { auth } from "app/firebase/fire"

export default function VerifyEmailHandler({ oobCode, continueUrl }) {

  const { setPageLoading, setToasts, user } = useContext(StoreContext)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const userID = continueUrl.split('userID=')[1]

  const handleVerifyEmail = (auth, oobCode) => {
    if (!oobCode) return setToasts(errorToast('Invalid action code. Please make sure your email link is valid.'), true)
    setLoading(true)
    applyActionCode(auth, oobCode)
      .then(() => {
        if (user) {
          setToasts(successToast('Your email has been verified. Redirecting to homepage...'))
          createUserDocService(
            user,
            null,
            'plain',
            setPageLoading
          )
            .then(() => {
              setLoading(false)
              navigate('/')
              window.location.reload()
            })
            .catch((error) => {
              console.log(error)
              setLoading(false)
              setToasts(errorToast('Error creating user document. Please try again.'), true)
            })
        }
        else {
          setToasts(successToast('Your email has been verified. You can now log in to your account.'), true)
          navigate(`/login?createAccount=true&userID=${userID}`)
          setLoading(false)
        }
      })
      .catch((error) => {
        console.log(error)
        setToasts(errorToast('The link is invalid or has expired. Please verify your email again.'), true)
      })
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      handleVerifyEmail(auth, oobCode)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    !user ? (
      <AuthHandlerPage
        contentImg={verifyAccountImg}
        title="Account Verified!"
        description="Congratulations! Your account has been verified. You will be redirected to the homepage right away.
       Click the button below if you are not redirected automatically."
        btnLabel="Home"
        onClick={() => navigate('/')}
        loading={loading}
      />)
      :
      <div>
        <h5>Please log out of this account and into your new account to verify your email</h5>
      </div>
  )
}
