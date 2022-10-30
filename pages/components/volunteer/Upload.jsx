import { AiOutlineCloudUpload } from "react-icons/ai";

const Upload = () => {

  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="max-w-xl">
          <form>
          <label
            className="flex flex-col justify-center w-full h-96 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
            <div className="flex flex-col items-center space-x-2 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-indigo-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth=".5">
                <path strokeLineCap="round" strokeLineJoin="round"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <br></br>
              <div className="font-medium relative text-black w-full flex justify-center space-x-1">
                <p>Drag & drop files to attach or {' '}</p>
                <span className="text-indigo-700 underline flex">Browse</span>
              </div>
              <br></br>
              <div className="text-xs flex relative justify-center text-gray-600 w-full">
              Supported formates: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
              </div>
            </div>
            <input type="file" name="file_upload" className="hidden" />
          </label>
          <br></br>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 w-full rounded">UPLOAD FILES</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
