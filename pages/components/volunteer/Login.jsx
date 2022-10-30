import { useState, useRef } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

const Login = () => {
  const [show, setShow] = useState(false);
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const toggle = () => {
    setShow(!show);
  };

  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-center text-3xl tracking-tight text-gray-900">
            {"["}WAKE SMILES{"]"}
          </h2>
        </div>
        <form className="mt-8 space-y-3" method="POST">
          <div className="rounded-md">
            <div>
              <label className="mb-2">Email</label>
              <input
                ref={emailRef}
                name="email"
                type="email"
                autoComplete="email"
                className="login-input"
                placeholder="johndoe@gmail.com"
                required
              />
            </div>
            <br />
            <div>
              <label className="mb-2">Password</label>
              <input
                ref={passwordRef}
                name="password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                className="login-input"
                placeholder="***********"
                required
              />
              {show ? (
                <AiFillEye className="password-toggle" onClick={toggle} />
              ) : (
                <AiFillEyeInvisible
                  className="password-toggle"
                  onClick={toggle}
                />
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <a href="#" className="font-medium text-primary-color text-sm">
              Forgot password?
            </a>
          </div>

          <div>
            {/* <a
              href="/api/auth/login"
              className="flex w-full justify-center rounded-xl border-transparent bg-primary-color py-2 px-4 text-sm font-medium text-white hover:bg-primary-color focus:outline-none focus:ring-2 focus:bg-primary-color focus:ring-offset-2"
            >
              Log In
            </a> */}
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-xl border-transparent bg-primary-color py-2 px-4 text-sm font-medium text-white hover:bg-primary-color focus:outline-none focus:ring-2 focus:bg-primary-color focus:ring-offset-2"
            >
              Log in
            </button>
            <p className="mt-2 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="#"
                className="font-medium text-primary-color hover:text-primary-color"
              >
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
