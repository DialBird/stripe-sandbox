const queryString = require('query-string')

const BASE_URL = 'https://connect.stripe.com/oauth/authorize'

const StripeAuthButton = ({userId}) => {
  const client_id = process.env.STRIPE_CLIENT_ID
  const redirect_uri = `${window.location.origin}/api/auth/stripe/callback`
  const query = {
    response_type: 'code',
    scope: 'read_write',
    client_id,
    redirect_uri,
    state: userId
  }
  const url = `${BASE_URL}?${queryString.stringify(query)}`

  return (
    <a href={url}>Stripe認証</a>
  )
}

export default StripeAuthButton
