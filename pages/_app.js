import '../styles/globals.css';
// import { UserProvider } from '@auth0/nextjs-auth0';
import Login from './components/volunteer/Login.jsx';
import Registration from './components/volunteer/Registration';

function MyApp({ Component, pageProps }) {


  return (
    // <UserProvider>
      <div className="h-screen flex flex-col justify-items-center ">
        <Login/>
      </div>
    // </UserProvider>
  )
}

export default MyApp