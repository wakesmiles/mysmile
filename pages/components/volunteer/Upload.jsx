import { SlCloudUpload } from "react-icons/sl";
import { useEffect, useState } from 'react'
import { supabase } from "../../supabaseClient";

const Upload = () => {
  const [file, setFile] = useState(null)
  const [fileUrl, setFileUrl] = useState("")

  const uploader = async (e) => {
    e.preventDefault()

    if (file) {
      const {data, error} = await supabase.storage.from("test").upload(`${Date.now()}_${file.name}`, file)

      if(error) {
        alert("Error uploading file")
      }

      if(data) {
        setFileUrl(data.Key)
        fileUrl = data.Key
        alert("File upload successful")
      }
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="max-w-xl">
          <form>
            <label className="flex flex-col justify-center w-full h-96 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
              <div className="flex flex-col items-center space-x-2 w-full">
                <SlCloudUpload className="text-primary-color w-20 h-20" />
                <br />
                <div className="font-medium relative text-black w-full flex justify-center space-x-1">
                  <p>Drag & drop files to attach or </p>
                  <span className="text-primary-color underline flex">browse</span>
                </div>
                <br />
                <div className="text-xs flex relative justify-center text-gray-600 w-full">
                  PDF format only
                </div>
              </div>
              <input type="file" id="single" name="file_upload" className="hidden" onChange={e => setFile(e.target.files[0])}/>
            </label>
            <br />
            <button onClick={uploader} className="bg-secondary-color hover:bg-primary-color text-white font-bold py-2 px-4 w-full rounded">
            UPLOAD FILES
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
