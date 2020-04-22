import { parseCookies } from 'nookies'

import StripeForm from '../components/StripeForm'

const Dashboard = ({ userId }) => {
  return (
    <div className='dashboard-layout'>
      <h2 className='dashboard-layout__page-title'>ダッシュボード</h2>
      <div className='shadow payment-box'>
        <StripeForm userId={userId} />
      </div>
    </div>
  )
}

export const getServerSideProps = async ctx => {
  const { sesssion } = parseCookies(ctx)
  const { userId, userName } = JSON.parse(sesssion)

  return {
    props: {
      userId,
      userName
    }
  }
}

export default Dashboard
