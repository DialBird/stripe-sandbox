import React, {
  createContext,
  useCallback,
  useEffect,
  useState
} from 'react'
import { useRouter } from 'next/router'
import { setCookie, destroyCookie } from 'nookies'

import firebase, { db } from '../config/firebase'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthReady, setIsAuthReady] = useState(false)
  const [token, setToken] = useState(null)

  const setUserSession = (userId, userName) => {
    const data = JSON.stringify({userId, userName})
    setCookie(null, 'sesssion', data, {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    })
  }

  const login = useCallback((email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const uid = user.uid
        db.doc(`users/${uid}`).get().then(docSnap => {
          const { name } = docSnap.data()
          setUserSession(uid, name)
          router.push('/dashboard')
        })
      })
      .catch(error => alert(error))
  })

  const signup = useCallback((email, password, name) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        db.doc(`users/${user.uid}`).set({ name, email: user.email })
        setUserSession(user.uid, name)
        router.push('/dashboard')
      })
      .catch(error => alert(error))
  })

  const logout = useCallback(() => {
    firebase.auth().signOut()
      .then(() => {
        destroyCookie(null, 'sesssion')
        router.push('/')
      })
      .catch(error => alert(error))
  })

  useEffect(() => {
    const authListener = firebase.auth().onAuthStateChanged(user => {
      setCurrentUser(user)
      setIsAuthReady(true)
      if (user) {
        user.getIdToken().then(setToken).catch(error => alert(error))
      }
    })
    return authListener
  }, [])

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthReady,
        login,
        logout,
        signup,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
