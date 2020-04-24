import { useContext, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import axios from 'axios'

import StripeContext from '../contexts/Stripe'
import StripeAuthButton from '../components/StripeAuthButton'

const Form = () => {
  const { stripeAccountId, userId, userName } = useContext(StripeContext)
  const [amount, setAmount] = useState(0)
  const [paymentIntentId, setPaymentIntentId] = useState()
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async e => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return
    }

    const clientSecret =
      await axios.post('/api/stripe/createPaymentIntent', {
        amount,
        capture_method: 'manual',
        stripeAccountId,
        userId
      }).then(res => res.data.client_secret)

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: userName,
        }
      }
    })

    // capture_methodをmanual指定しているため、
    // paymentIntent.statusは"requires_capture"になっている

    if (error) {
      console.log(error)
    } else if (paymentIntent.status === "requires_capture") {
      setPaymentIntentId(paymentIntent.id)
    } else {
      console.log(paymentIntent)
    }
  }

  const handleYes = async e => {
    e.preventDefault()
    const res = await axios.post('/api/stripe/capturePaymentIntent', {
      paymentIntentId,
      stripeAccountId
    })
    console.log(res.data)
    setPaymentIntentId(null)
  }

  const handleNo = async e => {
    e.preventDefault()
    const res = await axios.post('/api/stripe/cancelPaymentIntent', {
      paymentIntentId,
      stripeAccountId
    })
    console.log(res.data)
    setPaymentIntentId(null)
  }

  let render
  if (paymentIntentId) {
    render = (
      <div>
        <h3>{amount}円を支払いますか？</h3>
        <button type="submit" className='mt-3 mb-3 w-100 btn btn-success' onClick={handleYes}>はい</button>
        <button type="submit" className='mt-3 mb-3 w-100 btn btn-danger' onClick={handleNo}>いいえ</button>
      </div>
    )
  } else {
    render = (
      <form onSubmit={handleSubmit}>
        <input type="text" className='form-control mb-3' placeholder='値段' onChange={e => setAmount(e.target.value)}/>
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            }
          }}
        />
        <button type="submit" className='mt-3 mb-3 w-100 btn btn-primary' disabled={!stripe}>Pay</button>
      </form>
    )
  }

  return render
}

const confirmPay = () => {
  const {
    fetchingStripeAccountId,
    stripeAccountId,
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
            <Form/>
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

export default confirmPay
