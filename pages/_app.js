import '../styles/globals.css';

function MyApp({ Component, pageProps }) {

  return (
    // <UserProvider>
      <div>
        <Component {...pageProps}/>
      </div>
    // </UserProvider>
  )
}

export default MyApp