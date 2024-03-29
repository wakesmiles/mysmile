import { useEffect, useState } from "react";
import { SlCloudUpload } from "react-icons/sl";
import { FiTrash2 } from "react-icons/fi";
import { MdDownload } from "react-icons/md";
import Navbar from "./components/navbar";
import Loading from "./components/load";
import Rerouting from "./components/reroute";
import Head from "next/head";
import { formatDate } from "../utils/date-time";
import { supabase } from "../utils/supabaseClient";
import { saveAs } from "file-saver";

/**
 * Function for initially fetching user info upon render from client-side
 * If converting interactions with DB to API routes, should change
 */
function FetchResource() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState("");
  const [files, setFiles] = useState([]);

  async function getData() {
    try {
      setLoading(true);

      // Authenticate user
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

              // Retrieve previously user-uploaded files from Supabase storage
              await supabase.storage
                .from("certifications")
                .list(folderPath, {
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

  const [user, loading, folder, files, setFiles] = FetchResource();

  // UI for loading state
  if (loading) {
    return <Loading />;
  }

  // UI for unauthenticated user
  if (!user) {
    return <Rerouting />;
  }

  /**
   * Re-fetch from file storage for the same user after update
   */
  const refetch = async () => {
    console.log("in refetch now");
    await supabase.storage
      .from("certifications")
      .list(folder, {
        limit: 10,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      })
      .then((data) => {
        if (data) {
          setFiles(data.data);
        }
      });
  };

  /**
   * Validate file type and file name, then upload to Supabase storage
   */
  const uploadFile = async (e) => {
    e.preventDefault();
    try {
      // No file detected
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }

      // Invalid file type or file name
      if (
        e.target.files[0].type !== "application/pdf" ||
        !/^([\w_ \.\-\_]*)$/.test(e.target.files[0].name)
      ) {
        throw new Error("Invalid file. Please check file type and name.");
      }

      await supabase.storage
        .from("certifications")
        .upload(folder + "/" + e.target.files[0].name, e.target.files[0])
        .then(({ data, error }) => {
          if (data) {
            refetch();
          }
        });
    } catch (err) {
      setMessage(err.message);
      setOpen(true);
    }
  };

  /**
   * Delete file from Supabase storage
   */
  const deleteFile = async (e, name) => {
    e.preventDefault();
    try {
      await supabase.storage
        .from("certifications")
        .remove([folder + "/" + name])
        .then(async () => refetch());
    } catch (e) {
      console.log("delete error");
      console.log(e);
    }
  };

  /**
   * Download file into local directory from Supabase storage
   */
  const downloadFile = async (e, name) => {
    e.preventDefault();
    try {
      await supabase.storage
        .from("certifications")
        .download(folder + "/" + name)
        .then((data, error) => {
          if (data) {
            saveAs(data.data, name); // Saves BLOB to local disk with File Saver
          } else if (error) {
            console.log("SOMETHING WRONG");
            console.log(error);
          }
        });
    } catch (e) {
      console.log("download error");
      console.log(e);
    }
  };

  return (
    <div>
      <Head>
        <title>MySmile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="">
        <Navbar />
        <div className="container p-10">
          <div className="shadow sm:rounded-lg w-4/5 border-transparent dark:bg-neutral-900 dark:border-2 dark:border-neutral-800">
            <div className="px-4 py-5 sm:px-6">
              <h2>Files</h2>
            </div>
            <div className="border-t border-gray-200 p-6  dark:border-neutral-800">
              <form>
                <label className="flex flex-col justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none  dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600">
                  <div className="flex flex-col items-center space-x-2 w-full">
                    <SlCloudUpload className="text-gray-600 w-7 h-7 dark:text-neutral-200" />
                    <div className="relative text-gray-600 w-full flex justify-center space-x-1 dark:text-neutral-200">
                      <p>
                        Click here to upload PDF. Only dashes and underscores
                        allowed in file name.
                      </p>
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
              <br />
              <div className="overflow-y-scroll w-full h-full max-w-full max-h-72 scrollbar">
                <table className="orientation-shifts mt-5 w-full">
                  <thead className="mb-5 border-b border-gray-200 dark:border-neutral-800">
                    <tr className="grid w-full grid-cols-5 text-left mb-2 dark:text-neutral-200">
                      <th className="col-span-3 font-medium">Uploaded</th>
                      <th className="col-span-1 font-medium">Date</th>
                      <th className="col-span-1 font-medium w-5"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.length > 0 ? (
                      files.map((f, i) => {
                        return (
                          <tr key={i} className="grid grid-cols-5 mt-2 text-sm">
                            <td className="col-span-3 truncate">{f.name}</td>
                            <td className="col-span-1">
                              {formatDate(f.created_at.slice(0, 10))}
                            </td>
                            <td className="col-span-1 flex flex-row justify-end gap-4">
                              <button
                                className="w-5 h-5 text-indigo-600"
                                onClick={(e) => downloadFile(e, f.name)}
                              >
                                <MdDownload className="w-full h-full" />
                              </button>
                              <button
                                className="w-5 h-5 mr-3 text-indigo-600"
                                onClick={(e) => deleteFile(e, f.name)}
                              >
                                <FiTrash2 className="w-full h-full" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr className="grid grid-cols-5 mt-2 text-sm dark:text-neutral-200">
                        <td className="col-span-5">No files uploaded yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {open ? (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                  <div className="flex min-h-full z-10 items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg dark:bg-neutral-800">
                      <div className="bg-white px-4 pt-5 pb-4 sm:p-8 dark:bg-neutral-800">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-0 sm:text-left">
                          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-neutral-200">
                            Status
                          </h3>
                          <hr />
                          <div className="mt-2">
                            <p className="text-sm text-gray-500 dark:text-neutral-200">
                              {message}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 dark:bg-neutral-800">
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
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
