import { useContext } from 'react'
import Link from 'next/link'
import { parseCookies } from 'nookies'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

import StripeContext from '../contexts/Stripe'
import StripeAuthButton from '../components/StripeAuthButton'
import CheckoutForm from '../components/CheckoutForm'

const Dashboard = () => {
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
          <h3>クイック支払い</h3>
          <Elements stripe={stripePromise}>
            <CheckoutForm/>
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
        <Link href='/confirmPay'>
          <a>キャンセル可能支払い</a>
        </Link>
      </div>
    </div>
  )
}

export const getServerSideProps = async ctx => {
  const { res } = ctx
  const { sesssion } = parseCookies(ctx)
  if (!sesssion) {
    res.writeHead(302, { Location: '/' })
    res.end()
  }

  return {
    props: {}
  }
}

export default Dashboard
