import { db } from '../../../../config/firebase'

export default (req, res) => {
  // pass userId as state through API
  const { code, state } = req.query

  db.doc(`users/${state}`).update({stripeAccountId: code})
  res.writeHead(302, { Location: '/dashboard' })
  res.end()
}
