import { useState, useRef } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

const ProfilePage = () => {
  const [show, setShow] = useState(false);
  const phoneRef = useRef("");
  const addressRef = useRef("");
  const cityRef = useRef("");
  const stateRef = useRef("");
  const zipRef = useRef("");
  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", 
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", 
    "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", 
    "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", 
    "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];
  const Option = (props) => <option>{props.label}</option>;

  
  const toggle = () => {
    setShow(!show);
  };

  return (
    <main class="flex min-h-screen flex-col justify-center bg-white p-16">
      <h1 class="text-3xl font-bold text-black">Account Information</h1>
      <p class="mb-8 font-semibold text-gray-150">Edit</p>
      <div class="w-full rounded-xl bg-white p-4 shadow-2xl shadow-white/40">
      <div class="mb-4 grid grid-cols-2 gap-4">
          <div class="flex flex-col">
            <label for="email" class="mb-2 font-semibold">Email Address</label>
            <div class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-2 top-2 h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule ="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd" />
            </svg>
            <input type="email" id="text" class="w-full rounded-lg border border-slate-200 px-2 py-1 pl-8 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40" />
            </div>

            
          </div>
          <div className="col-span-6">
                <label htmlFor="phone-number" className="registration-label">
                  Phone (###-###-####)
                </label>
                <input
                  ref={phoneRef}
                  type="tel"
                  name="phone-number"
                  autoComplete="on"
                  className="registration-input"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  required
                />
          </div>
        </div>
        <div class="mb-4 grid grid-cols-2 gap-4">
          <div class="flex flex-col">
            <label for="text" class="mb-2 font-semibold">First Name</label>
            <input type="text" id="text" class="w-full max-w-lg rounded-lg border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40" />
          </div>
          <div class="flex flex-col">
            <label for="text" class="mb-2 font-semibold">Last Name</label>
            <input type="text" id="text" class="w-full max-w-lg rounded-lg border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40" />
          </div>
        </div>
      
      
<div class="relative">
  <div class="w-full rounded-xl bg-white p-4 shadow-2xl shadow-white/40">
  <label for="text" class="mb-2 font-semibold">Date of Birth</label>
    <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
  </div>
  <div>
  <input datepicker="" datepicker-format="mm/dd/yyyy" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 datepicker-input" placeholder="Select date"></input>
  </div>.
</div>

<div className="grid grid-cols-6 gap-3 mt-3">
              

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
                  pattern="[0-9]{5}"
                  required
                />
              </div>
            </div>

        
      <div>
        <button class="bg-sky-500 hover:bg-sky-700 ...">
        Save changes
        </button>
      </div>
        
        <div class="flex">
          
          <div class="flex items-center">
          </div>
        </div>
      </div>
    </main>
);
};
export default ProfilePage;
