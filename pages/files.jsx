import { useEffect, useState } from "react";
import { SlCloudUpload } from "react-icons/sl";
import { FiTrash2 } from "react-icons/fi";
import { MdDownload } from "react-icons/md";
import Navbar from "./components/navbar";
import Loading from "./components/loading";
import Rerouting from "./components/rerouting";
import { supabase } from "./supabaseClient";
import { saveAs } from 'file-saver';

/**
 * Method for initially fetching user info upon render from client-side
 * Should change when converting all interactions with DB to API routes
 */
function fetchResource() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState("");
  const [files, setFiles] = useState([]);

  // Attempt to retrieve current user and get their information from "profiles" table based on ID
  async function getData() {
    try {
      setLoading(true);

      await supabase.auth.getUser().then(async (data, err) => {
        if (data) {
          const id = data.data.user.id;
          await supabase
            .from("profiles")
            .select("id, first_name, last_name")
            .eq("id", id)
            .then((profile, err) => {
              if (profile) {
                return profile.data[0];
              }
            })
            .then(async (user) => {
              setUser(user);

              const folderPath =
                user.first_name +
                "_" +
                user.last_name +
                "_" +
                user.id.slice(0, 5);
              setFolder(folderPath);

              await supabase.storage
                .from("test")
                .list(folderPath, {
                  limit: 10,
                  offset: 0,
                  sortBy: { column: "created_at", order: "desc" },
                })
                .then((data) => {
                  if (data) {
                    setFiles(data.data);
                  }
                });
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

  return [user, loading, folder, files, setFiles];
}

const Upload = () => {
  // Modal variables
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [user, loading, folder, files, setFiles] = fetchResource();

  // Empty UI for Loading State
  if (loading) {
    return <Loading />;
  }

  // UI for unauthenticated user
  if (!user) {
    return <Rerouting />;
  }

  // Re-fetch/render from file storage for the same user after update
  const refetch = async () => {
    console.log('in refetch now');
    await supabase.storage.from('test').list(folder, {
      limit: 10,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    })
    .then((data) => {
      if (data) {
        setFiles(data.data);
      }
    });
  }

  const uploadFile = async (e) => {
    e.preventDefault();

    try {
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error("You must select a PDF to upload.");
      }

      await supabase.storage
        .from("test")
        .upload(folder + "/" + e.target.files[0].name, e.target.files[0])
        .then((data, error) => {
          if (error) {
            setMessage(error.message);
            setOpen(true);
          } else if (data) {
            refetch();
          }
        });
    } catch (err) {
      console.log("caught error");
      console.log(err);
    }
  };

  const deleteFile = async (e, name) => {
    e.preventDefault();

    try {
      await supabase.storage.from('test').remove([folder + "/" + name]).then(async () => refetch());
    } catch (e) {
      console.log('delete error')
      console.log(e);
    }
  }

  const downloadFile = async (e, name) => {
    e.preventDefault();

    try {
      await supabase.storage.from('test').download(folder + "/" + name).then((data, error) => {
        if (data) {
          saveAs(data.data, name); // Saves BLOB to local disk with File Saver        
        } else if (error) {
          console.log('SOMETHING WRONG');
          console.log(error);
        }
      });
    } catch (e) {
      console.log('download error')
      console.log(e);
    }
  }

  // Format from YYYY-MM-DD to MM/DD/YYYY
  const formatDate = (date) => {
    return date.slice(5, 7) + "/" + date.slice(8, 10) + "/" + date.slice(0, 4);
  };

  return (
    <div className="flex flex-row">
      <Navbar />
      <div className="container p-10">
        <div className="shadow sm:rounded-lg w-4/5">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium leading-6 text-gray-900">
              Files
            </h2>
          </div>
          <div className="border-t border-gray-200 p-6">
            <form>
              <label className="flex flex-col justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                <div className="flex flex-col items-center space-x-2 w-full">
                  <SlCloudUpload className="text-gray-600 w-7 h-7" />
                  <div className="relative text-gray-600 w-full flex justify-center space-x-1">
                    <p>Click here to upload (PDFs only).</p>
                  </div>
                </div>
                <input
                  type="file"
                  id="single"
                  accept="pdf/*"
                  onChange={(e) => uploadFile(e)}
                  name="file_upload"
                  className="hidden"
                />
              </label>
            </form>
            <br/>
            <div>
              <table className="orientation-shifts mt-5 w-full">
                <thead className="mb-5 border-b border-gray-200">
                  <tr className="grid w-full grid-cols-5 text-left mb-2">
                    <th className="col-span-3 font-medium">Your Files</th>
                    <th className="col-span-1 font-medium">Upload Date</th>
                    <th className="col-span-1 font-medium w-5"></th>
                  </tr>
                </thead>
                <tbody>
                  {(files.length > 0) ? (files.map((f, i) => {
                    return (
                      <tr key={i} className="grid grid-cols-5 mt-2 text-sm">
                        <td className="col-span-3 truncate">{f.name}</td>
                        <td className="col-span-1">
                          {formatDate(f.created_at.slice(0, 10))}
                        </td>
                        <td className="col-span-1 flex flex-row justify-end gap-2">
                          <button
                            className="w-auto text-indigo-600"
                            onClick={(e) => downloadFile(e, f.name)}
                          >
                            <MdDownload className="w-full h-full" />
                          </button>
                          <button
                            className="w-5 h-5 text-indigo-600"
                            onClick={(e) => deleteFile(e, f.name)}
                          >
                            <FiTrash2 className="w-full h-full"/>
                          </button>
                        </td>
                      </tr>
                    );
                  })) : (
                    <tr className="grid grid-cols-5 mt-2 text-sm">
                      <td className="col-span-5">No files uploaded yet.</td>
                    </tr>
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

export default Upload;