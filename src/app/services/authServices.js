import { auth } from "app/firebase/fire"
import { createUserDocService, doGetUserByID } from "./userServices"
import firebase from "firebase/compat/app"
import { successToast, infoToast, errorToast } from "app/data/toastsTemplates"
import { deleteDB } from "./CrudDB"
import { GithubAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, fetchSignInMethodsForEmail, getRedirectResult, onAuthStateChanged, 
  sendEmailVerification,
  signInWithPopup, signInWithRedirect, updateProfile
} from "firebase/auth"

export const completeRegistrationService = (user, authMode, res, userName, setLoading) => {
  const photoURLPlaceholder = 'https://firebasestorage.googleapis.com/v0/b/your-app.appspot.com/o/placeholder.png?alt=media&token=your-token'
  updateProfile(user, {
    displayName: authMode === 'plain' ? `${userName.firstName} ${userName.lastName}` : authMode === 'google' ? res.additionalUserInfo.profile.name : res.name,
    photoURL: authMode === 'facebook' ? res.picture.data.url : photoURLPlaceholder
  })
  if (authMode !== 'plain') {
    return createUserDocService(user, res, authMode, setLoading)
      .then(() => {
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }
  else {
    const ActionCodeSettings = {
      url: `${process.env.REACT_APP_DOMAIN_URL}/?userID=${user.uid}&firstName=${userName.firstName}&lastName=${userName.lastName}`,
    }
    sendEmailVerification(user, ActionCodeSettings)
      .then(() => {
        console.log('Email verification sent!')
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }
}

export const plainAuthService = (firstName, lastName, email, password, setLoading, setEmailError, setPassError) => {
  const userName = { firstName, lastName }
  setLoading(true)
  return createUserWithEmailAndPassword(auth, email.replaceAll(' ', ''), password.replaceAll(' ', ''))
    .then(() => {
      return onAuthStateChanged(auth, user => {
        if (user) {
          return completeRegistrationService(user, 'plain', null, userName, setLoading)
        }
        else {
          setLoading(false)
        }
      })
    })
    .catch(err => {
      setLoading(false)
      switch (err.code) {
        case "auth/email-already-in-use":
          setEmailError('This email address is already in use.'); break;
        case "auth/invalid-email":
          setEmailError('Please enter a valid email address.'); break;
        case "auth/weak-password":
          setPassError('The password is not long enough or too easy to guess.'); break
        default: setEmailError('An error occurred. Please try again.')
      }
    })
}

export const googleAuthService = (setMyUser, setLoading, setToasts) => {
  setLoading(true)
  const provider = new GoogleAuthProvider() 
  provider.addScope('email')
  return signInWithRedirect(auth, provider)
    .then(() => {
      return getRedirectResult(auth)
        .then((res) => {
          return fetchSignInMethodsForEmail(auth, res.user.email)
            .then((signInMethods) => {
              if (signInMethods.includes(provider.providerId)) {
                doGetUserByID(res.user.uid)
                  .then((user) => {
                    setMyUser(user)
                    return setLoading(false)
                  })
                  .catch((err) => {
                    console.log(err)
                    return setLoading(false)
                  })
              }
              else {
                return completeRegistrationService(res.user, 'google', res, null, setLoading)
                  .then(() => {
                    doGetUserByID(res.user.uid)
                      .then((user) => {
                        setMyUser(user)
                        return setLoading(false)
                      })
                      .catch((err) => {
                        console.log(err)
                        return setLoading(false)
                      })
                    setToasts(successToast('Your account was created successfully. Welcome to MarkAI'))
                  })
              }
            })
        })
        .catch((error) => {
          setLoading(false)
          console.log(error)
          if (error.code === 'auth/account-exists-with-different-credential')
            setToasts(errorToast('You have already signed up with a different provider for that email. Please sign in with that provider.'))
          if (error.code === 'auth/popup-closed-by-user')
            setToasts(errorToast('Popup closed by user. Please try again.'))
          if (error.code === 'auth/popup-blocked')
            setToasts(errorToast('Popup blocked. Please allow popups for this site.'))
          else
            setToasts(errorToast('An errror occurred with the google login. Please try again.'))
          return 'error'
        })
    })
}

export const githubAuthService = (setMyUser, setLoading, setToasts) => {
  setLoading(true)
  const provider = new GithubAuthProvider()
  provider.addScope('read:user')
  return signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GithubAuthProvider.credentialFromResult(result)
      const token = credential.accessToken
      const user = result.user
      setMyUser(user)
      setLoading(false)
      setToasts(successToast('You have successfully logged in.'))
    })
    .catch((error) => {
      setLoading(false)
      console.log(error)
      if (error.code === 'auth/account-exists-with-different-credential')
        setToasts(errorToast('You have already signed up with a different provider for that email. Please sign in with that provider.'))
      if (error.code === 'auth/popup-closed-by-user')
        setToasts(errorToast('Popup closed by user. Please try again.'))
      if (error.code === 'auth/popup-blocked')
        setToasts(errorToast('Popup blocked. Please allow popups for this site.'))
      else
        setToasts(errorToast('An errror occurred with the github login. Please try again.'))
      return 'error'
    })
}

export const createAccountOnLoginService = (loggedInUser, setLoading, setToasts) => {
  return doGetUserByID(loggedInUser.uid)
    .then((user) => {
      if (!user) {
        return createUserDocService(loggedInUser, null, 'plain', setLoading)
      }
      else return setToasts(infoToast('User already exists.'))
    })
}

export const deleteAccountService = (setToasts, setLoading) => {
  setLoading(true)
  return deleteDB('users', auth.currentUser.uid)
    .then(() => {
      auth.currentUser.delete()
        .then(() => {
          setToasts(successToast('Account deleted.'))
          setLoading(false)
        })
        .catch(err => {
          setToasts(infoToast('There was an error deleting your account. Please try again.'))
          console.log(err)
          setLoading(false)
        })
    })
    .catch(err => {
      setLoading(false)
      setToasts(infoToast('There was an error deleting your account. Please try again.'))
      console.log(err)
    })
}