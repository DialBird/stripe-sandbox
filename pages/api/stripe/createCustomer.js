import stripe from '../../../config/stripe'
import { db } from '../../../config/firebase'

export default (req, res) => {
  if (req.method !== 'POST') {
    res.status(405)
    res.end()
    return
  }

  const {
    email,
    name,
    userId,
  } = req.body

  stripe.customers.create({ email, name })
    .then(customer => {
      db.doc(`users/${userId}`).update({
        customerId: customer.id
      })
    })
    .catch(error => alert(error))
  res.status(200)
  res.end()
}
