import React, { useEffect, useState, useRef, useContext, useReducer } from "react";
import { supabase } from "./supabaseClient"
import { useRouter } from "next/router";
import { FiEdit } from "react-icons/fi";
import Navbar from "./navbar.jsx";
import Link from 'next/link'
{
/**
  var displayShifts

const Shifts = () => {
  const[oCheck, setOCheck] = useState(false)
  const[user, setUser] = useState('')
  const[availableShifts, setAvailableShifts] = useState('')
  useEffect(() => {
    //this useEffect statement takes current user and checks whether they have attended Orientation.
    setUser(supabase.auth.getUser())
    const { data, error} = async() => await supabase
    .from('profiles')
    .select('orientation')
    .eq('id', user.id)
    .single()

    .catch(console.error) 
    if (data) {
      setOCheck(data.orientation)
    }
  })
  useEffect(() => { 
    //this useEffect statement takes the orientation check and returns the corresponding table
    let today = new Date().toISOString().slice(0, 10)
    if (oCheck == false) {
      
      const available = async() => await supabase
      .from('shifts')
      .select('shift_type, shift_date, start_time, end_time')
      .gt('shift_date', today)
      .gt('remaining_slots', 0)
      .eq('shift_type', 'orientation')

      setAvailableShifts(available)
    } else {
      const available = async() => await supabase
      .from('shifts')
      .select('shift_type, shift_date, start_time, end_time')
      .gt('shift_date', today)
      .gt('remaining_slots', 0)
      setAvailableShifts(available)
    }
    displayShifts = availableShifts
  })
  
  const Record = (props) => {
    
      const [shiftType, setShiftType] = useState('None');
      const [shiftDate, setShiftDate] = useState('');
      const [shiftStart, setShiftStart] = useState('');
      const [shiftEnd, setShiftEnd] = useState('');
      var i = 0;
useEffect(() => 
      {if (i < availableShifts.length) {
          setShiftType(entry[0])
          setShiftDate(entry[1])
          setShiftStart(entry[2])
          setShiftEnd(entry[3])
          i++
          return (
            <tr className="grid grid-cols-4 gap-4 px-6 mb-1">
              <td><var>shiftDate</var></td>
              <td><var>shiftStart</var></td>
              <td><var>shiftEnd</var></td>
              <td>
                <button className="indigo-button-sm">Sign Up</button>
              </td>
            </tr>
          );
      }
      return;
    }, []
    )
    
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
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return [data, setData, loading, setLoading]
}

const findShiftType = () => {
  const router = useRouter()

  // Modal display variables
  const [open, setOpen] = useState(false);


    
  const [data, setData, loading, setLoading] = fetchResource();

  // UI for load state
  if (loading) return <p>Loading...</p>
  
  // UI for unauthenticated user
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

 
  const Option = (props) => <option>{props.label}</option>;


  const checkOrientation = async (e) => {
    e.preventDefault();
    let success = false;

    const { error } = await supabase.from('profiles').eq('id', data.id).then(() => success = true);

    if (success) {
      console.log('aha')
      orientationFlag = data.orientation
      refetch();
      setOpen(false);
    } else {
      console.log(error);
    }
  };

  // Re-fetch/render from database for the same user after update
  const refetch = async () => {
    await supabase.from('profiles').select().eq('id', data.id).then((profile, err) => {
      if (profile) {
        return profile.data[0]
      } else {
        console.log(err);
      }
    }).then((user) => {
      setData(user);
    })
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
            Orientation Shifts
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
            </tbody>
        </table>
        <h3 className="text-primary-color italic font-bold mt-5">
            Volunteer Shifts
        </h3>
        <table className="volunteer-shifts mb-4 w-full">
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
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default Shifts;
