import { AiFillClockCircle } from "react-icons/ai";
import { useState, useRef, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Navbar from './navbar';

const Dashboard = () => {
  const[shifts, setShifts] = useState(null)

  useEffect(() => {
    const getShifts = async() => {
      const { data, error } = await supabase
        .from('signups')
        .select()

        if(error) {
          console.log(error)
        }
        if (data) {
          setShifts(data)
        }
    }
    getShifts()

  }, [])
    
  const Row = ({ shift }) => {
    // Modal display variables
    const [open, setOpen] = useState(false);
    const cancelButtonRef = useRef(null);

    /**
     * TODO: Implement shift cancellation
     * In the "shifts" table, add 1 to the "remaining_slots" field for this shift
     * In the "signups" table, delete this record
     */
    const cancelShift = async () => {
      await supabase.from("signups").delete().eq("shift_id", shift.id)
      slots = await supabase.from("shifts").select("remaining_slots").eq("shift_id", shift.id) + 1
      await supabase.from("shifts").update({remaining_slots: {slots}}).eq("shift_id", shift.id)
    };

    /**
     * TODO: Implement clocking in
     * Check that the shift date matches current date
     * Check that the user is clocking in within 5 min (before or after) shift start time
     * If not valid, display some kind of alert that user can't clock in right now!
     *
     * In "signups" table, update the record with current time as clock-in time
     *
     * Update from icon to displaying clock-in time in the date
     */
    
    const clockIn = async () => {
      var today = new Date(),
   
      time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

      const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()

      if(date != shift.shift_date) {
        alert("You can't clock in at this time")
      } else if (shift.clock_in != null) {
        alert("You have already clocked in for this shift")
      } else {
        await supabase.from("signups").update({clock_in: {time} })
      }
    };

    /**
     * TODO: Implement clocking out
     * Check that the shift date matches current date
     * If not valid, display some kind of alert that user can't clock out right now!
     *
     * In "signups" table, update the record with current time as clock-out time
     *
     * Update from icon to displaying clock-out time in the date
     */
    const clockOut = async () => {
      var today = new Date(),
   
      time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

      const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()

      if(date != shift.shift_date) {
        alert("You can't clock out at this time")
      } else if (shift.clock_in != null) {
        alert("You have already clocked out for this shift")
      } else {
        await supabase.from("signups").update({clock_out: {time} })
      }
    };

    return (
      <tr className="border-t bg-white">
        <td className="py-2 px-6">{shift.shift_date}</td>
        <td className="py-2 px-6">{shift.start_time}</td>
        <td className="py-2 px-6">{shift.end_time}</td>
        <td className="py-2 px-6">
          <div className="flex justify-center">
            <button onClick={() => clockIn()} className="text-indigo-600 text-lg hover:text-indigo-800">
              <AiFillClockCircle size={25} />
            </button>
          </div>
        </td>
        <td className="py-2 px-6">
          <div className="flex justify-center">
            <button onClick={() => clockOut()} className="text-indigo-600 text-lg hover:text-indigo-800">
              <AiFillClockCircle size={25} />
            </button>
          </div>
        </td>
        <td className="py-2 px-3">
          <div className="flex justify-center">
            <button className="red-button-sm" onClick={() => setOpen(true)}>
              X
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
                      Cancel Shift
                    </h3>
                  </div>
                  <div>
                    <p className="text-lg italic mt-2">
                      Are you sure you want to cancel this shift?
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 flex flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="indigo-button-lg"
                    onClick={(e) => {cancelShift(e); () => setOpen(false)}}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className="mt-3 mr-5 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
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
        <div className="shadow sm:rounded-lg w-4/5">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium leading-6 text-gray-900">
              Upcoming Shifts
            </h2>
          </div>
          <div className="border-t p-4">
            <div className="border shadow-sm sm:rounded-lg p-1 bg-white">
              <table className="mt-5 w-full text-sm text-gray-700">
                <thead className="text-gray-900 border-b bg-white">
                  <tr>
                    <th
                      scope="col"
                      className="py-2 px-6 text-base text-left font-medium"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="py-2 px-6 text-base text-left font-medium"
                    >
                      From
                    </th>
                    <th
                      scope="col"
                      className="py-2 px-6 text-base text-left font-medium"
                    >
                      To
                    </th>
                    <th scope="col" className="py-2 px-6 text-base font-medium">
                      Clock In
                    </th>
                    <th scope="col" className="py-2 px-6 text-base font-medium">
                      Clock Out
                    </th>
                    <th
                      scope="col"
                      className="py-2 px-3 text-base font-medium"
                    ></th>
                  </tr>
                </thead>
                <tbody id="shifts">
                {shifts && (
                  <>
                    {shifts.map(shift => (
                      <Row key = {shift.id} shift = {shift} />
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
