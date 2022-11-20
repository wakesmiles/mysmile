const VolunteerDashboard = () => {
  return (
  
<div className="overflow-x-auto relative shadow-md sm:rounded-lg flex justify-center py-36 px-4">
    <table className="w-fit text-sm text-left text-gray-500 dark:text-gray-400 ">
        <caption className="p-5 text-2xl font-semibold text-left text-primary-color bg-white dark:text-primary-color dark:bg-gray-100">
            Upcoming Shifts
        </caption>
        <thead className="text-xs text-white uppercase bg-primary-color dark:bg-primary-color dark:text-white">
            <tr>
                <th scope="col" className="py-3 px-6">
                    Date
                </th>
                <th scope="col" className="py-3 px-6">
                    Time
                </th>
                <th scope="col" className="py-3 px-6">
                    Category
                </th>
                <th scope="col" className="py-3 px-6">
                    Actions
                </th>
                <th scope="col" className="py-3 px-6">
                    <span className="sr-only">Edit</span>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr className="bg-white border-b dark:bg-gray-100 dark:border-gray-700">
                <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-black">
                    01/01/2023
                </th>
                <td className="py-4 px-6 dark:text-black">
                    1:30 PM
                </td>
                <td className="py-4 px-6 dark:text-black">
                    Front Desk
                </td>
                <td className="py-4 px-6 text-right">
                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                </td>
                <td className="py-4 px-6 text-right">
                    <a href="#" className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</a>
                </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-100 dark:border-gray-700">
                <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-black">
                    01/02/2023
                </th>
                <td className="py-4 px-6 dark:text-black">
                    1:30 PM
                </td>
                <td className="py-4 px-6 dark:text-black">
                    Front Desk
                </td>
                <td className="py-4 px-6 text-right">
                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                </td>
                <td className="py-4 px-6 text-right">
                    <a href="#" className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</a>
                </td>
            </tr>
            <tr className="bg-white dark:bg-gray-100">
                <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-black">
                    01/03/2023
                </th>
                <td className="py-4 px-6 dark:text-black">
                    1:30 PM
                </td>
                <td className="py-4 px-6 dark:text-black">
                    Front Desk
                </td>
                <td className="py-4 px-6 text-right">
                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                </td>
                <td className="py-4 px-6 text-right">
                    <a href="#" className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</a>
                </td>
            </tr>
        </tbody>
    </table>
</div>
 );
};

export default VolunteerDashboard;
