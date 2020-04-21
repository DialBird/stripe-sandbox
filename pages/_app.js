import Head from 'next/head'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/index.scss'

import { AuthProvider } from '../contexts/Auth'
import Header from '../components/Header'

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>title</title>
      </Head>
      <AuthProvider>
        <Header {...pageProps} />
        <div className='container'>
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </>
  )
}

export default App
