import { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import Loading from "./components/load";
import Rerouting from "./components/reroute";
import { supabase } from "../utils/supabaseClient";
import { formatTime, formatDate, getNow } from "../utils/date-time";
import Head from "next/head";

const Shifts = () => {
  // Modal variables
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  // Data variables
  const [user, setUser] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [shiftType, setShiftType] = useState("");
  const [loading, setLoading] = useState(true);

  // Client-side data fetching for initial render
  async function getData() {
    try {
      await supabase.auth.getUser().then(async ({ data, error }) => {
        if (error) {
          return;
        } else if (data) {
          const id = data.user.id;

          // Get user information
          await supabase
            .from("profiles")
            .select("id, first_name, last_name, email, orientation")
            .eq("id", id)
            .then(async ({ data }) => {
              if (data && data.length > 0) {
                const sType = data[0].orientation ? "volunteer" : "orientation";
                const uid = data[0].id;

                setUser(data[0]);
                setShiftType(sType.charAt(0).toUpperCase() + sType.slice(1));

                // Query shift information
                fetchShifts(uid, sType);
              }
            });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Attempts to retrieve:
   * upcoming shifts from current date-time and onwards,
   * of the necessary shift type (either orientation or volunteer),
   * with open slots left,
   * that the user has not already signed up for,
   * sorted by shift date and start time
   */
  async function fetchShifts(uid, shiftType) {
    await supabase
      .from("signups")
      .select("shift_id")
      .eq("user_id", uid)
      .then(async ({ data }) => {
        let assigned = "(";

        if (data && data.length > 0) {
          data.forEach((s) => (assigned += s.shift_id + ","));
          assigned = assigned.slice(0, -1);
          assigned += ")";
        } else {
          assigned = "()";
        }

        const [date, time] = getNow();

        await supabase
          .from("shifts")
          .select()
          .eq("shift_type", shiftType)
          .gte("shift_date", date)
          .filter("id", "not.in", assigned)
          .gt("remaining_slots", 0)
          .order("shift_date", { ascending: true })
          .order("start_time", { ascending: true })
          .then(({ data }) => {
            if (data) {
              const reduced = data.filter(
                (v) =>
                  v.shift_date > date ||
                  (v.shift_date === date && v.end_time > time)
              );
              setShifts(reduced);
            }
          });
      });
  }

  // Hook + Supabase subscription for refreshing data upon initial render and upon "shifts" table change
  useEffect(() => {
    getData().then(() => {
      setLoading(false);
    });

    const subscription = supabase
      .channel("shift-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "shifts" },
        () => {
          getData(); // Work-around to user auth in current state management
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Empty UI for Loading State
  if (loading) {
    return <Loading />;
  }

  // UI for unauthenticated user
  if (!user) {
    return <Rerouting />;
  }

  /**
   * Attempts to volunteer user for specific shift
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
          await supabase
            .from("signups")
            .insert({
              user_id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              shift_id: s.id,
            })
            .then(() => {
              success = true;
            });
        });
    } catch (e) {
      return;
    } finally {
      if (success) {
        setMessage(
          "Success! You can view your upcoming volunteer shifts in your schedule."
        );
      } else {
        setMessage(
          "Attempt to sign-up was unsuccessful. Please reload the page and try again, or contact Wake Smiles administration."
        );
      }
      setOpen(true);
    }
  };

  return (
    <div>
      <Head>
        <title>MySmile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-row">
        <Navbar />
        <div className="container p-10">
          <div className="shadow sm:rounded-lg w-4/5">
            <div className="px-4 py-5 sm:px-6">
              <h2>Available {shiftType} Shifts</h2>
            </div>

            <div className="border-t border-gray-200 p-4">
              {shifts && shifts.length > 0 ? (
                <div className="mt-6 overflow-y-scroll w-full h-full max-w-full max-h-96 scrollbar">
                  <table className="text-sm text-gray-700 w-full">
                    <thead className="text-gray-900 bg-white">
                      <tr className="text-left">
                        <th scope="col" className="table-header">
                          Date
                        </th>
                        <th scope="col" className="table-header">
                          Start Time
                        </th>
                        <th scope="col" className="table-header">
                          End Time
                        </th>
                        <th scope="col" className="table-header"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {shifts.map((s) => {
                        return (
                          <tr key={s.id} className="border-t bg-white text-sm">
                            <td className="py-2 px-3 text-center">
                              {formatDate(s.shift_date)}
                            </td>
                            <td className="py-2 px-3 text-center">
                              {formatTime(s.start_time)}
                            </td>
                            <td className="py-2 px-3 text-center">
                              {formatTime(s.end_time)}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <button
                                className="indigo-button-sm"
                                onClick={(e) => volunteer(e, s)}
                              >
                                Sign Up
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="mt-5 w-full">
                  No available shifts at the moment! Check back in later.
                </div>
              )}
            </div>

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
                          <p className="text-sm text-gray-500">{message}</p>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shifts;
