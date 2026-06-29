import React, { useContext, useEffect, useState } from "react";
import LiveChat from "./LiveChat";
import axios from "axios";
import toast from "react-hot-toast";
import { format, isToday, isYesterday } from "date-fns";
import { ChatContext } from "./ChatContext";
import { UserContext } from "../../components/context/UserContext";

export function formatLastMessageTime(dateString) {
  const date = new Date(dateString);

  if (isToday(date)) {
    return format(date, "HH:mm");
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else {
    return format(date, "MM/dd/yyyy");
  }
}

export default function Chats() {
  const {
    userChats,
    setUserChats,
    isUserChatsLoading,
    userChatsError,
    socket,
  } = useContext(ChatContext);
  console.log("userChats", userChats);
  const [authenticated] = useContext(UserContext);
  const storeKaId = authenticated.user.storeId;
  const [storeId, setStoreId] = useState(storeKaId);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatId, setChatId] = useState(null);
  const serverURL = import.meta.env.VITE_TRIALSHOPY_API_URL;

  useEffect(() => {
    const fetchChatId = async () => {
      if (selectedUser) {
        try {
          const response = await axios.get(
            `${serverURL}/api/v1/getChat/${storeId}/${selectedUser.sender._id}`
          );
          setChatId(response.data._id);
          console.log("response from chats.jsx", response)
        } catch (error) {
          toast.error("Failed to fetch chat ID");
          console.error("Fetch Chat ID Error:", error);
        }
      }
    };
    fetchChatId();
  }, [serverURL, storeId, selectedUser]);

  return (
    <div className="flex h-screen">
      {/* Left Column */}
      <div className="w-1/4 bg-gray-200 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        {userChats?.length < 1 ? null : (
          <ul>
            {isUserChatsLoading && <p>Loding Chats...</p>}
            {userChats?.map((user, index) => (
              <li
                key={index}
                className={`p-2 flex items-center gap-2 border-b cursor-pointer ${
                  selectedUser && selectedUser.sender._id === user.sender?._id
                    ? "border-l-customPurple border-2 bg-gray-100"
                    : "bg-white"
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <img
                  src={user.sender?.profilePic?.url}
                  className="w-10 h-10 rounded-full"
                  alt={user.sender?.name}
                />
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-center w-full">
                    <span className="font-semibold text-sm">
                      {user.sender?.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user?.lastMsg?.updatedAt
                        ? formatLastMessageTime(user?.lastMsg?.updatedAt)
                        : ""}
                    </span>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="truncate text-sm max-w-48 text-gray-500">
                      {user?.lastMsg?.text}
                    </p>
                    {user.unseenMsg > 0 && (
                      <span className="text-xs bg-red-500 text-white rounded-full px-2">
                        {user?.unseenMsg}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right Column */}
      <div className="w-3/4 bg-gray-100 flex flex-col justify-between">
        {selectedUser ? (
          <LiveChat
            userDp={selectedUser.sender?.profilePic?.url}
            userName={selectedUser?.sender?.name}
            storeId={storeId}
            chatId={chatId}
            userId={selectedUser.sender._id}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            Select a user to view chat
          </div>
        )}
      </div>
    </div>
  );
}
