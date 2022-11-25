import { useState, useRef } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { supabase } from "./supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const Login = () => {
  const [show, setShow] = useState(false);
  const router = useRouter();

  const emailRef = useRef("");
  const passwordRef = useRef("");

  // TODO: discard console log statements, adjust route to dashboard
  const login = async (e) => {
    e.preventDefault();
    let success = false;

    await supabase.auth
      .signInWithPassword({
        email: emailRef.current.value,
        password: passwordRef.current.value,
      })
      .then((data, error) => {
        if (data) {
          console.log("LOGIN DATA");
          console.log(data);
          success = true;
        } else if (error) {
          console.log("LOGIN ERROR");
          console.log(error);
        }
      });
      
      if (success) {
        router.push('/dashboard')
      }
  };

  // CLEAN: login & registration classes are quite similar, can probably simplify class names
  // TODO: implement reset password
  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="registration-container p-10 space-y-4">
        <div className="flex flex-row justify-center">
          <Image src={"/ws_logo.png"} width={50} height={50} />
          <div className="flex flex-col justify-center">
            <span className="ml-3 font-serif text-5xl text-primary-color">
              Smile Doc
            </span>
          </div>
        </div>

        <form className="space-y-3" method="POST" onSubmit={(e) => login(e)}>
          <div className="rounded-md mb-3 space-y-3">
            <div>
              <label className="login-label">Email</label>
              <input
                ref={emailRef}
                name="email"
                type="email"
                autoComplete="email"
                className="login-input"
                required
              />
            </div>
            <div>
              <label className="login-label">Password</label>
              <input
                ref={passwordRef}
                name="password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                className="login-input"
                required
              />
              {show ? (
                <AiFillEye
                  className="password-toggle"
                  onClick={() => setShow(!show)}
                />
              ) : (
                <AiFillEyeInvisible
                  className="password-toggle"
                  onClick={() => setShow(!show)}
                />
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="indigo-button w-full"
            >
              Log In
            </button>
            <div className="flex flex-row justify-between mt-2 text-sm font-medium text-primary-color">
              <div>
                {/* <a
                  href="#"
                  className="hover:text-indigo-600 hover:underline hover:underline-offset-4"
                >
                  Reset Password
                </a> */}
              </div>
              <br />
              <div className="hover:text-indigo-600 hover:underline hover:underline-offset-4">
                <Link href="/registration">Create New Account</Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
