import { useContext } from 'react'
import Link from 'next/link'

import AuthContext from '../contexts/Auth'

const Header = () => {
  const { currentUser, logout } = useContext(AuthContext)

  return (
    <header className='navbar navbar-expand-lg navbar-light bg-light'>
      <div className="container">
        <h1 className="navbar-brand" href="#">Stripe Sandbox</h1>
        <ul className='navbar-nav'>
          {currentUser ? (
            <li>
              <button className='btn btn-danger' onClick={() => logout()}>ログアウト</button>
            </li>
          ) : (
            <>
              <li>
                <Link href='/'>
                  <a className="btn btn-link">ログイン</a>
                </Link>
              </li>
              <li>
                <Link href='/signup'>
                  <a className="btn btn-link">登録</a>
                </Link>
              </li>
            </>
          )}
      </ul>
      </div>
    </header>
  )
}

export default Header
