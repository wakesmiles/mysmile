import Head from 'next/head'
import Login from './login';

export default function Home() {

  const name = "MySmile";

  return (
    <div>
      <Head>
        <title>{name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Login/>
      </div>
    </div>
  )
}
