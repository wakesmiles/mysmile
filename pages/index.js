import Head from 'next/head'
import Login from './login';

export default function Home() {

  return (
    <div>
      <Head>
        <title>MySmile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Login/>
      </div>
    </div>
  )
}
