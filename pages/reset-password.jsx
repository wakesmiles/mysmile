import { useState, useRef, useEffect } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { supabase } from "../utils/supabaseClient";
import Rerouting from "./components/reroute";

function FetchUser() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    async function searchUser() {
        try {
            await supabase.auth.getUser().then(async (data, err) => {
                if (data) {
                    const id = data.data.user.id;
                    await supabase
                      .from("profiles")
                      .select()
                      .eq("id", id)
                      .then((profile, err) => {
                            if (profile) {
                            return profile.data[0];
                            }
                        })
                      .then(async (profile) => {
                        setUser(profile);
                    });
                }
            })
        } catch (err) {
        } finally {
          setLoading(false);
        }
    };

    useEffect(() => {
        searchUser()
    })

    return [user, loading]
}



const PasswordReset = () => {
    const passwordRef = useRef("")
    const confRef = useRef("")
    const [show1, setShow1] = useState(false)
    const [show2, setShow2] = useState(false)
    const [done, setDone] = useState(false)
    const [user, loading] = FetchUser()

    const resetPassword = async (e) => {
        e.preventDefault()
        if (passwordRef.current.value === confRef.current.value) {
            await supabase.auth.updateUser({ password: passwordRef.current.value })
            setDone(true)
        } else {
            alert('Passwords do not match')
        }
    }

    if (loading) {
        return <div />
    }

    if (!user) {
        return <Rerouting />
    }

    return (
        <>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
                    <form className="space-y-3" method="POST" onSubmit={(e) => resetPassword(e)}>
                        <div className="rounded-md mb-3 space-y-3">
                            {done ? (
                                <>
                                <div className="flex flex-row font-medium text-green-500">
                                    Password has been changed!
                                </div>
                                </>
                            ) : (
                                <>
                                <div>
                                    <label className="auth-label">New Password</label>
                                    <input
                                        ref={passwordRef}
                                        name="password"
                                        type={show1 ? "text" : "password"}
                                        autoComplete="current-password"
                                        minLength="6"
                                        placeholder="******"
                                        className="auth-input"
                                        required
                                    />
                                    {show1 ? (
                                        <AiFillEye
                                        className="password-toggle"
                                        onClick={() => setShow1(!show1)}
                                        />
                                    ) : (
                                        <AiFillEyeInvisible
                                        className="password-toggle"
                                        onClick={() => setShow1(!show1)}
                                        />
                                    )}
                                </div>
                                <div>
                                    <label className="auth-label">Confirm New Password</label>
                                    <input
                                        ref={confRef}
                                        name="password"
                                        type={show2 ? "text" : "password"}
                                        autoComplete="current-password"
                                        minLength="6"
                                        placeholder="******"
                                        className="auth-input"
                                        required
                                    />
                                    {show2 ? (
                                        <AiFillEye
                                        className="password-toggle"
                                        onClick={() => setShow2(!show2)}
                                        />
                                    ) : (
                                        <AiFillEyeInvisible
                                        className="password-toggle"
                                        onClick={() => setShow2(!show2)}
                                        />
                                    )}
                                </div>
                                    <button type="submit" className="indigo-button-lg w-full">
                                        Change password
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default PasswordReset