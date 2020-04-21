import React, {
  createContext,
  useCallback,
  useEffect,
  useState
} from 'react'
import { useRouter } from 'next/router'

import firebase, { db } from '../config/firebase'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthReady, setIsAuthReady] = useState(false)
  const [token, setToken] = useState(null)

  const login = useCallback((email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => router.push('/dashboard'))
      .catch(error => alert(error))
  })

  const signup = useCallback((email, password, name) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        db.collection('users').add({ name, email: user.email })
        router.push('/dashboard')
      })
      .catch(error => alert(error))
  })

  const logout = useCallback(() => {
    firebase.auth().signOut()
      .then(() => router.push('/'))
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
