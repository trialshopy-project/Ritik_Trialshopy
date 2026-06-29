import React, { useContext, useState, useEffect, useRef } from "react";
import { ChatContext } from "./ChatContext";
import toast from "react-hot-toast";
import send3 from "../../images/send3.svg";
import { formatLastMessageTime } from "./chats";
import ReportUserPopup from "./ReportUserPopup";

export default function LiveChat({
  userDp,
  userName,
  storeId,
  chatId,
  userId,
}) {
  console.log("chatId from LiveChat.jsx", chatId)
  const { socket, isUserOnline } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef();

  const handleMoreClick = () => {
    setMenu((prevMenu) => !prevMenu);
  };

  const handleCloseReportPopup = () => {
    setShowReportPopup(false);
  };

  useEffect(() => {
    if (socket) {
      socket.emit("message-page", {
        msgByUserId: storeId,
        currUser: userId,
      });
      socket.on("message", (data) => {
        console.log("message data", data);
        setMessages(data);
      });
    }

    socket.emit("joinChat", { chatId, userId: storeId });
    socket.emit("seen", { msgByUserId: storeId, currUser: userId });

    return () => {
      if (socket) {
        socket.off("sendMessage");
      }
    };
  }, [chatId, socket]);

  const sendMessage = async () => {
    if (newMessage.trim() !== "") {
      try {
        const messageData = {
          chatId,
          sender: storeId,
          receiver: userId,
          text: newMessage,
          msgByUserId: storeId,
        };
        // setUserChats((prevChats) =>
        //   prevChats.map((chat) =>
        //     chat._id === messageData.chatId
        //       ? {
        //           ...chat,
        //           lastMsg: {
        //             ...chat.lastMsg,
        //             text: messageData.text,
        //             updatedAt: new Date(),
        //           },
        //         }
        //       : chat
        //   )
        // );

        socket.emit("sendMessage", messageData);
        setMessages((prevMessages) => [...prevMessages, messageData]);
        setNewMessage("");
      } catch (error) {
        toast.error("Failed to send message");
        console.error("Send Message Error:", error);
      }
    }
  };

  const isCurrentUserOnline = isUserOnline(userId);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <img src={userDp} className="w-10 h-10 rounded-full" alt={userName} />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold"> {userName}</span>
            <span
              className={`inline-flex items-center w-fit text-xs justify-center rounded-full px-2.5 py-0.5 ${
                isCurrentUserOnline
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isCurrentUserOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
        <div onClick={handleMoreClick} className="relative items-center">
          <img
            width={500}
            height={500}
            src="/images/mor.svg"
            alt=""
            className="w-5 cursor-pointer"
          />
          {menu && (
            <div
              ref={menuRef}
              className="absolute end-0 z-10 mt-2 max-w-56 rounded-md border border-gray-100 bg-white shadow-lg"
              role="menu"
            >
              <div className="p-2">
                <button
                  onClick={() => setShowReportPopup(true)}
                  className="block whitespace-nowrap rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  role="menuitem"
                >
                  Report User
                </button>
              </div>
            </div>
          )}
        </div>{" "}
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex items-center ${
              message.msgByUserId === storeId ? "justify-end" : "items-start"
            }`}
          >
            <div
              className={`${
                message.msgByUserId === storeId
                  ? "bg-[#EB8105] text-white rounded-md"
                  : "bg-white  border-gray-300  border-[px] py-2 px-4"
              } p-2 items-start sm:max-w-fit w-[75%] flex-row px-4`}
            >
              {message.text ? message?.text : message?.content}
              <p className="flex justify-end text-xs">
                {message.updatedAt
                  ? formatLastMessageTime(message?.updatedAt)
                  : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 flex items-center justify-between bg-white border-t">
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="p-2 text-white rounded">
          <img
            width={500}
            height={500}
            src={send3}
            className="w-8 bg-black p-2 rounded-full mx-3 h-8"
            alt="Send"
          />
        </button>
      </div>
      {error && <div className="p-4 bg-red-500 text-white">Error: {error}</div>}
      {showReportPopup && (
        <ReportUserPopup
          onClose={handleCloseReportPopup}
          userDp={userDp}
          userName={userName}
          userId={userId}
          chatId={chatId}
          storeId={storeId}
        />
      )}
    </div>
  );
}
