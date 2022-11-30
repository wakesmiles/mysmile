import { useState, useEffect, useRef } from "react";
import { FiEdit } from "react-icons/fi";
import Navbar from "./components/navbar";
import Loading from "./components/load";
import Rerouting from "./components/reroute";
import { formatDate } from './components/date-time';
import states from "./components/state-abbrev";
import { supabase } from "./supabaseClient";

/**
 * Method for initially fetching user info upon render from client-side
 * If converting all interactions with database to Next.js API routes, should change
 */
function fetchResource() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Retrieve current user and get their information from "profiles" table based on ID
  async function getData() {
    try {
      setLoading(true);

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
            .then((user) => {
              setData(user);
            });
        }
      });
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return [data, setData, loading, setLoading];
}

const Profile = () => {
  // Modal display variables
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);

  // Editable fields for user
  const phone = useRef();
  const address = useRef();
  const city = useRef();
  const state = useRef();
  const zip = useRef();

  const [data, setData, loading, setLoading] = fetchResource();

  // Empty UI for Loading State
  if (loading) {
    return <Loading />;
  }

  // UI for unauthenticated user
  if (!data) {
    return <Rerouting />;
  }

  // UI for US state abbreviations dropdown list
  const Option = (props) => <option>{props.label}</option>;

  // Save modal form changes to DB and update UI
  const save = async (e) => {
    e.preventDefault();
    let success = false;

    const { error } = await supabase
      .from("profiles")
      .update({
        phone: phone.current.value,
        address: address.current.value,
        city: city.current.value,
        state: state.current.value,
        zip: zip.current.value,
      })
      .eq("id", data.id)
      .then(() => (success = true));

    if (success) {
      console.log("aha");
      refetch();
      setOpen(false);
    } else {
      console.log(error);
    }
  };

  // Re-fetch/render from database for the same user after update
  const refetch = async () => {
    await supabase
      .from("profiles")
      .select()
      .eq("id", data.id)
      .then((profile, err) => {
        if (profile) {
          return profile.data[0];
        } else {
          console.log(err);
        }
      })
      .then((user) => {
        setData(user);
      });
  };

  return (
    <div className="flex flex-row">
      <Navbar />
      <div className="container p-10">
        <div className="shadow sm:rounded-lg w-4/5">
          <div className="px-4 py-5 sm:px-6">
            <h2>
              Profile
            </h2>
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
                <dd className="mt-1 sm:col-span-2 sm:mt-0">{formatDate(data.dob)}</dd>
              </div>
              <div className="profile-row bg-gray-50">
                <dt className="font-medium">Role</dt>
                <dd className="mt-1 sm:col-span-2 sm:mt-0">{data.role}</dd>
              </div>
              <div className="profile-row bg-white">
                <dt className="font-medium flex flex-start">
                  <p className="mr-2">Contact Info</p>
                  <button
                    className="w-auto text-indigo-600"
                    onClick={() => setOpen(true)}
                  >
                    <FiEdit />
                  </button>
                </dt>
                <dd className="mt-1 sm:col-span-2 sm:mt-0">{data.email}</dd>
                <dt></dt>
                <dd className="mt-1 sm:col-span-2 sm:mt-0">{data.phone}</dd>
                <dt></dt>
                <dd className="mt-1 sm:col-span-2 sm:mt-0">
                  {data.address +
                    ", " +
                    data.city +
                    ", " +
                    data.state +
                    " " +
                    data.zip}
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
          {open ? (
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full z-10 items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <form
                  method="PUT"
                  onSubmit={(e) => save(e)}
                  className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                >
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-8">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-0 sm:text-left">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Edit Contact Info
                      </h3>
                      <p className="text-sm italic my-2">
                        Email address is a unique identifier and cannot be
                        edited.
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
                            ref={phone}
                            type="tel"
                            name="phone-number"
                            autoComplete="on"
                            className="profile-input"
                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                            defaultValue={data.phone}
                            required
                          />
                        </div>

                        <div className="col-span-3">
                          <label
                            htmlFor="street"
                            className="profile-input-label"
                          >
                            Street Address
                          </label>
                          <input
                            ref={address}
                            type="text"
                            name="street"
                            autoComplete="on"
                            className="profile-input"
                            defaultValue={data.address}
                            required
                          />
                        </div>

                        <div className="col-span-1">
                          <label htmlFor="city" className="profile-input-label">
                            City
                          </label>
                          <input
                            ref={city}
                            type="text"
                            name="city"
                            autoComplete="on"
                            className="profile-input"
                            defaultValue={data.city}
                            required
                          />
                        </div>

                        <div className="col-span-1">
                          <label
                            htmlFor="state"
                            className="profile-input-label"
                          >
                            State / Province
                          </label>
                          <select
                            ref={state}
                            name="state"
                            autoComplete="on"
                            className="profile-input"
                            defaultValue={data.state}
                            required
                          >
                            {states.map((v, i) => (
                              <Option key={i.toString()} label={v} />
                            ))}
                          </select>
                        </div>

                        <div className="col-span-1">
                          <label
                            htmlFor="zip-code"
                            className="profile-input-label"
                          >
                            ZIP Code (#####)
                          </label>
                          <input
                            ref={zip}
                            type="text"
                            name="zip-code"
                            autoComplete="on"
                            className="profile-input"
                            pattern="[0-9]{5}"
                            defaultValue={data.zip}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="submit"
                      className="indigo-button-lg ml-3"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
