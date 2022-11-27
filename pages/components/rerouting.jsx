import Link from "next/link";

const Rerouting = () => {
  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <div className="flex flex-col text-center">
        <p>No user data... invalid/expired session or restricted access.</p>
        <div className="text-primary-color font-medium hover:underline hover:underline-offset-4">
          <Link href="/login">Click here to sign in or make an account.</Link>
        </div>
      </div>
    </div>
  );
};

export default Rerouting;
