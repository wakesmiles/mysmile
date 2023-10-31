import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import React, {useState, useEffect} from 'react';
import { Helmet } from 'react-helmet';


/** Side menu bar for navigating between pages/components using Next.js */

const Navbar = () => {
  const router = useRouter();

  /**
   * Log out current authenticated user and redirect to login/homepage
   */
  const logout = async () => {
    let success = false;
    await supabase.auth.signOut().then(() => {
      success = true;
    });
    if (success) router.push("/");
  };

  // Responsive Window Frame to Mobile and Web
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array ensures the effect runs once after initial render

  // Responsive Hamburger Icon
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const isMobile = windowWidth <= 768;

  return (
    <div style={{}}>
      {/* <h1>Window Width: {windowWidth}</h1> */}
      {isMobile ? (
        // <h1 style={{ fontSize: '24px' }}>Mobile Content</h1>
        <div className="navbar bg-primary-color text-white lg:text-lg px-10 p-4">
          <div className="flex justify-between">
            <div className="flex flex-col justify-center">
              <span className="ml-3 font-serif text-5xl text-white">
                MySmile
              </span>
            </div>
            <div className={`wift menu-toggle ${isOpen ? 'active' : ''}`} onClick={toggleNavbar}>
              <a>
                {/* <input type="checkbox" id="check"></input> */}
                <label htmlFor="check" className="checkbtn text-5xl">
                  <i className="fa fa-bars" aria-hidden="true"></i>
                </label>
              </a>
            </div>
          </div>   
          {isOpen && (
            <div className="navbar bg-primary-color text-white lg:text-lg -right-px">
              <div>
                <div className="nav-menu menu flex items-left p-4 text-3xl bottom-5px">
                  <ul>
                    <li className="mr-6 pt-6 pb-6">   
                      <Link href="/profile">Profile</Link>
                    </li>
                    <li className="mr-6 pb-6">
                      <Link href="/schedule">Schedule</Link>
                    </li>
                    <li className="mr-6 pb-6">
                      <Link href="/shifts">Shifts</Link>
                    </li>
                    <li className="mr-6 pb-6">
                      <Link href="/files">Files</Link>
                    </li>
                    <li className="mr-6 pb-6">
                      <button onClick={logout}>Logout</button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          <div>
            <Helmet>
              <script src="https://kit.fontawesome.com/df52d66a28.js" crossorigin="anonymous"
                defer
              ></script>
            </Helmet>
          </div>
        </div>
      ) : (
        // <h1 style={{ fontSize: '36px' }}>Desktop Content</h1>
        <div className="navbar bg-primary-color text-white lg:text-lg px-10 p-4">
          <div className="flex justify-between">
            <div className="flex flex-col justify-center">
              <span className="ml-3 font-serif text-5xl text-white">
                MySmile
              </span>
            </div>
            <div className="navbar bg-primary-color text-white lg:text-2xl px-10">
              <div className="nav-menu">
                <ul className="menu flex items-right p-2">
                  <li className="mr-6">
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li className="mr-6">
                    <Link href="/schedule">Schedule</Link>
                  </li>
                  <li className="mr-6">
                    <Link href="/shifts">Shifts</Link>
                  </li>
                  <li className="mr-6">
                    <Link href="/files">Files</Link>
                  </li>
                  <li className="mr-6">
                    <button onClick={logout}>Logout</button>
                  </li>
                </ul>
              </div>
            </div>
          </div> 
        </div>   
      )}
    </div>
  );
}

export default Navbar;
