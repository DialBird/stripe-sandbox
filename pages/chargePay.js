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

const Form = () => {
  const { stripeAccountId } = useContext(StripeContext)
  const [amount, setAmount] = useState(0)
  const [chargeId, setChargeId] = useState()
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async e => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return
    }

    const cardElement = elements.getElement(CardElement)

    const { token } = await stripe.createToken(cardElement)
    const res = await axios.post('/api/stripe/createCharge', {
      amount,
      stripeAccountId,
      tokenId: token.id
    })
    setChargeId(res.data.chargeId)
  }

  const handleYes = async e => {
    e.preventDefault()
    const res = await axios.post('/api/stripe/captureCharge', {
      chargeId,
      stripeAccountId,
    })
    console.log(res.data.charge)
    setChargeId(null)
  }

  const handleNo = e => {
    e.preventDefault()
    setChargeId(null)
  }

  let render
  if (chargeId) {
    render = (
      <div>
        <button className='btn btn-success' onClick={handleYes}>払う</button>
        <button className='btn btn-danger' onClick={handleNo}>払う</button>
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

const ChargePay = () => {
  const {
    fetchingStripeAccountId,
    stripeAccountId,
  } = useContext(StripeContext)

  const renderStripe = () => {
    if (fetchingStripeAccountId) return

    if (stripeAccountId) {
      const stripePromise = loadStripe(process.env.STRIPE_PUBLIC, {stripeAccount: stripeAccountId})
      return (
        <div className='shadow payment-box'>
          <Elements stripe={stripePromise}>
            <Form/>
          </Elements>
        </div>
      )
    } else {
      return <div></div>
    }
  }

  return (
    <div className='dashboard-layout'>
      <h2 className='dashboard-layout__page-title'>Chargeを使った支払い</h2>
      {renderStripe()}
    </div>
  )
}

export default ChargePay
