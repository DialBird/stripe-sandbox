import {
  useContext,
  useState,
} from 'react'
import { parseCookies } from 'nookies'

import AuthContext from '../contexts/Auth'

const Signup = () => {
  const { signup } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = e => {
    e.preventDefault()
    signup(email, password, name)
  }

  return (
    <div className='login-layout'>
      <h2 className='login-layout__page-title'>登録</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input type="text" className="form-control" placeholder="名前" onChange={e => setName(e.target.value)}/>
        </div>
        <div className="form-group">
          <input type="email" className="form-control" placeholder="Email" onChange={e => setEmail(e.target.value)}/>
        </div>
        <div className="form-group">
          <input type="password" className="form-control" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
        </div>
        <div className="login-layout__submit-wrap">
          <button type="submit" className="btn btn-primary w-100">Submit</button>
        </div>
      </form>
    </div>
  )
}

export const getServerSideProps = async ctx => {
  const { res } = ctx
  const { sesssion } = parseCookies(ctx)
  if (sesssion) {
    res.writeHead(302, { Location: '/dashboard' })
    res.end()
  }

  return {
    props: {}
  }
}

export default Signup
