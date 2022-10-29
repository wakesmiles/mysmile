import '../styles/globals.css';
// import { UserProvider } from '@auth0/nextjs-auth0';
import Login from './components/volunteer/Login.jsx';
import Registration from './components/volunteer/Registration';
import ProfilePage from './components/volunteer/ProfilePage';


function MyApp({ Component, pageProps }) {


  return (
    // <UserProvider>
      <div className="h-screen flex flex-col justify-items-center ">
        <Registration />
      </div>
    // </UserProvider>
  )
}

export default MyApp