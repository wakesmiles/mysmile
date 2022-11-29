import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Navbar from "./components/navbar";
import Loading from "./components/loading";
import Rerouting from "./components/rerouting";
import ScheduleItem from "./components/schedule-item";

function fetchResource() {
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
                fetchSchedule(profile.id);
              });
          }
        });
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }

    const fetchSchedule = async (uid) => {
      console.log('fetching new schedule')
      const today = new Date().toISOString().slice(0, 10);
      await supabase
        .from("signups")
        .select(
          "shift_id, shift_type, shift_date, start_time, end_time, clock_in, clock_out"
        )
        .eq("user_id", uid)
        .gte("shift_date", today)
        .order("shift_date", "start_time")
        .then(async ({ data, error }) => {
          if (data) {
            setSchedule(data);
          }
        });
    }

    useEffect(() => {
      getData();
    }, []);
  
    return [user, loading, schedule, setSchedule, fetchSchedule];
}

const Schedule = () => {

  const [user, loading, schedule, setSchedule, fetchSchedule] = fetchResource();
  
  // Empty UI for Loading State
  if (loading) {
    return <Loading />;
  }

  // UI for unauthenticated user
  if (!user) {
    return <Rerouting />;
  }

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
            <div>
              <table className="mt-5 w-full text-sm text-gray-700">
                <thead className="text-gray-900 border-b bg-white">
                  <tr>
                    <th scope="col" className="table-header">
                      Date
                    </th>
                    <th scope="col" className="table-header">
                      From
                    </th>
                    <th scope="col" className="table-header">
                      To
                    </th>
                    <th scope="col" className="table-header">
                      Clock In
                    </th>
                    <th scope="col" className="table-header">
                      Clock Out
                    </th>
                    <th scope="col" className="table-header"></th>
                  </tr>
                </thead>
                <tbody id="shifts">
                  {schedule &&
                    schedule.map((s, i) => (
                      <ScheduleItem key={i} shift={s} uid={user.id} refetch={fetchSchedule}/>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
