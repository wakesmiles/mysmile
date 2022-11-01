import '../styles/globals.css';
// import { UserProvider } from '@auth0/nextjs-auth0';
// import { Login, Registration, VDashboard, ProfilePage } from './components/volunteer';
import Registration from './components/volunteer/Registration';
import Login from './components/volunteer/Login';
import VDashboard from './components/volunteer/VDashboard';

function MyApp({ Component, pageProps }) {

  return (
    // <UserProvider>
      <div className="h-screen flex flex-col justify-items-center ">
        <Login/>
        {/* <BrowserRouter>
          <Switch>
            <Route path="/" component={Login}/>
            <Route path="signup" component={Registration}/>
            <Route path="/home" component={VDashboard}/>
          </Switch>
        </BrowserRouter> */}
        {/* <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/home" element={<VDashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes> */}
      </div>
    // </UserProvider>
  )
}

export default MyApp