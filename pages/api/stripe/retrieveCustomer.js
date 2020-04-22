import stripe from '../../../config/stripe'
import { db } from '../../../config/firebase'

export default async (req, res) => {
  const { userId } = req.query
  await db.doc(`users/${userId}`).get().then(docSnap => {
    const user = docSnap.data()
    stripe.customers.retrieve(user.customerId, (err, customer) => {
      if (err) {
        console.log('err', err)
      }
      console.log(customer)
    })
  })

  res.status(200)
  res.end()
}
