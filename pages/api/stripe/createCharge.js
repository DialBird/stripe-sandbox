import stripe from '../../../config/stripe'

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405)
    res.end()
    return
  }

  const { amount, stripeAccountId, tokenId } = req.body
  // captureをfalseにして、ここでは支払いをキャプチャしない
  const charge = await stripe.charges.create({
    amount,
    currency: 'jpy',
    description: 'Example charge',
    source: tokenId,
    capture: false,
  }, { stripeAccount: stripeAccountId })

  res.status(200)
  res.end(JSON.stringify({chargeId: charge.id}))
}
