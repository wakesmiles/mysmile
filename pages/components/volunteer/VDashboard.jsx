const VolunteerDashboard = () => {

  const Row = (props) => {

    return (
      <tr className="border-t bg-white">
        <td className="py-2 px-6">01/01/2023</td>
        <td className="py-2 px-6">1:30 PM</td>
        <td className="py-2 px-6">5:00 PM</td>
        <td className="py-2 px-3">
          <div className="flex justify-center">
            <button className="indigo-button-sm">V</button>
          </div>
        </td>
        <td className="py-2 px-4">
          <div className="flex justify-center">
            <button className="indigo-button-sm">V</button>
          </div>
        </td>
        <td className="py-2 px-4">
          <div className="flex justify-center">
            <button className="red-button-sm">X</button>
          </div>
        </td>
      </tr>
    );
  };

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
                <th scope="col" className="py-2 px-3 text-base font-medium">
                  Clock In
                </th>
                <th scope="col" className="py-2 px-3 text-base font-medium">
                  Clock Out
                </th>
                <th
                  scope="col"
                  className="py-2 px-3 text-base font-medium"
                ></th>
              </tr>
            </thead>
            <tbody>
              <Row key={0}/>
              <Row key={1}/>
              <Row key={2}/>
              <Row key={3}/>
              <Row key={4}/>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
