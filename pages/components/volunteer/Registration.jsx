import { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { supabase } from "../../supabaseClient";

const Registration = () => {
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

  // Limit DOB input field to guarantee volunteers are 18+
  let maxDob = new Date();
  maxDob.setFullYear(maxDob.getFullYear()-18);
  maxDob = maxDob.toLocaleString('en-US');
  maxDob = maxDob.slice(6, 10) + "-" + maxDob.slice(0, 2) + "-" + maxDob.slice(3, 5);

  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", 
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", 
    "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", 
    "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", 
    "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  const Option = (props) => <option>{props.label}</option>;

  const signUp = async (e, history) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email: emailRef.current.value,
      password: passwordRef.current.value,
      options: {
        data: {
          first_name: fnameRef.current.value,
          last_name: lnameRef.current.value,
          dob: dobRef.current.value,
          role: 'pre-dental',
          phone: phoneRef.current.value,
          address: addressRef.current.value,
          city: cityRef.current.value,
          state: stateRef.current.value,
          zip: zipRef.current.value,
          orientation: false,
        }
      }
    })
    if (error) {
      console.log(error);
      return;
    }
    console.log(supabase.auth.user())
  };

  /**
   * options: {
        data: {
          first_name: fnameRef.current.value.toString(),
          last_name: lnameRef.current.value.toString(),
          dob: dobRef.current.value.toString(),
          role: 'pre-dental',
          phone: phoneRef.current.value.toString(),
          address: addressRef.current.value.toString(),
          city: cityRef.current.value.toString(),
          state: stateRef.current.value.toString(),
          zip: zipRef.current.value.toString(),
          orientation: false,
        }
      }
   */

  return (
    <div className="grid place-items-center p-8">
      <form method="POST">
        <div className="registration-container">
          <div className="bg-white px-4 py-5 sm:p-6">
            <legend className="registration-header">Basic Information</legend>
            <div className="grid grid-cols-6 gap-3 mt-3">
              <div className="col-span-3">
                <label htmlFor="first-name" className="registration-label">
                  First Name
                </label>
                <input
                  ref={fnameRef}
                  name="first-name"
                  type="text"
                  autoComplete="on"
                  className="registration-input"
                  required
                />
              </div>

              <div className="col-span-3">
                <label htmlFor="last-name" className="registration-label">
                  Last Name
                </label>
                <input
                  ref={lnameRef}
                  type="text"
                  name="last-name"
                  autoComplete="on"
                  className="registration-input"
                  required
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="email-address" className="registration-label">
                  Email
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  name="email-address"
                  autoComplete="on"
                  className="registration-input"
                  required
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="password" className="registration-label">
                  Password
                </label>
                <input
                  ref={passwordRef}
                  name="password"
                  type="text"
                  className="registration-input"
                  minLength="6"
                  placeholder="******"
                  required
                />
              </div>

              <div className="col-span-3">
                <label htmlFor="phone-number" className="registration-label">
                  Phone
                </label>
                <input
                  ref={phoneRef}
                  type="tel"
                  name="phone-number"
                  autoComplete="on"
                  className="registration-input"
                  placeholder="###-###-####"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  required
                />
              </div>

              <div className="col-span-3">
                <label htmlFor="dob" className="registration-label">
                  Date of Birth (must be 18+)
                </label>
                <input
                  ref={dobRef}
                  type="date"
                  name="dob"
                  className="registration-input"
                  max={maxDob}
                  defaultValue={maxDob}
                  required
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="street-address" className="registration-label">
                  Street Address
                </label>
                <input
                  ref={addressRef}
                  type="text"
                  name="street-address"
                  autoComplete="on"
                  className="registration-input"
                  required
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="city" className="registration-label">
                  City
                </label>
                <input
                  ref={cityRef}
                  type="text"
                  name="city"
                  autoComplete="on"
                  className="registration-input"
                  required
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="state" className="registration-label">
                  State / Province
                </label>
                <select
                  ref={stateRef}
                  name="state"
                  autoComplete="on"
                  className="registration-input"
                  required
                >
                  {states.map((v, i) => (
                    <Option key={i.toString()} label={v} />
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label htmlFor="zip-code" className="registration-label">
                  ZIP Code (#####)
                </label>
                <input
                  ref={zipRef}
                  type="text"
                  name="zip-code"
                  autoComplete="on"
                  className="registration-input"
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
                  bloodborne pathogens (BBP’s) including Human Immunodeficiency
                  Virus (HIV), Hepatitis B Virus (HBV) and Hepatitis C Virus
                  (HCV), as well as other bacteria, protozoa, viruses and prions
                  during the performance of my volunteer service at Wake Smiles
                  Dental Clinic.
                </p>
                <br />
                <p>
                  I understand that I am personally responsible for any medical
                  fees and services associated with percutaneous piercing wound,
                  typically set by a needle point, but possibly by other sharp
                  instruments or objects.
                </p>
                <br />
                <p>
                  I understand that this is a donation of my services and that I
                  am responsible for my own medical care. I also understand that
                  I am not entitled to reimbursement from Raleigh-Wake County
                  Dental Society Community Dental Health Program, INC. (Wake
                  Smiles) for any of my expenditures.
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
                  I understand that as a volunteer at Raleigh-Wake County Dental
                  Society Community Dental Health Program, INC. (Wake Smiles), I
                  will see, hear and/or otherwise have access to confidential
                  health information and patient records.
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
          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <button
              type="submit"
              className="indigo-button"
              onClick={(e) => signUp(e)}
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Registration;
