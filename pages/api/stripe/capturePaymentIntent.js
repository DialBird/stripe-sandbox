import stripe from '../../../config/stripe'

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405)
    res.end()
    return
  }

  const { paymentIntentId, stripeAccountId } = req.body
  const result = await stripe.paymentMethods.capture(paymentIntentId, { stripeAccount: stripeAccountId })

  res.status(200)
  res.end(JSON.stringify(result))
}
