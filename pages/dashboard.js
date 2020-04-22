import { useContext } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

import StripeContext from '../contexts/Stripe'
import StripeAuthButton from '../components/StripeAuthButton'
import CheckoutForm from '../components/CheckoutForm'

const Dashboard = () => {
  const {
    fetchingStripeAccountId,
    stripeAccountId,
    userId
  } = useContext(StripeContext)
  const stripePromise = loadStripe(process.env.STRIPE_PUBLIC)

  const renderStripe = () => {
    if (fetchingStripeAccountId) return

    if (stripeAccountId) {
      return (
        <div className='shadow payment-box'>
          <Elements stripe={stripePromise}>
            <CheckoutForm/>
          </Elements>
        </div>
      )
    } else {
      return <StripeAuthButton userId={userId}/>
    }
  }

  return (
    <div className='dashboard-layout'>
      <h2 className='dashboard-layout__page-title'>ダッシュボード</h2>
      {renderStripe()}
    </div>
  )
}

export default Dashboard
