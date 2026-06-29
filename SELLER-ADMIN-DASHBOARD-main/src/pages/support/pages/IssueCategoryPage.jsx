import { IoIosArrowForward } from "react-icons/io";
import Categ_comp from "../components/issueCategoryComponent/Categ_comp";
import MoreHelp from "../components/issueCategoryComponent/MoreHelp";
import Support from "../components/Support";
import { useLocation } from "react-router-dom";
// import helpData from "../../data/moreHelp.json"
import helpData from "../data/moreHelp.json";
import Header from "../../../layouts/Topbar";
import { UserContext } from "../../../components/context/UserContext";
import { useContext, useEffect, useState } from "react";
import { useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const IssueCategoryPage = () => {
  const navigate=useNavigate()
  const [authenticated] = useContext(UserContext);
  const location = useLocation();
  const data = location.state?.data || null;
  const name = location.state?.name || location.state?.title;
  const fileRef = useRef();
  const [formData, setFormData] = useState({
    title: "",
    seller_name: "",
    seller_id: "",
    store_id: "",
    problem_statement: "",
    phoneNumber: "",
  });
  useEffect(() => {
    formData.seller_id = authenticated?.user?._id;
    formData.store_id = authenticated?.user?.storeId;
    formData.seller_name =
      authenticated?.user?.firstName + " " + authenticated?.user?.lastName;
    formData.phoneNumber = authenticated.user.phoneNumber;
    // console.log(formData);
  }, []);
  const [imageLoading,setimageLoading]=useState(false)
  const [images, setImages] = useState([]);
const responseData=async (image)=>{
  try{
    const response=await axios.post(
      `${import.meta.env.VITE_API_ENDPOINT}/api/upload`,
      { images: image }
    )
    return response.data.urls[0]

  }catch(e){
    console.log('error uploading images' , e)
  }
}
  function handleFileChange(e) {
    
    const file=e.target.files[0]
    const reader=new FileReader()
    setimageLoading(true)
    reader.onload=async ()=>{
      if (reader.readyState ==2){
        const imageBlob=reader.result
        const imageUrl=await responseData(imageBlob);
        // console.log(imageUrl)
        setImages((prevData)=>[
          imageUrl?.url,...prevData
        ])
        // setImages(imageUrl.url)
        setimageLoading(false)
      }
      // setimageLoading(false)
    }
    // setimageLoading(false)
    reader.readAsDataURL(file);
    
  }

  function handleClick(){
    fileRef.current.click()
  }
  function handleRemoveImage(index) {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    // console.log(images);
  }
//---------------------------------------------
async function sendData() {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_ENDPOINT}/raise/ticket/${formData.seller_id}`,
      { formData: formData, images: images }
    );
    return response.data;
  } catch (e) {
    console.log('An error occurred: ', e);
  }
}

async function handleSubmit() {
  try {
    console.log(formData, 'data is <-');
    const responseData = await sendData();
    console.log(responseData, 'response data is ');
    if (responseData.data === 'success') {
      navigate('/tickets');
      toast(responseData.message);
    } else {
      toast("There was a problem saving your issue!");
    }
  } catch (error) {
    toast("An error occurred while saving your issue!");
  }
}

  return (
    <>
      <Header />
      <Support />
      <div className="m-4 w-full">
        <div>
          <div className="flex text-[12px] flex-row items-center space-x-2">
            <span>Help</span>
            <span>
              <IoIosArrowForward />
            </span>
            <span>{name}</span>
          </div>
        </div>
        <div className="flex flex-col w-full sm:flex-row">
          <div className="sm:w-[70vw] w-full">
            {/* <Categ_comp data={data} name={"Returns/RTO & Exchange"} logo={<BsReverseLayoutTextSidebarReverse/>} />  */}
            {data ? (
              <Categ_comp
                data={data}
                name={location.state?.name}
                logo={location.state?.logo}
              />
            ) : (
              <div className="flex flex-col w-[80%] lg:w-full  justify-around items-start p-4 h-auto  gap-7  shadow-lg rounded-xl">
                <span className="text-lg font-semibold bg-customPurple text-white px-4 py-2 rounded-lg w-auto text-wrap">
                  Name: {formData?.seller_name}
                </span>
                <span className="text-lg font-semibold bg-customPurple text-white px-4 py-2 rounded-lg">
                  Contact Number: {formData?.phoneNumber}
                </span>
                {/* <span className="text-lg font-semibold bg-customPurple text-white px-4 py-2 rounded-lg w-[90%] text-wrap ">
                  Store ID: {formData?.store_id}
                </span> */}

                <input
                  type="text"
                  rows={2}
                  className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  name="title"
                  placeholder="Issue Regarding "
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />

                <textarea
                  rows={4}
                  className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  placeholder="Brief your Issue"
                  value={formData.problem_statement}
                  name="problem_statement"
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      problem_statement: e.target.value,
                    }))
                  }
                />

                <span className="font-bold text-customPurple text-2xl">
                  Upload the Images
                </span>
                <hr className="border border-b-4" />

                <input
                  type="file"
                  className="hidden"
                  multiple
                  ref={fileRef}
                  onChange={handleFileChange}
                />
                {
                  imageLoading ? (
                    <>
                    Loading....
                    </>
                  ):(
                    <div className="flex flex-row flex-wrap justify-start gap-5 w-full ">
                      {images.map((image, index) => (
                      <div
                        className=" relative p-4 flex-shrink-0 w-auto"
                        key={index}
                      >
                        <img
                          src={image}
                          alt="uploaded images"
                          className="rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                          width={100}
                          height={100}
                        />
                        <button
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          onClick={() => handleRemoveImage(index)}
                        >
                          X
                        </button>
                      </div>
                    ))}
                    </div>
                  )
                }
                <hr />
                <div className="flex-shrink-0 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-24 w-24">
                  <button
                    className="text-gray-500 text-2xl"
                    onClick={handleClick}
                  >
                    +
                  </button>
                </div>
                {/* <button className="bg-customPurple text-white inline px-4 py-2 rounded-md w-auto mx-auto" onClick={handleClick} >Click to Upload Images</button> */}

                <button className="flex w-full justify-center font-bold items-end bg-customPurple text-white text-center px-4 py-2 rounded-md mx-auto" onClick={handleSubmit}>
                  Raise the Ticket
                </button>
              </div>
            )}
          </div>
          <div className="sm:w-[25vw] w-full sm:pt-8">
            <MoreHelp data={helpData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default IssueCategoryPage;
