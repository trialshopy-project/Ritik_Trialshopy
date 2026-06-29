import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import toast from "react-hot-toast";
import axios from "axios";
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const NewsLetterBanner = () => {
  const [open, setOpen] = useState(false);
  const [data,setData]=useState([]);
  const [uploaded, setUploaded] = useState(null);
  const [selected, setSelected] = useState("");
  const [banner,setBanner]=useState("")
  const [wait,setWait]=useState(false);
  const handleClose = () => {
    setOpen(false);
    setUploaded(null); 
  };

  const handleOpen = (category) => {
    setOpen(true);
    setSelected(category);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setBanner(file)
    if (file) {
      setUploaded(URL.createObjectURL(file)); 
    }
  };
  const uploadBanner = async () => {
    try {
      setWait(true);
      const formData = new FormData();

      formData.append("banner", banner); 
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/banner/upload/${selected}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      console.log("Success:", response.data);
      if (response.data.success) {
        fetchBanner();
        setWait(false);
        setOpen(false);
     
        toast.success(response?.data?.message);

      }
    } catch (err) {
      setWait(false);
      setOpen(false);
      toast.error(err?.response?.data?.message);
      console.log(err);
    }
  };
  const fetchBanner=async()=>{
    try{

      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/banner/getBanners`,
      );
      
        
        setData(response.data.data)
      
    }catch(err){
      toast.error(err?.response?.data?.message);
      console.error(err);
    }
  }
  const deleteBanner=async(category)=>{
    try{

      const response = await axios.delete(
        `${import.meta.env.VITE_API_ENDPOINT}/banner/deleteBanner/${category}`,
      );
      
        
      if (response.data.success) {
        setWait(false);
        setOpen(false);
        fetchBanner();
        toast.success(response?.data?.message);

      }
      
    }catch(err){
      toast.error(err?.response?.data?.message);
      console.error(err);
    }
  }
  useEffect(()=>{
    fetchBanner()
  },[])
  return (
    <div>
      <div className='p-4 h-screen w-full overflow-y-scroll'>
       <p className='text-3xl text-center font-semibold'>NewsLetter Banners</p>
       <p className=' mt-6 font-semibold mb-2 text-lg'>Carousal Banners</p>
      
       
        <p className=' mt-6 font-semibold mb-2 text-lg'>Top Banner</p>
        <img   src={data.find(item => item.category === "NewsLetterTopBanner")?.url || ""}  className='h-[40vh] w-full border-2 rounded bg-neutral-300' alt="NewsLetterTopBanner" onClick={()=>handleOpen("NewsLetterTopBanner")}/>
        <p className=' mt-6 font-semibold mb-2 text-lg'>Middle Banner</p>
        <img   src={data.find(item => item.category === "NewsLetterMiddleBanner")?.url || ""}  className='h-[40vh] w-full border-2 rounded bg-neutral-300' alt="NewsLetterMiddleBanner" onClick={()=>handleOpen("NewsLetterMiddleBanner")}/>
       
       

        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="flex flex-col items-center">
        <p className='font-medium mb-2 text-lg'>{selected}</p>
        {uploaded ? (
            <img src={uploaded} className='h-40 w-full border-2 bg-neutral-200 rounded mb-2' alt={selected} />
          ) : (
            <img src={data.find(item => item.category === selected)?.url || ""} className='h-40 w-full border-2 bg-neutral-200 rounded mb-2' alt={selected} />
          )}
          <input type="file" onChange={handleFileChange} />
          
<div className='flex gap-6 w-full'>
           <button onClick={()=>uploadBanner()} className={`${wait ? "bg-amber-500" : "bg-neutral-300"} p-2 w-full hover:text-white hover:bg-amber-500 mt-6 rounded`}>{wait?"Please Wait":"Upload"}</button>
           <button onClick={()=>deleteBanner(selected)} className={`${wait ? "bg-amber-500" : "bg-neutral-300"} p-2 w-full hover:text-white hover:bg-amber-500 mt-6 rounded`}>{wait?"Please Wait":"Delete"}</button>
   

          </div>
        </Box>
      </Modal>
    </div>
    </div>
  )
}

export default NewsLetterBanner
