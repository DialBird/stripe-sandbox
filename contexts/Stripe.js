import React, {
  createContext,
  useEffect,
  useState
} from 'react'
import { parseCookies } from 'nookies'

import { db } from '../config/firebase'

const StripeContext = createContext()

export const StripeProvider = ({ children }) => {
  const [fetchingStripeAccountId, setFetchingStripeAccountId] = useState(true)
  const [stripeAccountId, setStripeAccountId] = useState()
  const [userId, setUserId] = useState()
  const [userName, setUserName] = useState()

  useEffect(() => {
    const { sesssion } = parseCookies()
    const { userId, userName } = JSON.parse(sesssion)
    setUserId(userId)
    setUserName(userName)
  }, [])

  useEffect(() => {
    db.doc(`users/${userId}`).get().then(docSnap => {
      if (!docSnap.exists) return
      setStripeAccountId(docSnap.data().stripeAccountId)
      setFetchingStripeAccountId(false)
    })
  }, [userId])

  return (
    <StripeContext.Provider
      value={{
        fetchingStripeAccountId,
        stripeAccountId,
        userId,
        userName,
      }}
    >
      {children}
    </StripeContext.Provider>
  )
}

export default StripeContext
