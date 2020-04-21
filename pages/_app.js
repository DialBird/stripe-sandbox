import Head from 'next/head'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../style.scss'

import { AuthProvider } from '../contexts/Auth'

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>title</title>
      </Head>
      <AuthProvider>
        <div className='container'>
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </>
  )
}

export default App
