import React, { useState, useEffect } from "react";
import Topbar2 from "../../layouts/Topbar2";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

const EditCommission = () => {
  const [data, setData] = useState({});
  const [searchParams] = useSearchParams();
  const commissionId = searchParams.get("commissionId");
  const [commission, setCommission] = useState(data.commission || "");
  const [datedFrom, setDatedFrom] = useState(data.datedFrom || "");
  const [datedTo, setDatedTo] = useState(data.datedTo || "");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_ENDPOINT
        }/commissions/products/${commissionId}`
      );

      const commissionData = response.data.commission;

      setData(commissionData);
    } catch (error) {
      console.error("Error fetching commission data:", error.message);
    }
  };

  useEffect(() => {
    setCommission(data.commission || "");
    setDatedFrom(data.datedFrom || "");
    setDatedTo(data.datedTo || "");
  }, [data]);

  const handleEditCommission = async () => {
    setLoading(true);
    if (!commission) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_ENDPOINT
        }/commissions/products/${commissionId}`,
        {
          productId: data?.productId?._id,
          commission,
          datedFrom,
          datedTo,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        setLoading(false);
        fetchData();
        toast.success("Commission Updated Successfully");
        navigate("/Products/Commission");
      }
      setCommission("");
      setDatedFrom("");
      setDatedTo("");
      console.log(response);
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
      console.error("Error updating commission data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-screen lg:w-[calc(100%-256px)]  lg:h-full h-screen overflow-y-scroll">
      <Topbar2 />
      <div>
        <div className="flex ml-5 mt-20 ">
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.166504 13C0.166504 5.91251 5.91234 0.166672 12.9998 0.166672C20.0873 0.166672 25.8332 5.91251 25.8332 13C25.8332 20.0875 20.0873 25.8333 12.9998 25.8333C5.91234 25.8333 0.166504 20.0875 0.166504 13ZM8.33317 6.00001C8.02375 6.00001 7.72701 6.12292 7.50821 6.34171C7.28942 6.56051 7.1665 6.85725 7.1665 7.16667C7.1665 7.47609 7.28942 7.77284 7.50821 7.99163C7.72701 8.21042 8.02375 8.33334 8.33317 8.33334H11.8332C12.2298 8.33334 12.8505 8.46167 13.3382 8.814C13.5598 8.97267 13.7722 9.18851 13.9273 9.50001H8.32967C8.02025 9.50001 7.72351 9.62292 7.50471 9.84171C7.28592 10.0605 7.163 10.3573 7.163 10.6667C7.163 10.9761 7.28592 11.2728 7.50471 11.4916C7.72351 11.7104 8.02025 11.8333 8.32967 11.8333H13.9273C13.7913 12.1072 13.5892 12.343 13.3393 12.5193C12.8953 12.8239 12.3715 12.991 11.8332 13H8.32967C8.08785 12.9999 7.85197 13.0749 7.65466 13.2147C7.45735 13.3545 7.30835 13.5522 7.22827 13.7804C7.1482 14.0085 7.14101 14.256 7.20769 14.4884C7.27438 14.7208 7.41164 14.9268 7.6005 15.0778L13.4373 19.7445C13.557 19.8403 13.6943 19.9115 13.8415 19.9542C13.9887 19.9969 14.1429 20.0101 14.2952 19.9932C14.4475 19.9763 14.595 19.9296 14.7293 19.8557C14.8635 19.7818 14.9819 19.6822 15.0777 19.5625C15.1734 19.4429 15.2447 19.3055 15.2874 19.1583C15.33 19.0111 15.3433 18.857 15.3264 18.7046C15.3095 18.5523 15.2628 18.4048 15.1889 18.2706C15.115 18.1363 15.0153 18.0179 14.8957 17.9222L11.6558 15.3333H11.8308C12.602 15.3333 13.7313 15.1117 14.7008 14.4128C15.5645 13.7945 16.1634 12.8735 16.3785 11.8333H17.6665C17.9759 11.8333 18.2727 11.7104 18.4915 11.4916C18.7103 11.2728 18.8332 10.9761 18.8332 10.6667C18.8332 10.3573 18.7103 10.0605 18.4915 9.84171C18.2727 9.62292 17.9759 9.50001 17.6665 9.50001H16.3785C16.2911 9.09299 16.147 8.70026 15.9503 8.33334H17.6665C17.9759 8.33334 18.2727 8.21042 18.4915 7.99163C18.7103 7.77284 18.8332 7.47609 18.8332 7.16667C18.8332 6.85725 18.7103 6.56051 18.4915 6.34171C18.2727 6.12292 17.9759 6.00001 17.6665 6.00001H8.33317Z"
              fill="black"
            />
          </svg>

          <div className="font-bold ml-2 flex items-center text-lg">
            Edit Commission
          </div>
        </div>
        <div className="lg:ml-10 lg:mt-5 lg:flex   flex-col lg:flex-row w-full gap-2">
          <div className="ml-4">
            <label className="block mb-2">
              Commission Percentage <span className="text-[#F60002]">*</span>
            </label>
            <input
              className="input-field gap-5"
              type="text"
              placeholder="Enter Commission %"
              value={commission}
              onChange={(e) => setCommission(e.target.value)}
            />
          </div>
          <div className="ml-4">
            <label className="block mb-2">Start Date</label>
            <input
              className="input-field gap-5"
              type="date"
              placeholder="Enter Start Date"
              value={datedFrom}
              onChange={(e) => setDatedFrom(e.target.value)}
            />
          </div>
          <div className="ml-4">
            <label className="block mb-2">End Date</label>
            <input
              className="input-field gap-5"
              type="date"
              placeholder="Enter End Date"
              value={datedTo}
              onChange={(e) => setDatedTo(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-stretch ml-5 mt-4 focus:bg-gray-900">
          <button
            className="flex bg-customPurple rounded-md text-white items-center px-4 py-1 gap-2 focus:outline-none"
            onClick={handleEditCommission}
          >
            Edit Commission
            <ion-icon name="send" className="text-white "></ion-icon>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCommission;
