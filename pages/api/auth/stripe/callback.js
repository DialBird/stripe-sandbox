import stripe from '../../../../config/stripe'
import { db } from '../../../../config/firebase'

export default async (req, res) => {
  // pass userId as state through API
  const { code, state } = req.query

  const { stripe_user_id } = await stripe.oauth.token({
    grant_type: 'authorization_code',
    code
  })

  db.doc(`users/${state}`).update({stripeAccountId: stripe_user_id})
  res.writeHead(302, { Location: '/dashboard' })
  res.end()
}
