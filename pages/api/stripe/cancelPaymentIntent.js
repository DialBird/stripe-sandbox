import stripe from '../../../config/stripe'

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405)
    res.end()
    return
  }
  const { paymentMethodId, stripeAccountId } = req.body
  const result = await stripe.paymentMethods.detach(paymentMethodId, { stripeAccount: stripeAccountId })

  res.status(200)
  res.end(JSON.stringify(result))
}
