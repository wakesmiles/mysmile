import '../styles/globals.css';
// import { UserProvider } from '@auth0/nextjs-auth0';
import Login from './components/volunteer/Login.jsx';
import Registration from './components/volunteer/Registration';
import Profile from './components/volunteer/Profile';
import Upload from './components/volunteer/Upload.jsx';


function MyApp({ Component, pageProps }) {


  return (
    // <UserProvider>
      <div className="h-screen flex flex-col justify-items-center ">  
        <Profile />
      </div>
    // </UserProvider>
  )

/*
return (
  // <UserProvider>
    <div className="h-screen flex flex-col justify-items-center ">  
      <ProfilePage />
    </div>
  // </UserProvider>
)
*/
}

export default MyApp