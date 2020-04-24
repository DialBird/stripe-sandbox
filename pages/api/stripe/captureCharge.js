import stripe from '../../../config/stripe'

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405)
    res.end()
    return
  }

  const { chargeId, stripeAccountId } = req.body
  const charge = await stripe.charges.capture(chargeId, { stripeAccount: stripeAccountId })

  res.status(200)
  res.end(JSON.stringify({charge}))
}
