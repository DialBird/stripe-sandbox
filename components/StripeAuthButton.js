const BASE_URL = 'https://connect.stripe.com/oauth/authorize'

const StripeAuthButton = ({userId}) => {
  let url = BASE_URL
  const clientId = 'ca_H8bpyHXORpTHFxQprZet4RoayZpGguXY'
  const redirectTo = 'http://localhost:3000/api/auth/stripe/callback'
  url += `?response_type=code`
  url += `&client_id=${clientId}`
  url += `&redirect_uri=${redirectTo}`
  url += `&state=${userId}`

  return (
    <a href={url}>Stripe認証</a>
  )
}

export default StripeAuthButton
