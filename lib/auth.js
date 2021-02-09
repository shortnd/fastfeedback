import React, { createContext, useContext, useEffect, useState } from "react";
import firebase from './firebase'

const authContext = createContext()

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext)
}

function useProvideAuth() {
  const [user, setUser] = useState(null)

  const handleUser = (rawUser) => {
    if (rawUser) {
      const user = formatUser()
      setUser(user)
      return user
    } else {
      setUser(null)
      return false
    }
  }

  const signinWithGithub = () => {
    return firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then((response) => {
        setUser(response.user)
        return response.user
      })
  }

  const signout = () => {
    return firebase.auth().signOut().then(() => setUser(null))
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
      }
    })
    return () => unsubscribe()
  }, [])

  return {
    user,
    signinWithGithub,
    signout
  }
}

const formatUser = (user) => {
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    provider: user.providerData[0].provider
  }
}