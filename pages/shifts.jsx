import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useRouter } from "next/router";
import Link from "next/link";
{
  /** 
    /**
     * TODO:
     * Modify so that a Record takes in parameters (in props object)
     */
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
}

function fetchResource() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shifts, setShifts] = useState([]);

  // Attempt to retrieve current user and get their information from "profiles" table based on ID
  async function getData() {
    try {
      setLoading(true);

      await supabase.auth.getUser().then(async (data) => {
        if (data) {
          const id = data.data.user.id;

          await supabase.from("profiles").select("id", "orientation").eq("id", id).then(async (user) => {
            if (user) {

              console.log(user);
              setUser(user);

              const today = new Date().toISOString().slice(0, 10);
              const shiftType = user.orientation ? 'volunteer' : 'orientation';

              await supabase.from("shifts").select("shift_type, shift_date, start_time, end_time")
                .eq('shift_type', shiftType).gte("shift_date", today).gt("remaining_slots", 0)
                .then((query) => {
                  if (query) {
                    console.log(query);

                  }

                })
            }
            });
        }
      });
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return [user, shifts, setShifts, loading, setLoading];
}

const Record = (props) => {
  {
    return (
      <tr className="grid grid-cols-4 gap-4 px-6 mb-1">
        <td>{props.shiftDate}</td>
        <td>{props.start}</td>
        <td>{props.end}</td>
        <td>
          <button className="indigo-button-sm">Sign Up</button>
        </td>
      </tr>
    );
  }
};

const Shifts = () => {

  const [user, shifts, setShifts, loading, setLoading] = fetchResource();
  // const shiftType = user.orientation ? 'volunteer' : 'orientation';

  // UI for load state
  if (loading) return <p>Loading...</p>;

  // UI for unauthenticated user
  if (!shifts) {
    return (
      <div>
        <p>No profile data.</p>
        <div className="text-primary-color font-medium hover:underline hover:underline-offset-4">
          <Link href="/login">Click here to sign in or make an account.</Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden bg-white shadow sm:rounded-lg"
      style={{ width: "700px" }}
    >
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg font-medium leading-6 text-gray-900">
          Upcoming Shifts
        </h2>
      </div>

      <div className="border-t border-gray-200 ml-5">
        <h3 className="text-primary-color italic font-bold mt-5">
          {"shiftType"} shifts
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
            
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Shifts;
