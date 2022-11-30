import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Navbar from "./components/navbar";
import Loading from "./components/loading";
import Rerouting from "./components/rerouting";
import ScheduleItem from "./components/schedule-item";
import { getNow } from './components/formatting';

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
      const [date, time] = getNow();
      
      await supabase
        .from("signups")
        .select(
          "shift_id, shift_type, shift_date, start_time, end_time, clock_in, clock_out"
        )
        .eq("user_id", uid)
        .gte("shift_date", date)
        .order("shift_date", "start_time")
        .then(async ({ data, }) => {
          if (data) {
            const reduced = data.filter((v) => v.shift_date > date || (v.shift_date === date && v.end_time > time))
            setSchedule(reduced);
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
          {(schedule && schedule.length > 0) ? (
            <>
            <div className="text-sm flex flex-row align-middle justify-center">
              <div className="inline-flex items-center">
                <span className="w-2 h-2 inline-block bg-secondary-color rounded-full mr-2"></span>
                <span className="text-gray-900">Orientation</span>
              </div>
              <div className="inline-flex items-center ml-10">
                <span className="w-2 h-2 inline-block bg-indigo-400 rounded-full mr-2"></span>
                <span className="text-gray-900">Volunteer Shift</span>
              </div>
            </div>
          
            <div className="mt-6">
              <table className="w-full text-sm text-gray-700">
                <thead className="text-gray-900 border-b bg-white">
                  <tr>
                    <th scope="col" className="table-header"></th>
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
                  {schedule.map((s, i) => (
                      <ScheduleItem key={i} shift={s} uid={user.id} refetch={fetchSchedule}/>
                    ))}
                </tbody>
              </table>
            </div>
            </>
          ) : (
            <div className="flex flex-row align-middle justify-center">
              Your schedule is empty! Sign up for available shifts in the "Shifts" tab.
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
