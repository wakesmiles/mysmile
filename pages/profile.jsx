import { useRouter } from "next/router";
import { useState, useEffect, useRef, useReducer } from "react";
import { FiEdit } from "react-icons/fi";
import Navbar from "./navbar.jsx";
import { supabase } from './supabaseClient';
import Link from 'next/link'

function fetchResource() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getData() {
    try {
      setLoading(true);
      await supabase.auth.getUser().then(async (data, error) => {
        if (data) {
          const id = data.data.user.id;

          // Query again from profiles DB for current user info
          await supabase.from('profiles').select().eq('id', id).then((profile, err) => {
            if (profile) {
              return profile.data[0]
            }
          }).then((user) => {
            setData(user);
          })
        }
      })
    } catch (e) {
      console.log('in catch block e')
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return [data, loading]
}

const Profile = () => {
  const router = useRouter()
  const [data, loading] = fetchResource();

  if (loading) return <p>Loading...</p>
  
  if (!data) return (
    <div>
      <p>No profile data.</p>
      <div className="text-primary-color font-medium hover:underline hover:underline-offset-4">
        <Link href="/login">
          Click here to sign in or make an account.
        </Link>
      </div>
    </div>
  )

  // Editable values
  // const [phone, setPhone] = useState("asdf");
  // const [street, setStreet] = useState("asdf");
  // const [city, setCity] = useState("asdf");
  // const [state, setState] = useState("asdf");
  // const [zip, setZip] = useState("asdf");

  // Selection of US states for dropdown
  // const states = [
  //   "AL",
  //   "AK",
  //   "AZ",
  //   "AR",
  //   "CA",
  //   "CO",
  //   "CT",
  //   "DE",
  //   "DC",
  //   "FL",
  //   "GA",
  //   "HI",
  //   "ID",
  //   "IL",
  //   "IN",
  //   "IA",
  //   "KS",
  //   "KY",
  //   "LA",
  //   "ME",
  //   "MD",
  //   "MA",
  //   "MI",
  //   "MN",
  //   "MS",
  //   "MO",
  //   "MT",
  //   "NE",
  //   "NV",
  //   "NH",
  //   "NJ",
  //   "NM",
  //   "NY",
  //   "NC",
  //   "ND",
  //   "OH",
  //   "OK",
  //   "OR",
  //   "PA",
  //   "RI",
  //   "SC",
  //   "SD",
  //   "TN",
  //   "TX",
  //   "UT",
  //   "VT",
  //   "VA",
  //   "WA",
  //   "WV",
  //   "WI",
  //   "WY",
  // ];

  // const Option = (props) => <option>{props.label}</option>;

  // Modal display variables
  // const [open, setOpen] = useState(false);
  // const cancelButtonRef = useRef(null);

  // Save modal form changes to DB and update UI
  // const save = (e) => {
  //   e.preventDefault();

  //   // TODO: Check for valid inputs

  //   // TODO: Update DB

  //   // TODO: Make variable dependent on DB success
  //   const success = true;
  //   if (success) {
  //     console.log('aha')
  //   }
  // };

  return (
    <div className="flex flex-row">
      <Navbar/>
    <div className="container p-10">
    <div className="shadow sm:rounded-lg w-4/5">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg font-medium leading-6 text-gray-900">Profile</h2>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="profile-row bg-gray-50">
            <dt className="font-medium">Full Name</dt>
            <dd className="mt-1 sm:col-span-2 sm:mt-0">
              {data.first_name + " " + data.last_name}
            </dd>
          </div>
          <div className="profile-row bg-white">
            <dt className="font-medium">Date of Birth</dt>
            <dd className="mt-1 sm:col-span-2 sm:mt-0">{data.dob}</dd>
          </div>
          <div className="profile-row bg-gray-50">
            <dt className="font-medium">Role</dt>
            <dd className="mt-1 sm:col-span-2 sm:mt-0">{data.role}</dd>
          </div>
          <div className="profile-row bg-white">
            <dt className="font-medium flex flex-start">
              <p className="mr-2">Contact Info</p>
              {/* <button
                className="w-auto text-indigo-600"
                onClick={() => setOpen(true)}
              >
                <FiEdit />
              </button> */}
            </dt>
            <dd className="mt-1 sm:col-span-2 sm:mt-0">{data.email}</dd>
            <dt></dt>
            <dd className="mt-1 sm:col-span-2 sm:mt-0">{data.phone}</dd>
            <dt></dt>
            <dd className="mt-1 sm:col-span-2 sm:mt-0">
              {data.address + ", " + data.city + ", " + data.state + " " + data.zip}
            </dd>
          </div>
          <div className="profile-row bg-gray-50">
            <dt className="font-medium">Orientation Attendance</dt>
            <dd className="mt-1 sm:col-span-2 sm:mt-0">
              <input
                type="checkbox"
                checked={data.orientation}
                disabled={true}
                className="border-2 border-primary-color rounded-sm checked:bg-primary-color pointer-events-none"
              />
            </dd>
          </div>
        </dl>
      </div>
      {/* {open ? (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full z-10 items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <form className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-8">
                <div className="mt-3 text-center sm:mt-0 sm:ml-0 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Edit Contact Info
                  </h3>
                  <p className="text-sm italic my-2">
                    Email address is a unique identifier and cannot be edited.
                  </p>
                  <hr />
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="col-span-3">
                      <label
                        htmlFor="phone-number"
                        className="profile-input-label"
                      >
                        Phone (###-###-####)
                      </label>
                      <input
                        type="tel"
                        name="phone-number"
                        autoComplete="on"
                        className="profile-input"
                        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                        defaultValue={phone}
                        onChange={(e) => setPhone(e.value)}
                        required
                      />
                    </div>

                    <div className="col-span-3">
                      <label htmlFor="street" className="profile-input-label">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="street"
                        autoComplete="on"
                        className="profile-input"
                        defaultValue={street}
                        onChange={(e) => setStreet(e.value)}
                        required
                      />
                    </div>

                    <div className="col-span-1">
                      <label htmlFor="city" className="profile-input-label">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        autoComplete="on"
                        className="profile-input"
                        defaultValue={city}
                        onChange={(e) => setCity(e.value)}
                        required
                      />
                    </div>

                    <div className="col-span-1">
                      <label htmlFor="state" className="profile-input-label">
                        State / Province
                      </label>
                      <select
                        name="state"
                        autoComplete="on"
                        className="profile-input"
                        defaultValue={state}
                        onChange={(e) => setState(e.value)}
                        required
                      >
                        {states.map((v, i) => (
                          <Option key={i.toString()} label={v} />
                        ))}
                      </select>
                    </div>

                    <div className="col-span-1">
                      <label htmlFor="zip-code" className="profile-input-label">
                        ZIP Code (#####)
                      </label>
                      <input
                        type="text"
                        name="zip-code"
                        autoComplete="on"
                        className="profile-input"
                        pattern="[0-9]{5}"
                        defaultValue={zip}
                        onChange={(e) => setZip(e.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={(e) => save(e)}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setOpen(false)}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <></>
      )} */}
    </div>
    </div>
    </div>
  );
};

export default Profile;
