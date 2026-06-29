import React, { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../../components/context/UserContext";
import { useNavigate } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { IoShareSocialOutline } from "react-icons/io5";
import { SlDislike } from "react-icons/sl";
import { LiaCommentSolid } from "react-icons/lia";
import toast from "react-hot-toast";
const UploadReel = () => {
  const [data, setData] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [authenticated] = useContext(UserContext);
  const parsedUserData = authenticated.user;
  const navigate = useNavigate();
  const [loading,setLoading]=useState();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const postData = async () => {
    setLoading(true)
    const formData = new FormData();
    formData.append("reel", data);
    formData.append("caption", caption);
    formData.append("storeId",authenticated.user.storeId)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/reels/upload/${parsedUserData?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        setLoading(false)
        toast.success("Reel uploaded successfully")
        navigate("/reels");
      }
    } catch (e) {
      setLoading(false)
      toast.error("Failed to upload reel")
      console.log(e);
    }
  };

  return (
    <div className="w-full h-full p-4">
      <div className="w-[90vw] md:w-[500px] mx-auto shadow-md border-2 p-4 rounded m-4 flex flex-col gap-4 items-center">
        {preview ? (
          <div className="relative w-full h-full text-center">
            <video src={preview} controls className="border-2 border-black w-fit mx-auto h-[60vh] rounded " />
            <div className="flex flex-col absolute right-6 gap-6 text-2xl bottom-28">
                <CiHeart/>
                <IoShareSocialOutline/>
                <SlDislike />
                <LiaCommentSolid/>
            </div>
            <button
              onClick={() => {
                setData(null);
                setPreview(null);
              }}
              className="mt-2 text-red-500 hover:underline"
            >
              Change File
            </button>
          </div>
        ) : (
          <input type="file" accept="video/*" onChange={handleFileChange} className="border-2 rounded h-[60vh]" />
        )}

     
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="border-2 w-full rounded p-2"
          placeholder="Enter caption"
        />

       
        <button
          onClick={postData}
          disabled={loading}
          className={`bg-amber-500 text-white rounded text-sm py-2 px-5 mr-2 hover:bg-amber-500 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading?"Please wait...":"Upload Reel"}
        
        </button>
      </div>
    </div>
  );
};

export default UploadReel;
