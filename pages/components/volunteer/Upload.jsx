import { SlCloudUpload } from "react-icons/sl";
import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function Upload({uid, url, onUpload}) {
const supabase = useSupabaseClient()
const [fileUrl, setFileUrl] = useState(null)
const [uploading, setUploading] = useState(false)

useEffect(() => {
      if (url) downloadFile(url)
    }, [url])

async function downloadFile(path)  {
  try {
    const { data, error } = await supabase.storage.from('test').download(path)
    if (error) {
    throw error
    }
    const url = URL.createObjectURL(data)
    setFileUrl(url)
    } catch (error) {
    console.log('Error downloading file: ', error)
    }
}

const uploadFile = async (event) => {
  try { 
    setUploading(true) 

    if(!event.target.files || event.target.files.length == 0) {
      throw new Error("You must select a file")
    }

    const file = event.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${uid}.${fileExt}`
    const filePath = `${fileName}`

    let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

    if(uploadError) {
      throw uploadError
    }

    onUpload(filePath)
  } catch (error) {
    alert("Error uploading file")
  } finally {
    setUploading(false)
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
              <input type="file" id="single" name="file_upload" className="hidden" />
            </label>
            <br />
            <button onClick={uploadFile} disabled={uploading} className="bg-secondary-color hover:bg-primary-color text-white font-bold py-2 px-4 w-full rounded">
            {uploading ? 'Uploading ...' : 'Upload'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

