import axios from "axios";
import React, { useEffect, useState ,useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from "../../components/context/UserContext";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
export default function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [authenticated] = useContext(UserContext);
  const id=authenticated.user.storeId
  const fetchMeetings = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/meetings`
      );
      setMeetings(response.data);
      console.log("hhh", response.data);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };
  useEffect(() => {
    fetchMeetings();
  }, []);
  const deleteMeet=async(id)=>{
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/meeting/${id}`
      );
      if(response){
        toast.success("Meeting deleted successfully")
        fetchMeetings();
      }
    } catch (error) {
      toast.error("Failed to delete meeting")
      console.error("Error fetching meetings:", error);
    }
  }
  return (
    <>
      <div className="mt-5">
        {/* <button
          type="primary"
          className="my-4 bg-customPurple float-right block px-3 py-1 rounded-md text-white sm:mt-0"
        >
          + New Meeting
        </button> */}
        <Link to="/meetings/request">
          <button
            type="primary"
            className="bg-customDark float-right px-3 py-1 rounded-md text-white"
          >
            Meeting Requests
          </button>
        </Link>
        <h2 className="text-xl font-bold">Scheduled Meetings</h2>
        {meetings.length > 0 ? (
          <div className="grid w-full grid-cols-1 gap-6 2xl:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 md:flex-row">
            {meetings.map((meeting, index) => (
              <div
                key={index}
                className="rounded-md border-2 border-green-200 overflow-hidden relative "
              >
              
                <div className="text-red-500 absolute right-2 top-2 text-xl" onClick={()=>deleteMeet(meeting._id)}>  <MdDelete /></div>
                <div className="p-2">
                  <h3 className="text-lg font-semibold">{meeting.title}</h3>
                  <p>Status: {meeting.status}</p>
                  <p>Date: {new Date(meeting.date).toLocaleDateString()}</p>
                  <p>Time: {new Date(meeting.time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}</p>

                  <p>For Product:</p>
                  <div className="inline-flex gap-2 overflow-x-auto">
                    {meeting.products.map((product, index) => {
                     
                      return (
                        <img
                          width={100}
                          height={100}
                          key={index}
                          src={product?.productImage}
                          alt={product.productName}
                          className="rounded-lg"
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="w-full bg-green-200 p-2 text-center">
                  <NavLink
                    className="bg-green-700 text-white rounded-lg px-2 py-1"
                    to={`/livemeeting/meeting/${meeting._id}`}
                  >
                    Join Video Call
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No meetings scheduled.</p>
        )}
      </div>
    </>
  );
}
