import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";

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

  return (
    // <div className="w-40 h-screen shadow-md bg-primary-color text-white sm:text-sm px-1">
    <div className="bg-primary-color text-white lg:text-lg px-10">
      <ul className="flex items-center p-4">
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
        <li>
          <button onClick={logout}>Logout</button>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
