import React, {
  createContext,
  useCallback,
  useEffect,
  useState
} from 'react'
import { parseCookies } from 'nookies'

import firebase, { db } from '../config/firebase'

const StripeContext = createContext()

export const StripeProvider = ({ children }) => {
  const [fetchingStripeAccountId, setFetchingStripeAccountId] = useState(true)
  const [stripeAccountId, setStripeAccountId] = useState()
  const [userId, setUserId] = useState()
  const [userName, setUserName] = useState()

  useEffect(() => {
    const { sesssion } = parseCookies()
    if (!sesssion) return

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

  const unlinkStripe = useCallback(() => {
    db.doc(`users/${userId}`).get().then(docSnap => {
      if (!docSnap.exists) return
      db.doc(`users/${userId}`).update({stripeAccountId: firebase.firestore.FieldValue.delete()})
      setStripeAccountId(null)
    })
  })

  return (
    <StripeContext.Provider
      value={{
        fetchingStripeAccountId,
        stripeAccountId,
        unlinkStripe,
        userId,
        userName,
      }}
    >
      {children}
    </StripeContext.Provider>
  )
}

export default StripeContext
