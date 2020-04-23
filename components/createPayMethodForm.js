import { useContext, useState } from 'react'
import {
  CardElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import axios from 'axios'

import StripeContext from '../contexts/Stripe'

const CreatePayMethodForm = () => {
  const { stripeAccountId, userId, userName } = useContext(StripeContext)
  const [amount, setAmount] = useState(0)
  const [agreement, setAgreement] = useState(true)
  const [paymentMethodId, setPaymentMethodId] = useState()
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async e => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        name: userName,
      }
    })

    if (error) {
      console.log(error)
    } else {
      setPaymentMethodId(paymentMethod.id)
    }
  }

  const handleConfirm = async e => {
    e.preventDefault()

    if (agreement) {
      const clientSecret =
        await axios.post('/api/stripe/createPaymentIntent', {
          amount,
          stripeAccountId,
          userId
        }).then(res => res.data.client_secret)

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodId
      })

      if (error) {
        console.log(error)
      } else if (paymentIntent.status === "succeeded") {
        alert('決済完了')
      } else {
        alert(paymentIntent)
      }
    } else {
      // キャンセル処理実装したい
    }

    setPaymentMethodId(null)
  }

  let render
  if (paymentMethodId) {
    render = (
      <form onSubmit={handleConfirm}>
        <h3>{amount}円を支払いますか？</h3>
        <button type="submit" className='mt-3 mb-3 w-100 btn btn-success' onClick={() => setAgreement(true)}>はい</button>
        <button type="submit" className='mt-3 mb-3 w-100 btn btn-danger' onClick={() => setAgreement(false)}>いいえ</button>
      </form>
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

export default CreatePayMethodForm
