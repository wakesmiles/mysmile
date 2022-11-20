const Row = () => {
  return (
    <tr className="bg-white border-b dark:bg-gray-100 dark:border-gray-700">
      <td className="py-2 px-6">01/01/2023</td>
      <td className="py-2 px-6">1:30 PM</td>
      <td className="py-2 px-6">5:00 PM</td>
      <td className="py-2 px-6">
        <button className="red-button-sm">
            V
        </button>
      </td>
      <td className="py-2 px-6">
        <button className="red-button-sm">
            V
        </button>
      </td>
      <td className="py-2 px-6">
        <button className="red-button-sm">
            X
        </button>
      </td>
    </tr>
  );
};

const VolunteerDashboard = () => {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg"
        style={{width: "700px"}}>
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg font-medium leading-6 text-gray-900">
          Upcoming Shifts
        </h2>
      </div>
      <div className="border-t p-4">
        <div className="border sm:rounded-lg">
        <table className="mt-5 w-full text-sm text-left text-gray-500">
          <thead className="text-gray-800 border-b bg-white">
            <tr>
              <th scope="col" className="py-2 px-6 text-base font-medium">
                Date
              </th>
              <th scope="col" className="py-2 px-6 text-base font-medium">
                From
              </th>
              <th scope="col" className="py-2 px-6 text-base font-medium">
                To
              </th>
              <th scope="col" className="py-2 px-6 text-base font-medium">
                Clock In
              </th>
              <th scope="col" className="py-2 px-6 text-base font-medium">
                Clock Out
              </th>
              <th scope="col" className="py-2 px-6 text-base font-medium">
              </th>
            </tr>
          </thead>
          <tbody>
            <Row />
            <Row />
            <Row />
            <Row />
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
