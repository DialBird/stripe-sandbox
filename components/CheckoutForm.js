import { useContext, useState } from 'react'
import {
  CardElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import axios from 'axios'

import StripeContext from '../contexts/Stripe'

const CheckoutForm = () => {
  const { stripeAccountId, userId, userName } = useContext(StripeContext)
  const [amount, setAmount] = useState(0)
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
        capture_method: 'automatic',
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

    if (error) {
      console.log(error)
    } else if (paymentIntent.status === "succeeded") {
      alert('決済完了')
    } else {
      alert(paymentIntent)
    }
  }

  return (
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

export default CheckoutForm
