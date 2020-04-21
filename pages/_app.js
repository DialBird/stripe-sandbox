import Head from 'next/head'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../style.scss'

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>title</title>
      </Head>
      <div className='container'>
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default App
