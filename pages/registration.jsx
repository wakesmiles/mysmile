import { useRef } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import states from "../utils/state-abbrev";
import { supabase } from "../utils/supabaseClient.js";

/** New user registration form */
const Registration = () => {
  const router = useRouter();

  // Keep phone #, DOB, and zip code as string for easier formatting and data validation
  const fnameRef = useRef("");
  const lnameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const phoneRef = useRef("");
  const dobRef = useRef("");
  const addressRef = useRef("");
  const cityRef = useRef("");
  const stateRef = useRef("");
  const zipRef = useRef("");
  const waiverRef = useRef(false);
  const hipaaRef = useRef(false);

  // Limit Date of Birth (DOB) input field to guarantee volunteers are 18+
  let maxDob = new Date();
  maxDob.setFullYear(maxDob.getFullYear() - 18);
  maxDob = maxDob.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  maxDob =
    maxDob.slice(6, 10) + "-" + maxDob.slice(0, 2) + "-" + maxDob.slice(3, 5);

  // UI for US state abbreviations dropdown list
  const Option = (props) => <option>{props.label}</option>;

  /**
   * Create new record in Supabase auth.users internal schema and public "profiles" table
   * Automatically log new user into their dashboard/schedule if registration is successful
   */
  const signUp = async (e) => {
    e.preventDefault();
    let success = false;
    let currentDob = dobRef.current.value ? dobRef.current.value : maxDob;

    await supabase.auth
      .signUp({
        email: emailRef.current.value,
        password: passwordRef.current.value,
        options: {
          data: {
            first_name: fnameRef.current.value,
            last_name: lnameRef.current.value,
            dob: currentDob,
            role: "pre-dental",
            phone: phoneRef.current.value,
            address: addressRef.current.value,
            city: cityRef.current.value,
            state: stateRef.current.value,
            zip: zipRef.current.value,
            orientation: false,
          },
        },
      })
      .then(async ({ data, error }) => {
        // If error occurs (ex: an account already exists with email), alert
        if (error) {
          alert(error.message);
          return;
        }

        // If registration was successful, create a matching record with user info in the "profiles" table
        const user = data.user;
        await supabase
          .from("profiles")
          .insert({
            id: user.id,
            first_name: user.user_metadata.first_name,
            last_name: user.user_metadata.last_name,
            dob: user.user_metadata.dob,
            role: user.user_metadata.role,
            email: user.email,
            phone: user.user_metadata.phone,
            address: user.user_metadata.address,
            city: user.user_metadata.city,
            state: user.user_metadata.state,
            zip: user.user_metadata.zip,
            orientation: user.user_metadata.orientation,
          })
          .then(() => (success = true));
      });

    if (success) {
      router.push("/schedule");
    }
  };

  return (
    <div>
      <Head>
        <title>MySmile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid place-items-center p-8">
        <form method="POST" onSubmit={(e) => signUp(e)}>
          <div className="auth-container">
            <div className="bg-white px-4 py-5 sm:p-6">
              <legend className="registration-header">Basic Information</legend>
              <div className="grid grid-cols-6 gap-3 mt-3">
                <div className="col-span-3">
                  <label htmlFor="first-name" className="auth-label">
                    First Name
                  </label>
                  <input
                    ref={fnameRef}
                    name="first-name"
                    type="text"
                    autoComplete="on"
                    className="auth-input"
                    required
                  />
                </div>

                <div className="col-span-3">
                  <label htmlFor="last-name" className="auth-label">
                    Last Name
                  </label>
                  <input
                    ref={lnameRef}
                    type="text"
                    name="last-name"
                    autoComplete="on"
                    className="auth-input"
                    required
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="email-address" className="auth-label">
                    Email
                  </label>
                  <input
                    ref={emailRef}
                    type="email"
                    name="email-address"
                    autoComplete="on"
                    className="auth-input"
                    required
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="password" className="auth-label">
                    Password
                  </label>
                  <input
                    ref={passwordRef}
                    name="password"
                    type="text"
                    className="auth-input"
                    minLength="6"
                    placeholder="******"
                    required
                  />
                </div>

                <div className="col-span-3">
                  <label htmlFor="phone-number" className="auth-label">
                    Phone
                  </label>
                  <input
                    ref={phoneRef}
                    type="tel"
                    name="phone-number"
                    autoComplete="on"
                    className="auth-input"
                    placeholder="###-###-####"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    required
                  />
                </div>

                <div className="col-span-3">
                  <label htmlFor="dob" className="auth-label">
                    Date of Birth (must be 18+)
                  </label>
                  <input
                    ref={dobRef}
                    type="date"
                    name="dob"
                    className="auth-input"
                    max={maxDob}
                    defaultValue={maxDob}
                    required
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="street-address" className="auth-label">
                    Street Address
                  </label>
                  <input
                    ref={addressRef}
                    type="text"
                    name="street-address"
                    autoComplete="on"
                    className="auth-input"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label htmlFor="city" className="auth-label">
                    City
                  </label>
                  <input
                    ref={cityRef}
                    type="text"
                    name="city"
                    autoComplete="on"
                    className="auth-input"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label htmlFor="state" className="auth-label">
                    State / Province
                  </label>
                  <select
                    ref={stateRef}
                    name="state"
                    autoComplete="on"
                    className="auth-input"
                    required
                  >
                    {states.map((v, i) => (
                      <Option key={i.toString()} label={v} />
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label htmlFor="zip-code" className="auth-label">
                    ZIP Code (#####)
                  </label>
                  <input
                    ref={zipRef}
                    type="text"
                    name="zip-code"
                    autoComplete="on"
                    className="auth-input"
                    placeholder="#####"
                    pattern="[0-9]{5}"
                    required
                  />
                </div>
              </div>
              <hr className="mt-5 mb-5" />
              <fieldset>
                <legend className="registration-header">Exposure Waiver</legend>
                <div className="italic text-sm">
                  <p className="mt-3">
                    I understand there is potential risk for exposure to
                    bloodborne pathogens (BBP’s) including Human
                    Immunodeficiency Virus (HIV), Hepatitis B Virus (HBV) and
                    Hepatitis C Virus (HCV), as well as other bacteria,
                    protozoa, viruses and prions during the performance of my
                    volunteer service at Wake Smiles Dental Clinic.
                  </p>
                  <br />
                  <p>
                    I understand that I am personally responsible for any
                    medical fees and services associated with percutaneous
                    piercing wound, typically set by a needle point, but
                    possibly by other sharp instruments or objects.
                  </p>
                  <br />
                  <p>
                    I understand that this is a donation of my services and that
                    I am responsible for my own medical care. I also understand
                    that I am not entitled to reimbursement from Raleigh-Wake
                    County Dental Society Community Dental Health Program, INC.
                    (Wake Smiles) for any of my expenditures.
                  </p>
                </div>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <input
                      name="exposure-waiver"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600"
                      ref={waiverRef}
                      required
                    />
                    <label htmlFor="exposure-waiver" className="ml-3">
                      Agree
                    </label>
                  </div>
                </div>
              </fieldset>
              <hr className="mt-5 mb-5" />
              <fieldset>
                <legend className="registration-header">
                  HIPAA Privacy and Confidentiality Statement
                </legend>
                <div className="italic text-sm">
                  <p className="mt-3">
                    I understand that as a volunteer at Raleigh-Wake County
                    Dental Society Community Dental Health Program, INC. (Wake
                    Smiles), I will see, hear and/or otherwise have access to
                    confidential health information and patient records.
                  </p>
                  <br />
                  <p>
                    Confidential information may include personal patient
                    information, radiographic images and treatment plans. This
                    should:
                  </p>
                  <ol className="list-decimal mt-2 ml-6">
                    <li>
                      Only be accessed by employees or contracted personnel when
                      needed to perform dental procedures.
                    </li>
                    <li>Be protected at all times.</li>
                    <li>
                      Remain confidential even upon completing the volunteer
                      experience.
                    </li>
                  </ol>
                  <br />
                  <p>
                    I hereby certify that I have read this document and am aware
                    of the confidentiality requirements expected of me. I pledge
                    to not disclose any confidential information learned at Wake
                    Smiles.
                  </p>
                </div>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <input
                      name="hipaa"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600"
                      ref={hipaaRef}
                      required
                    />
                    <label htmlFor="hipaa" className="ml-3">
                      Agree
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
            <div className="bg-gray-50 px-4 py-3 text-right flex flex-row justify-between sm:px-6">
              <div className="flex items-center text-primary-color font-medium text-sm hover:text-indigo-600 hover:underline hover:underline-offset-4">
                <Link href="/">Back to Login</Link>
              </div>
              <div>
                <button type="submit" className="indigo-button-lg">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
