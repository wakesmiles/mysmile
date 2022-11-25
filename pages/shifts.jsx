import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Link from "next/link";
import Navbar from "./navbar";
// import Record from './components/volunteer/Record';

/**
 * TODO:
 * Query database for current available shifts
 * - Filter based on upcoming shifts, and those with remaining_slots > 0
 * - Run separate queries for orientation vs volunteer shift types
 * - If the "orientation" field in the "profiles" table for the volunteer is FALSE,
 *   DON'T query/display for volunteer shifts
 *
 * When volunteer signs up,
 * - Decrease remaining_slots by 1 for the shift
 * - Add a new sign-up record to "sign-ups" table using shift information
 *
 * Ensure that volunteers somehow CAN'T sign up for the same shift multiple times
 */

const Shifts = () => {
  // Modal variables
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [shifts, setShifts] = useState([]);

  async function getData() {
    try {
      // Retrieve current user
      console.log('getting')
      await supabase.auth.getUser().then(async (data) => {
        if (data) {
          const id = data.data.user.id;

          // Get user information
          await supabase
            .from("profiles")
            .select("id, first_name, last_name, email, orientation")
            .eq("id", id)
            .then(async (user) => {
              if (user) {
                setUser(user.data[0]);

                const today = new Date().toISOString().slice(0, 10);
                const shiftType = user.orientation
                  ? "volunteer"
                  : "orientation";

                const uid = user.data[0].id;
                
                fetchShifts(uid, today, shiftType);
                
              }
            });
        }
      });
    } catch (e) {
      console.log("error fetching");
      console.log(e);
    }
  }

  async function fetchShifts(uid, currentDate, shiftType) {
    await supabase.from('signups').select('shift_id').eq('user_id', uid).then(async (res) => {
      let assigned = "("

      if (res.data) {
        res.data.forEach((s) => assigned += s.shift_id + "," );
        assigned = assigned.slice(0, -1) + ")"
      } else {
        assigned = "()"
      }

      await supabase
        .from("shifts")
        .select()
        .eq("shift_type", shiftType)
        .gte("shift_date", currentDate)
        .filter('id', 'not.in', assigned)
        .gt("remaining_slots", 0)
        .order("shift_date")
        .then((query) => {
          if (query) {
            setShifts(query.data);
          }
        });
    })
  }

  const shiftType = user.orientation ? "volunteer" : "orientation";

  useEffect(() => {
    getData();
    const subscription = supabase
      .channel("shift-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "shifts" },
        () => {
          fetchShifts(user.id, new Date().toISOString().slice(0, 10), shiftType);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  
  // UI for unauthenticated user
  if (!user) {
    return (
      <div>
        <p>No user data.</p>
        <div className="text-primary-color font-medium hover:underline hover:underline-offset-4">
          <Link href="/login">Click here to sign in or make an account.</Link>
        </div>
      </div>
    );
  }

  if (!shifts) {
    return (
      <div>
        No information available at this time.
      </div>
    )
  }

  // Format from military time to 12-hour with "AM" or "PM" specifications
  const formatTime = (time) => {
    let hour = parseInt(time.slice(0, 2));
    let suffix = hour > 12 ? "PM" : "AM";
    hour = String(hour > 12 ? hour - 12 : hour).padStart(2, "0");
    return hour + ":" + time.slice(3, 5) + " " + suffix;
  };

  // Format from YYYY-MM-DD to MM/DD/YYYY
  const formatDate = (date) => {
    return date.slice(5, 7) + "/" + date.slice(8, 10) + "/" + date.slice(0, 4);
  };

  /**
   * When volunteer signs up,
   * - Decrease remaining_slots by 1 for the shift
   * - Add a new sign-up record to "sign-ups" table using shift information
   */
  const volunteer = async (e, s) => {
    e.preventDefault();
    let success = false;
    try {
      await supabase
        .from("shifts")
        .update({
          remaining_slots: s.remaining_slots - 1,
        })
        .eq("id", s.id)
        .then(async () => {
          await supabase.from('signups').insert({
            user_id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            shift_id: s.id,
            shift_date: s.shift_date,
            shift_type: s.shift_type,
            start_time: s.start_time,
            end_time: s.end_time,
          }).then(() => {
            success = true;
          })
        });
    } catch (e) {
      console.log(e);
    } finally {
      if (success) {
        setMessage("Success! You can view your upcoming volunteer assignments in the 'Assignments' tab.")
      } else {
        setMessage("Attempt to sign-up was unsuccessful. Please reload the page and try again, or contact Wake Smiles administration.")
      }
      setOpen(true);
    }
  };

  return (
    <div className="flex flex-row">
      <Navbar />
      <div
        className="overflow-hidden bg-white shadow sm:rounded-lg"
        style={{ width: "700px" }}
      >
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium leading-6 text-gray-900">
            Available Shifts
          </h2>
        </div>

        <div className="border-t border-gray-200 ml-5">
          <h3 className="text-primary-color italic font-bold mt-5">
            {shiftType} shifts
          </h3>

          <table className="orientation-shifts mb-4 w-full">
            <thead>
              <tr className="grid grid-cols-4 gap-4 px-6 text-left">
                <th className="font-medium">Date</th>
                <th className="font-medium">Start Time</th>
                <th className="font-medium">End Time</th>
                <th className="font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((s) => {
                return (
                  <>
                    <tr key={s.id} className="grid grid-cols-4 gap-4 px-6 mb-1">
                      <td>{formatDate(s.shift_date)}</td>
                      <td>{formatTime(s.start_time)}</td>
                      <td>{formatTime(s.end_time)}</td>
                      <td>
                        <button
                          className="indigo-button-sm"
                          onClick={(e) => volunteer(e, s)}
                        >
                          Sign Up
                        </button>
                        {open ? (
                          <div className="fixed inset-0 z-10 overflow-y-auto">
                            <div className="flex min-h-full z-10 items-end justify-center p-4 text-center sm:items-center sm:p-0">
                              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-8">
                                  <div className="mt-3 text-center sm:mt-0 sm:ml-0 sm:text-left">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                                      Status
                                    </h3>
                                    <hr />
                                    <div className="mt-2">
                                      <p className="text-sm text-gray-500">
                                        Sign-up was successful! You can check
                                        out your scheduled assignments in the
                                        "Sign-ups" tab.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                  <button
                                    type="button"
                                    className="indigo-button-lg"
                                    onClick={() => setOpen(false)}
                                  >
                                    OK
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Shifts;
