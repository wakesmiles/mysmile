import '../styles/globals.css';
<<<<<<< HEAD
import Registration from './components/volunteer/Registration';
import Login from './components/volunteer/Login';
import VDashboard from './components/volunteer/VDashboard';
import Profile from './components/volunteer/Profile';
import Upload from './components/volunteer/Upload';
import Avatar from './components/volunteer/Avatar';

=======
>>>>>>> main

function MyApp({ Component, pageProps }) {

  return (
    // <UserProvider>
<<<<<<< HEAD
      <div className="h-screen flex flex-col justify-items-center ">
        <Upload/>
        {/* <BrowserRouter>x
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
=======
      <div>
        <Component {...pageProps}/>
>>>>>>> main
      </div>
    // </UserProvider>
  )
}

export default MyApp