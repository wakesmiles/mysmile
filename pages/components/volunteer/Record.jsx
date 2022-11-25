import { useState } from "react";
import { supabase } from "../../supabaseClient";

const Record = (props) => {
  const s = props.shift;
  const shiftDate =
    s.shift_date.slice(5, 7) +
    "/" +
    s.shift_date.slice(8, 10) +
    "/" +
    s.shift_date.slice(0, 4);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  // Format from military time to 12-hour with "AM" or "PM" specifications
  const formatTime = (time) => {
    let hour = parseInt(time.slice(0, 2));
    let suffix = hour > 12 ? "PM" : "AM";
    hour = String(hour > 12 ? hour - 12 : hour).padStart(2, "0");
    return hour + ":" + time.slice(3, 5) + " " + suffix;
  };

  const startTime = formatTime(s.start_time);
  const endTime = formatTime(s.end_time);

  return (
    <>
      <tr className="grid grid-cols-4 gap-4 px-6 mb-1">
        <td>{shiftDate}</td>
        <td>{startTime}</td>
        <td>{endTime}</td>
        <td>
          <button className="indigo-button-sm" onClick={(e) => volunteer(e)}>Sign Up</button>
        </td>
      </tr>
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
                            Sign-up was successful! You can check out your scheduled assignments in the "Sign-ups" tab.
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
        <></>
      )}
    </>
  );
};

export default Record;
