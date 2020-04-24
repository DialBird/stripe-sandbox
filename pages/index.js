import {
  useContext,
  useState,
} from 'react'

import AuthContext from '../contexts/Auth'

const Index = () => {
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = e => {
    e.preventDefault()
    login(email, password)
  }

  return (
    <div className='login-layout'>
      <h2 className='login-layout__page-title'>ログイン</h2>
      <form onSubmit={onSubmit}>
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

export default Index
