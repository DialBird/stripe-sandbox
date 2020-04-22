import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import axios from 'axios'

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC)

const CheckoutForm = ({userId, userName}) => {
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
        userId
      }).then(res => res.data.client_secret)

    const confirmRes = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: userName,
        }
      }
    })

    if (confirmRes.paymentIntent.status === "succeeded") {
      alert('決済完了')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" className='form-control mb-3' placeHolder='値段' onChange={e => setAmount(e.target.value)}/>
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

const StripeForm = ({ userId, userName }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm userId={userId} userName={userName}/>
    </Elements>
  )
}

export default StripeForm
