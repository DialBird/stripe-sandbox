import stripe from '../../../config/stripe'
import { db } from '../../../config/firebase'

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405)
    res.end()
    return
  }
  const { amount, stripeAccountId, userId } = req.body

  const user = await db.doc(`users/${userId}`).get().then(docSnap => docSnap.data())

  const result = await stripe.paymentIntents.create({
    amount,
    currency: 'jpy',
    description: '決済',
    metadata: {
      userId,
      email: user.email
    }
  }, { stripeAccount: stripeAccountId })

  res.status(200)
  res.end(JSON.stringify(result))
}
