import { useRef, useState } from "react";
import { supabase } from "../utils/supabaseClient"



const SendResetLink = () => {
    const emailRef = useRef("");
    const [sent, setSent] = useState(false)

    const getURL = () => {
        let url =
          process.env.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
          process.env.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
          'http://localhost:3000/'
        // Make sure to include `https://` when not localhost.
        url = url.includes('http') ? url : `https://${url}`
        // Make sure to include a trailing `/`.
        url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
        return url
    }

    const sendEmail = async (e) => {
        e.preventDefault();
        const user = await supabase
        .from('profiles')
        .select('id')
        .eq('email', emailRef.current.value)
        .then(async user => {
            if (user.data[0]) {
                await supabase.auth.resetPasswordForEmail(emailRef.current.value, {
                    redirectTo: `${getURL()}reset-password`,
                })
                setSent(true)
            } else {
                alert('No user is signed up with the provided email')
            }      
        })
    }
    return (
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <title>MySmile</title>
            <div className="auth-container p-10 space-y-4">
                <div className="flex flex-row justify-center">
                    <picture>
                        <source
                        srcSet="/ws_logo_dark.png"
                        media="(prefers-color-scheme: dark)"
                        />
                        <img
                        src="/ws_logo.png"
                        width="50px"
                        height="50px"
                        alt="wake_smiles_logo"
                        />
                    </picture>
                    <div className="flex flex-col justify-center">
                        <span className="ml-3 font-serif text-5xl text-primary-color">
                        MySmile
                        </span>
                    </div>
                </div>
                {sent ? (
                    <>
                    <div className="flex flex-row font-medium text-green-500">
                        Password reset link has been sent to the email provided!
                    </div>
                    <div className="flex flex-row font-medium text-green-500 italic">
                        (Possibly check your spam folder)
                    </div>
                    </>
                ) : (
                    <form className="space-y-3" method="POST" onSubmit={(e) => sendEmail(e)}>
                    <div>
                        <label className="auth-label">Email</label>
                        <input
                            ref={emailRef}
                            name="email"
                            type="email"
                            autoComplete="email"
                            className="auth-input"
                            required
                        />
                    </div>
                        <button type="submit" className="indigo-button-lg w-full">
                            Send password recovery link
                        </button> 
                    </form> 
                )}
   
            </div>
        </div>
    )
}

export default SendResetLink