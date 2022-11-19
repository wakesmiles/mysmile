import Link from "next/link";

const Navbar = () => {
  return (
    <div class="w-40 h-screen shadow-md bg-primary-color text-white sm:text-sm px-1">
        <ul class="relative mt-6 space-y-4 pl-6">
            <li class="relative overflow-hidden text-white text-ellipsis whitespace-nowrap rounded hover:text-bg-colortransition duration-300 ease-in-out" data-mdb-ripple="true" data-mdb-ripple-color="dark">
                <Link href="/profile">
                    Profile
                </Link>
            </li>
            <li class="relative overflow-hidden text-white text-ellipsis whitespace-nowrap rounded hover:text-bg-colortransition duration-300 ease-in-out" data-mdb-ripple="true" data-mdb-ripple-color="dark">
                <Link href="/dashboard">
                    Dashboard
                </Link>
            </li>
            <li class="relative overflow-hidden text-white text-ellipsis whitespace-nowrap rounded hover:text-bg-colortransition duration-300 ease-in-out" data-mdb-ripple="true" data-mdb-ripple-color="dark">
                <Link href="/shifts">
                    Shifts
                </Link>
            </li>
            <li class="relative overflow-hidden text-white text-ellipsis whitespace-nowrap rounded hover:text-bg-colortransition duration-300 ease-in-out" data-mdb-ripple="true" data-mdb-ripple-color="dark">
                <Link href="/upload">
                    Upload
                </Link>
            </li>
            <li class="relative overflow-hidden text-white text-ellipsis whitespace-nowrap rounded hover:text-bg-colortransition duration-300 ease-in-out" data-mdb-ripple="true" data-mdb-ripple-color="dark">
                <Link href="/">
                    Logout
                </Link>
            </li>
        </ul>
    </div>
  );
};

export default Navbar;
