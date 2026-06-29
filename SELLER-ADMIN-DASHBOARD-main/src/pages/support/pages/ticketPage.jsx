import React, { useEffect, useState } from "react";
// import MainCategory from "../components/MainCategory";
import Support from "../components/Support";
import Header from "../../../layouts/Topbar";
import axios from "axios";
import { UserContext } from "../../../components/context/UserContext";
import { useContext } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const TicketHomePage = () => {
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState([{ id: 123 }]);
  const [data, setData] = useState([]);
  const [authenticated] = useContext(UserContext);
  const navItems = ["all", "responded", "satisfied"]; //cancelled
  const [nav, setnav] = useState("all");
  const store_id = authenticated.user.storeId;
  //  async function handleClick(id){
  //   // alert(id)
  //   try{
  //     const response = await axios.delete(`${import.meta.env.VITE_API_ENDPOINT}/raise/delete/${id}`);

  //     console.log('delete response: ',response.data)
  //     navigate('/tickets')

  //     // toast.success('Successfully Deleted the ticket!')
  //     toast.success(response.data)
  //   }
  //   catch(e){

  //     console.log(e)
  //   }

  //  }
  async function handleClick(id) {
    try {
      // Send DELETE request to backend
      const response = await axios.delete(
        `${import.meta.env.VITE_API_ENDPOINT}/raise/delete/${id}`
      );

      console.log("delete response: ", response.data);

      // Update ticketData by filtering out the deleted ticket
      setTicketData((prevTicketData) =>
        prevTicketData.filter((ticket) => ticket._id !== id)
      );

      // Navigate to another route (if needed)
      navigate("/support");

      // Show a success toast
      toast.success("Successfully deleted the ticket!");
    } catch (e) {
      console.log(e);
      toast.error("Failed to delete the ticket");
    }
  }

  async function handleSatisfaction(id) {
    alert("satisfied!");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/raise/update/${id}`,
        {
          satisfied: "yes",
        }
      );
      if (response.status === 200) {
        toast.success("Satisfaction status updated successfully!");
        navigate("/tickets");
      } else {
        toast.error("Failed to update satisfaction status");
      }
    } catch (error) {
      console.error("Error updating satisfaction status:", error);
      toast.error("An error occurred while updating the satisfaction status");
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/raise/getData/${store_id}`
      );
      console.log(
        "-----------------------------------------------------------"
      );
      // setTicketData(prevData=>[...prevData,response.data]);
      setData(response.data);
      setTicketData(response.data);
      // console.log(data)
      // console.log(response.data)
      // console.log(ticketData)
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    console.log("ticketData:", ticketData);
    console.log("data:", data);
  }, [ticketData, data]);

  return (
    <>
      <Header />
      <Support />
      <nav className="bg-customPurple p-4">
        <ul className="flex space-x-4">
          {navItems.map((item, index) => (
            <li key={index} className="text-white">
              <button
                className={`hover:bg-white hover:text-customPurple hover:font-bold px-3 py-2 rounded ${
                  nav === item ? "bg-white font-bold text-customPurple" : ""
                }`}
                onClick={() => setnav(item)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {ticketData && (
        <div className="">
          {/* <h1 className="text-2xl font-semibold mb-4">User-Raised Tickets</h1> */}
          <div className="rounded-lg shadow w-screen lg:w-full">
  {/* Outer container for responsiveness and shadow */}
  <div className="flex flex-row overflow-x-scroll w-full">
    {/* Inner container with horizontal scrolling */}
    <div className="px-8 lg:px-0 lg:pb-0 pb-4 rounded-sm border border-gray-200 flex-1">
      {/* Inner container for padding and border */}
      <div className="border-x border-gray-200 rounded-sm overflow-x-auto">
        {/* Scrollable container */}
        {nav === "all" && (
          <table className="min-w-full bg-white border border-gray-200">
            {/* Table with min width to trigger horizontal scrolling */}
            <thead>
              <tr className="bg-white border-b-2">
                <th className="py-2 px-4 border-b">Sr. No</th>
                <th className="py-2 px-4 border-b">Issue Regarding</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Response</th>
                <th className="py-2 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {ticketData.map((ticket, index) => (
                <tr key={ticket._id}>
                  <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                  <td className="py-2 px-4 border-b text-center">{ticket.Issue_regarding}</td>
                  <td
                    className={`py-2 px-4 border-b text-center ${
                      ticket.status === "solved" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {ticket.resolved ? "solved" : "unsolved"}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {ticket.ResponseFromAdmin}
                  </td>
                  <td className="py-2 px-4 border-b mx-auto justify-center items-center flex">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded mx-auto"
                      onClick={() => handleClick(ticket._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </div>
</div>

          {nav === "responded" && (
            <div className="">
              {/* Table for user-raised issues with admin response */}
              {/* <h2 className="text-xl font-semibold mb-2">Admin Responses</h2> */}
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Sr. No</th>
                    <th className="py-2 px-4 border-b">Issue</th>
                    <th className="py-2 px-4 border-b">Problem Statement</th>
                    <th className="py-2 px-4 border-b">Response</th>
                    <th className="py-2 px-4 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketData
                    .filter((ticket) => ticket.ResponseFromAdmin)
                    .map((ticket, index) => (
                      <tr key={ticket._id}>
                        <td className="py-2 px-4 border-b text-center">
                          {index + 1}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          {ticket.Issue_regarding}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          {ticket.problem_statement}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          {ticket.ResponseFromAdmin}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          <button
                            className="bg-green-500 text-white px-3 py-1 rounded"
                            onClick={() => handleSatisfaction(ticket._id)}
                          >
                            { ticket.status==='cancelled'? 'Satisfied':'Are you Satisfied' }
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
          {nav === "satisfied" && (
            <div>
              {/* Table for canceled issues */}
              {/* <h2 className="text-xl font-semibold mb-2">Cancelled Issues</h2> */}
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Sr. No</th>
                    <th className="py-2 px-4 border-b">Issue</th>
                    <th className="py-2 px-4 border-b">Problem Statement</th>
                    <th className="py-2 px-4 border-b">Response</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketData
                    .filter((ticket) => ticket.status === "cancelled")
                    .map((ticket, index) => (
                      <tr key={ticket._id}>
                        <td className="py-2 px-4 border-b text-center">
                          {index + 1}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          {ticket.Issue_regarding}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          {ticket.problem_statement}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          {ticket.ResponseFromAdmin}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TicketHomePage;
