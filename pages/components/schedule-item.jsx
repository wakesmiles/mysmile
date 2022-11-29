import { useState } from "react";
import { formatDate, formatTime } from "./formatting";
import { FiTrash2 } from "react-icons/fi";
import { AiFillClockCircle } from "react-icons/ai";
import { supabase } from "../supabaseClient";

const ScheduleItem = (props) => {
  const [open, setOpen] = useState(false);
  const s = props.shift;
  const uid = props.uid;
  const today = (new Date()).toISOString().slice(0, 10);
  const refetch = props.refetch;

  const cancelShift = async () => {
    // Delete the volunteer sign-up from the user's schedule
    await supabase
      .from("signups")
      .delete()
      .eq("shift_id", s.shift_id)
      .eq("user_id", uid);

    // Increase the shift's number of available slots by 1
    await supabase
      .from("shifts")
      .select("remaining_slots")
      .eq("id", s.shift_id)
      .then(({ data, error }) => {
        if (data && data.length !== 0) return data[0].remaining_slots + 1;
      })
      .then(async (slots) => {
        await supabase
          .from("shifts")
          .update({ remaining_slots: slots })
          .eq("id", s.shift_id);
      });

    refetch(uid);
    setOpen(false);
  };

  const clockIn = async () => {
    const now = new Date();
    await supabase
      .from("signups")
      .update({
        clock_in: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
      })
      .eq("user_id", uid)
      .eq("shift_id", s.shift_id);
    
    refetch(uid);
  };

  const clockOut = async () => {
    const now = new Date();
    await supabase
      .from("signups")
      .update({
        clock_out: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
      })
      .eq("user_id", uid)
      .eq("shift_id", s.shift_id);

    // If volunteer completed an orientation shift, mark their orientation attendance
    if (s.shift_type === "orientation") {
      await supabase
        .from("profiles")
        .update({
          orientation: true,
        })
        .eq("id", uid);
    }

    refetch(uid);
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
              className="clock-button"
              disabled={today < s.shift_date}
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
              className="clock-button"
              disabled={today < s.shift_date}
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
        {open && (
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full z-10 items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <form className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-2 sm:p-8">
                  <div className="mt-3 pb-2 text-center sm:mt-0 sm:ml-0 sm:text-left border-b">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Cancel
                    </h3>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
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
        )}
      </td>
    </tr>
  );
};

export default ScheduleItem;
