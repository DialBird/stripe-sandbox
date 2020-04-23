import { useContext } from 'react'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

import StripeContext from '../contexts/Stripe'
import StripeAuthButton from '../components/StripeAuthButton'
import CreatePayMethodForm from '../components/createPayMethodForm'

const confirmPay = () => {
  const {
    fetchingStripeAccountId,
    stripeAccountId,
    unlinkStripe,
    userId
  } = useContext(StripeContext)

  const renderStripe = () => {
    if (fetchingStripeAccountId) return

    if (stripeAccountId) {
      const stripePromise = loadStripe(process.env.STRIPE_PUBLIC, {stripeAccount: stripeAccountId})
      return (
        <div className='shadow payment-box'>
          <h3>キャンセル可能支払い</h3>
          <Elements stripe={stripePromise}>
            <CreatePayMethodForm/>
          </Elements>
          <button onClick={unlinkStripe} className='btn btn-link'>連携解除</button>
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
      <div className="link-box">
        <Link href='/dashboard'>
          <a>クイック支払い</a>
        </Link>
      </div>
    </div>
  )
}

export default confirmPay
