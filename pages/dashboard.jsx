import { useState, useRef, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { AiFillClockCircle } from "react-icons/ai";
import Navbar from "./components/navbar";
import Loading from "./components/loading";
import Rerouting from "./components/rerouting";
import { formatDate, formatTime } from "./components/formatting";
import { FiTrash2 } from "react-icons/fi";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  // Retrieve current user and get their information from "signups" table based on ID
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
            .then(async (profile) => {
              setUser(profile);

              const today = new Date().toISOString().slice(0, 10);

              // Query user shift schedule
              await supabase
                .from("signups")
                .select(
                  "shift_id, shift_type, shift_date, start_time, end_time, clock_in, clock_out, hours"
                )
                .eq("user_id", profile.id)
                .gte("shift_date", today)
                .then(async ({ data, error }) => {
                  if (data) {
                    setSchedule(data);
                  }
                });
            });
        }
      });
    } catch (err) {
    } finally {
      setLoading(false);
      return user;
    }
  }

  // Hook + Supabase subscription for refreshing data upon initial render and upon "shifts" table change
  useEffect(() => {
    getData().then((user) => {
      if (user) {
        const subscription = supabase
          .channel("signup-changes")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "signups" },
            (payload) => {
              console.log(payload); // Work-around to user auth in current state management
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(subscription);
        };
      }
    });
  }, []);

  // Empty UI for Loading State
  if (loading) {
    return <Loading />;
  }

  // UI for unauthenticated user
  if (!user) {
    return <Rerouting />;
  }

  const Row = (props) => {
    const [open, setOpen] = useState(false);
    const s = props.shift;

    // TODO: Account for errors
    // TODO: Refetch table data
    // TODO: Style modal, it's ugly
    const cancelShift = async () => {
      try {
        await supabase
          .from("signups")
          .delete()
          .eq("shift_id", s.shift_id)
          .eq("user_id", user.id)
          .then(async () => {
            await supabase
              .from("shifts")
              .select("remaining_slots")
              .eq("id", s.shift_id)
              .then(({ data, error }) => {
                if (data && data.length !== 0) {
                  return data[0].remaining_slots + 1;
                }
              })
              .then(async (slots) => {
                console.log("slots: " + slots);
                await supabase
                  .from("shifts")
                  .update({
                    remaining_slots: slots,
                  })
                  .eq("id", s.shift_id);
              });
          });
      } catch (err) {
        console.log("error in cancellation");
        console.log(err);
      } finally {
        setOpen(false);
      }
    };

    const clockIn = async () => {
      const today = new Date();
      const currTime =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const currDate =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();

      if (currDate !== s.shift_date) {
        alert("This shift isn't scheduled for today!");
        return;
      }

      await supabase.from("signups").update({
        clock_in: currTime,
      });
    };

    const clockOut = async () => {
      const today = new Date();
      const currTime =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

      if (!s.clock_in) {
        alert("You haven't clocked in yet!");
        return;
      }

      await supabase.from("signups").update({
        clock_out: currTime,
      });
    };

    return (
      <tr className="border-t bg-white">
        <td className="py-2 px-4 text-center">{formatDate(s.shift_date)}</td>
        <td className="py-2 px-4 text-center">{formatTime(s.start_time)}</td>
        <td className="py-2 px-4 text-center">{formatTime(s.end_time)}</td>
        <td className="py-2 px-4 text-center">
          {s.clock_in ? (
            formatTime(s.clock_in)
          ) : (
            <div className="flex justify-center">
              <button
                className="text-indigo-600 text-lg hover:text-indigo-800"
                onClick={() => clockIn()}
              >
                <AiFillClockCircle size={25} />
              </button>
            </div>
          )}
        </td>
        <td className="py-2 px-4 text-center">
          {s.clock_out ? (
            formatTime(s.clock_out)
          ) : (
            <div className="flex justify-center">
              <button
                className="text-indigo-600 text-lg hover:text-indigo-800"
                onClick={() => clockOut()}
              >
                <AiFillClockCircle size={25} />
              </button>
            </div>
          )}
        </td>
        <td className="py-2 px-3">
          <div className="flex justify-center">
            <button
              className="w-5 h-5 text-indigo-600"
              onClick={() => setOpen(true)}
            >
              <FiTrash2 className="w-full h-full" />
            </button>
          </div>
        </td>
        {open ? (
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full z-10 items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <form className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-2 sm:p-8">
                  <div className="mt-3 pb-2 text-center sm:mt-0 sm:ml-0 sm:text-left border-b">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Cancel
                    </h3>
                  </div>
                  <div>
                    <p className="text-lg italic mt-2">
                      Are you sure you want to cancel your volunteer shift?
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 flex flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="indigo-button-lg"
                    onClick={() => cancelShift()}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className="mt-3 mr-5 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    No
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <></>
        )}
      </tr>
    );
  };

  return (
    <div className="flex flex-row">
      <Navbar />
      <div className="container p-10">
        <div className="shadow sm:rounded-lg w-screen">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium leading-6 text-gray-900">
              Upcoming Schedule
            </h2>
          </div>
          <div className="border-t p-4">
            <div className="border shadow-sm sm:rounded-lg p-1 bg-white">
              <table className="mt-5 w-full text-sm text-gray-700">
                <thead className="text-gray-900 border-b bg-white">
                  <tr>
                    <th
                      scope="col"
                      className="py-2 px-4 text-base text-center font-medium"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="py-2 px-4 text-base text-center font-medium"
                    >
                      From
                    </th>
                    <th
                      scope="col"
                      className="py-2 px-4 text-base text-center font-medium"
                    >
                      To
                    </th>
                    <th scope="col" className="py-2 px-4 text-center font-medium">
                      Clock In
                    </th>
                    <th scope="col" className="py-2 px-4 text-center font-medium">
                      Clock Out
                    </th>
                    <th
                      scope="col"
                      className="py-2 px-3 text-center font-medium"
                    ></th>
                  </tr>
                </thead>
                <tbody id="shifts">
                  {schedule && (
                    <>
                      {schedule.map((s, i) => (
                        <Row key={i} shift={s} />
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
