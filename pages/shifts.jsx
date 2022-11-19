const Record = (props) => {

    /**
     * TODO:
     * Modify so that a Record takes in parameters (in props object)
     */

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
};

const Shifts = () => {

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
