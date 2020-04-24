import stripe from '../../../config/stripe'
import { db } from '../../../config/firebase'

// Just Call Only When Signup
export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405)
    res.end()
    return
  }

  const { userId } = req.body

  const customer = await stripe.customers.create()
  await db.doc(`users/${userId}`).update({customerId: customer.id})

  res.status(200)
  res.end()
}
