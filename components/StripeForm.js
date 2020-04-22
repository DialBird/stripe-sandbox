import { loadStripe } from '@stripe/stripe-js'
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC)

const CheckoutForm = () => {
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async e => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return
    }

    // Use your card Element with other Stripe.js APIs
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    })
    if (error) {
      console.log('err',error)
    } else {
      console.log(paymentMethod)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
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

const StripeForm = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
)

export default StripeForm
