const stripe = require('stripe')(process.env.STRIPE_SECRET)

export default stripe
