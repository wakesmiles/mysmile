import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useReducer,
} from "react";
import { supabase } from "./supabaseClient";
import { useRouter } from "next/router";
import { FiEdit } from "react-icons/fi";

import Link from "next/link";
import { waitUntilSymbol } from "next/dist/server/web/spec-extension/fetch-event";
{
  /** 
    /**
     * TODO:
     * Modify so that a Record takes in parameters (in props object)
     */
  /** 
  return (
    <tr className="grid grid-cols-4 gap-4 px-6 mb-1">
      <td>01/01/2022</td>
      <td>5:00 pm</td>
      <td>6:00 pm</td>
      <td>
        <button className="indigo-button-sm">Sign Up</button>
      </td>
    </tr>
  );
  */
  /**
   * TODO:
   * Query database for current available shifts
   * - Filter based on upcoming shifts (at least one day into the future), and those with remaining_slots > 0
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
var orientationFlag = false;

/**
 * Method for initially fetching shift information upon render from client-side
 * Should change when converting all interactions with DB to API routes
 */
/**
  async function testThing() {
  let today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("shifts")
    .select("id, shift_type, shift_date, start_time, end_time")
    .gt("shift_date", today)
    .gt("remaining_slots", 0)
    .eq("shift_type", "volunteer");
  console.log(data);
  console.log(data[0].end_time);
  //console.log(error);
}

testThing();
*/
function fetchResource() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Attempt to retrieve current user and get their information from "profiles" table based on ID
  async function getData() {
    try {
      setLoading(true);

      await supabase.auth.getUser().then(async (data, error) => {
        if (data) {
          const id = data.data.user.id;
          const orientation = data.data.user.orientation;
          orientationFlag = orientation;
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
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return [data, setData, loading, setLoading];
}

const findShiftType = () => {
  const router = useRouter();

  // Modal display variables
  const [open, setOpen] = useState(false);

  const [data, setData, loading, setLoading] = fetchResource();

  // UI for load state
  if (loading) return <p>Loading...</p>;

  // UI for unauthenticated user
  if (!data)
    return (
      <div>
        <p>No profile data.</p>
        <div className="text-primary-color font-medium hover:underline hover:underline-offset-4">
          <Link href="/login">Click here to sign in or make an account.</Link>
        </div>
      </div>
    );

  const Option = (props) => <option>{props.label}</option>;

  const checkOrientation = async (e) => {
    e.preventDefault();
    let success = false;

    const { error } = await supabase
      .from("profiles")
      .eq("id", data.id)
      .then(() => (success = true));

    if (success) {
      console.log("aha");
      orientationFlag = data.orientation;

      setOpen(false);
    } else {
      console.log(error);
    }
  };
};
//^^ Re-fetch/render from database for the same user after update
const queryShifts = async () => {
  var dataShifts = [
    {
      shift_type: " ",
      shift_date: " ",
      start_time: " ",
      end_time: " ",
    },
  ];

  if (orientationFlag) {
    let today = new Date().toISOString().slice(0, 10);

    const { data, error } = await supabase
      .from("shifts")
      .select("shift_type, shift_date, start_time, end_time")
      .gt("shift_date", today)
      .gt("remaining_slots", 0)
      .eq("shift_type", "volunteer");
    console.log("i");

    dataShifts = data;
  } else {
    let today = new Date().toISOString().slice(0, 10);
    console.log("e");

    const { data, error } = await supabase
      .from("shifts")
      .select("shift_type, shift_date, start_time, end_time")
      .gt("shift_date", today)
      .gt("remaining_slots", 0)
      .eq("shift_type", "orientation");
    dataShifts = data;
  }

  //test here console
  //console.log(dataShifts[1].end_time);
  return dataShifts;
};

/**
const oShifts = async () => {
  let today = new Date().toISOString().slice(0, 10);
  //console.log('o')
  const {data, error} = await supabase
    .from("shifts")
    .select("shift_type, shift_date, start_time, end_time")
    .gt("shift_date", today)
    .gt("remaining_slots", 0)
    .eq("shift_type", "orientation");
    setDataShifts(data)
    console.log(data[0].end_time)
};
*/
const Single_shift = (props) => {
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
const Record = (props) => {
  {
    return (
      <tr className="grid grid-cols-4 gap-4 px-6 mb-1">
        <td>06/08/2022</td>
        <td>1:00 PM</td>
        <td>3:00 PM</td>
        <td>
          <button className="indigo-button-sm">Sign Up</button>
        </td>
      </tr>
    );
  }
};
//As soon as this function can pass in a queried value, this code should work (will need to check queries still)
async function PrintShiftsAsync() {
  console.log("printshifts");

  const outputTable = await queryShifts();
  outputTable.sort((a, b) => (a.shift_date > b.shift_date) ? 1 : -1);
  const out = [];
  for (let i = 0; i < outputTable.length; i++) {
    const sD = outputTable[i].shift_date;
    const st = outputTable[i].start_time;
    const nd = outputTable[i].end_time;

    out.push(<Single_shift shiftDate={sD} start={st} end={nd} />);
  }
  
  return out;
}
function PrintShifts() {
  const [data, setData] = useState("");
  useEffect(() => {
    PrintShiftsAsync().then((out) => setData(out));
  });

  return data;
}
const Shifts = () => {
  var shiftType = orientationFlag ? "Volunteer Shifts" : "Orientation Shifts";

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
          {shiftType}
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
            <Record className="bg-gray-50" />
            <Record className="bg-white" />
            <Record className="bg-gray-50" />
            <Record className="bg-white" />
            <Record className="bg-gray-50" />
            <PrintShifts />
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Shifts;
