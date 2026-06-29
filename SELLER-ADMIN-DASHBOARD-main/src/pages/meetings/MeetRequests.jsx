import React, { useContext, useEffect, useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import {
  Button,
  Checkbox,
  Image,
  Popover,
  Modal,
  Input,
  DatePicker,
  TimePicker,
} from "antd";
import toast, { LoaderIcon } from "react-hot-toast";
import axios from "axios";
import { UserContext } from "../../components/context/UserContext";
import { ChatContext } from "../chats/ChatContext";
import { MdDelete } from "react-icons/md";

const MeetRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupedRequests, setGroupedRequests] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [meetingTopic, setMeetingTopic] = useState("");
  const [meetingStartDate, setMeetingStartDate] = useState(null);
  const [meetingStartTime, setMeetingStartTime] = useState(null);
  const [authenticated] = useContext(UserContext);
  const { newVideoRequestSignal } = useContext(ChatContext);

  const fetchMeetings = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/videoRequests`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch meetings");
      }
      const resdata = await response.json();
      setRequests(resdata);
      const grouped = groupRequestsByProducts(resdata);
      setGroupedRequests(grouped);
      setSelectedUsers(resdata.userId)
    } catch (error) {
      console.error("Error fetching meetings:", error);
      toast.error("Failed to Fetching Meeting Requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [newVideoRequestSignal]);

  // Group requests by shared products
  const groupRequestsByProducts = (requests) => {
    const grouped = [];

    requests.forEach((request) => {
      let foundGroup = false;

      for (let group of grouped) {
        const groupProductIds = group.flatMap((r) =>
          r.products.map((p) => p._id)
        );
        const requestProductIds = request.products.map((p) => p._id);

        // Check if there is at least one matching product
        if (requestProductIds.some((id) => groupProductIds.includes(id))) {
          group.push(request);
          foundGroup = true;
          break;
        }
      }

      // If no matching group found, create a new group
      if (!foundGroup) {
        grouped.push([request]);
      }
    });

    return grouped;
  };

  const handleStatusChange = async (status, requestId) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_ENDPOINT
        }/api/v1/videoRequests/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: { status } }),
        }
      );
      if (!response.ok) {
        toast.error("Failed to update status");
      }else{
        setLoading(false);
        fetchMeetings()
      }

      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === requestId ? { ...req, status } : req
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update request status");
    }
  };

  const handleProductChange = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
    console.log(selectedProducts);
  };

  const handleCreateMeeting = () => {
    // Open modal
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    // Close modal
    setIsModalVisible(false);
  };

  // const meetingStartTime = new Date(Date.now() + 10 * 60000).toISOString(); // 10 minutes from now

  const handleConfirmMeeting = async () => {
    const productIds = requests
  .filter((request) => selectedProducts.includes(request._id))
  .flatMap((request) => request.products.map((product) => product._id)); 
  const userIds = requests.filter((request) => selectedProducts.includes(request._id)).map((request) => request.userId);



    const res = await axios.post(
      `${import.meta.env.VITE_API_ENDPOINT}/api/v1/createzoom`,
      {
        title: meetingTopic,
        date: meetingStartDate,
        time: meetingStartTime,
        sellerId: authenticated.user._id,
        storeId: authenticated.user.storeId,
        users: userIds ,
        products: productIds,
      }
    );
    setIsModalVisible(false);
    toast.success("Meeting created successfully!");
  };
  const handleDelete=async(id)=>{
    try{
      const response = await axios.delete(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/videoRequests/${id}`
      );
      if(response){
        toast.success("Meeting deleted successfully")
        fetchMeetings();
      }
    }catch(e){
      toast.error("Failed to delete meeting requests")
      console.log(e)
    }
  }
  return (
    <>
      <div className="p-2">
        {loading ? (
          <div className="h-96 flex justify-center items-center">
            <Button disabled>
              <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between">
              <h1>Please Select Card for which you want to create meeting</h1>
              <Button
                type="primary"
                onClick={handleCreateMeeting}
                disabled={selectedProducts.length === 0}
              >
                Create Meeting
              </Button>
            </div>
            <div className="flex flex-col gap-4">
              {groupedRequests.map((group, groupIndex) => (
                <div
                  key={groupIndex}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
                >
                  {group.map((item, index) => (
                    <div key={index} className="bg-white rounded-md p-6 relative">
                      <div className="text-red-500 text-xl absolute top-1 right-1 cursor-pointer" onClick={()=>handleDelete(item._id)}> <MdDelete/></div>
                      <div className="ring-indigo-50 ring rounded-md relative">
                        <Checkbox
                          checked={selectedProducts.includes(item._id)}
                          onChange={() => handleProductChange(item._id)}
                          className="absolute right-0 rounded-b-lg text-xs bg-blue-50 px-3 py-2"
                        >
                          Select
                        </Checkbox>
                        <div className="p-2">
                          <div className="my-1 text-xs">
                            Date :{" "}
                            {new Date(item?.createdAt).toLocaleDateString()}
                          </div>
                          <h3 className="my-1 text-xs">
                            Requested ID: {item?._id}
                          </h3>
                          <div className="mt-2 pb-1 flex items-center gap-8 text-xs border-b border-gray-200">
                            <div className="mt-1.5 sm:mt-0">
                              <p className="text-gray-500">Requested by</p>
                              <p className="font-medium">
                                {item?.userId?.name}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 pb-1 flex items-center gap-8 text-xs border-b border-gray-200">
                            <div className="mt-1.5 sm:mt-0">
                              <p className="text-gray-500">Purpose</p>
                              <p className="font-medium">{item?.purpose}</p>
                            </div>
                          </div>
                          <div className="mt-2 flex max-sm:flex-col gap-3 justify-between">
                            <p className="text-[10px] font-medium">
                              Request Date:
                              <strong className="rounded-full ml-2 border border-amber-500 bg-amber-800 px-2 py-1 text-white">
                                {new Date(item?.date).toLocaleDateString()}
                              </strong>
                            </p>
                            <p className="text-[10px] font-medium">
                              Request Time:
                              <strong className="rounded-full ml-2 border border-amber-500 bg-amber-800 px-2 py-1 text-white">
                                {item?.time}
                              </strong>
                            </p>
                          </div>
                          <div className="my-1">
                            <p className="text-xs font-semibold">
                              For Product:
                            </p>
                            <div className="overflow-x-auto max-w-full">
                              <div className="inline-flex gap-2 items-center justify-center">
                                {item.products.map((product, index) => (
                                  <Image
                                    key={index}
                                    src={product?.productImage}
                                    alt="Product Image"
                                    width={100}
                                    height={100}
                                    className="flex-shrink-0 rounded-md"
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex justify-start">
                            {item?.status === "pending" && (
                              <Popover
                                content={
                                  <div className="flex flex-col gap-1 cursor-pointer" >
                                    <p
                                      onClick={() =>{
                                        setLoading(true);
                                        handleStatusChange("confirmed", item._id);
                                      }}
                                      className="hover:bg-green-300 px-3 py-1 rounded-md"
                                    >
                                      Approve
                                    </p>
                                    <p
                                      onClick={() =>{
                                        setLoading(true);
                                        handleStatusChange("cancelled", item._id)
                                      }}
                                      className="hover:bg-red-300 px-3 py-1 rounded-md"
                                    >
                                      Reject
                                    </p>
                                  </div>
                                }
                                trigger="click"
                                placement="bottomRight"
                              >
                                <strong className="-mb-[2px] font-medium text-xs -me-[2px] inline-flex items-center gap-1 rounded-tr-xl rounded-bl-xl border px-3 py-1.5 cursor-pointer">
                                  Edit Status <IoChevronDownOutline />
                                </strong>
                              </Popover>
                            )}
                          </div>

                          <div className="flex justify-end">
                            <strong className="-mb-[2px] -me-[2px] inline-flex items-center gap-1 rounded-ee-xl rounded-ss-xl bg-gray-600 px-3 py-1.5 text-white">
                              <span className="text-[10px] font-medium capitalize sm:text-xs">
                                Status: {item?.status}
                              </span>
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {/* Create Meeting Modal */}
      <Modal
        title="Create Meeting"
        visible={isModalVisible}
        onOk={handleConfirmMeeting}
        onCancel={handleCancel}
        okText="Confirm"
        cancelText="Cancel"
      >
        <div>
          <h3>Meeting Details</h3>
          <Input
            placeholder="Meeting Topic"
            value={meetingTopic}
            onChange={(e) => setMeetingTopic(e.target.value)}
            className="mb-3"
          />
          <DatePicker
            onChange={(date) => setMeetingStartDate(date)}
            placeholder="Select Date"
            className="mb-3 w-full"
          />
          <TimePicker
            onChange={(time) => setMeetingStartTime(time)}
            placeholder="Select Time"
            className="mb-3 w-full"
          />
          <h3>Selected Products</h3>
          {requests
            .filter((request) => selectedProducts.includes(request._id))
            .map((request) => (
              <div key={request._id} className="mb-2">
                <h4>{request.userId.name}</h4>
                <div className="flex gap-2">
                  {request.products.map((product, index) => (
                    <Image
                      key={index}
                      src={product?.productImage}
                      alt="Product Image"
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </Modal>
    </>
  );
};

export default MeetRequest;
