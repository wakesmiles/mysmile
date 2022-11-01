import { FiEdit } from "react-icons/fi";

const Profile = () => {
  const fname = "John";
  const lname = "Smith";
  const dob = "01/01/2001";
  const role = "pre-dental";
  const email = "johnsmith@email.com";
  const phone = "111-222-3333";
  const address = "101 Street";
  const city = "Chapel Hill";
  const state = "NC";
  const zip = "27516";
  const orientation = false;

  const edit = () => {
    console.log('editing');
  };

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg" style={{width: "700px"}}>
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg font-medium leading-6 text-gray-900">Profile</h2>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="profile-row bg-gray-50">
            <dt className="font-medium">Full Name</dt>
            <dd className="mt-1 sm:col-span-2 sm:mt-0">
              {fname + " " + lname}
            </dd>
          </div>
          <div className="profile-row bg-white">
            <dt className="font-medium">Date of Birth</dt>
            <dd className="mt-1 sm:col-span-2 sm:mt-0">{dob}</dd>
          </div>
          <div className="profile-row bg-gray-50">
            <dt className="font-medium">Role</dt>
            <dd className="mt-1 sm:col-span-2 sm:mt-0">{role}</dd>
          </div>
          <div className="profile-row bg-white">
            <dt className="font-medium flex flex-start">
              <p className="mr-2">Contact Info</p>
              <button className="w-auto text-indigo-600" onClick={edit}>
                <FiEdit />
              </button>
            </dt>
            <dd className="mt-1 sm:col-span-2 sm:mt-0">{email}</dd>
            <dt></dt>
            <dd className="mt-1 sm:col-span-2 sm:mt-0">{phone}</dd>
            <dt></dt>
            <dd className="mt-1 sm:col-span-2 sm:mt-0">
              {address + ", " + city + ", " + state + " " + zip}
            </dd>
          </div>
          <div className="profile-row bg-gray-50">
            <dt className="font-medium">Orientation Attendance</dt>
            <dd className="mt-1 sm:col-span-2 sm:mt-0">
              <input
                type="checkbox"
                checked={orientation}
                disabled={true}
                className="border-2 border-primary-color rounded-sm checked:bg-primary-color pointer-events-none"
              />
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default Profile;
