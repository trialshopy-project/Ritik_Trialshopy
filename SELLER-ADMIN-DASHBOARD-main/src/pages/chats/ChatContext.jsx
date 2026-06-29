import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import io from "socket.io-client";
import { UserContext } from "../../components/context/UserContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [authenticated] = useContext(UserContext);
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);

  const serverURL = import.meta.env.VITE_TRIALSHOPY_API_URL;
  const initialStoreId = authenticated?.user?.storeId || null;
  const [storeId, setStoreId] = useState(initialStoreId);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [newVideoRequestSignal, setNewVideoRequestSignal] = useState(0);

  useEffect(() => {
    if (!storeId) return;
    const socketInstance = io(serverURL);

    setSocket(socketInstance);

    socketInstance.on("onlineUser", (users) => {
      setOnlineUsers(new Set(users));
    });

    socketInstance.emit("joinChat", { userId: storeId });
    socketInstance.emit("sidebar", storeId);

    socketInstance.on("newVideoRequest", (appointment) => {
      toast.success("New Video Call Scheduled by Customer!");
      setNewVideoRequestSignal((prev) => prev + 1);
    });

    socketInstance.on("newMessageNotification", (data) => {
      // If we aren't already looking at this chat, show a toast
      toast.success(`New Message from ${data?.sender}`);
    });

    socketInstance.on("conversation", (data) => {
      const conversationUserData = data.map((conversationUser) => {
        const receiverId = conversationUser?.receiver?._id?.toString() || conversationUser?.receiver?.toString();
        const senderId = conversationUser?.sender?._id?.toString() || conversationUser?.sender?.toString();
        
        if (senderId === receiverId) {
          return { ...conversationUser, userDetails: conversationUser?.sender };
        } else if (receiverId === storeId.toString()) {
          return {
            ...conversationUser,
            userDetails: conversationUser.sender,
          };
        } else {
          return { ...conversationUser, userDetails: conversationUser.receiver };
        }
      });
      setUserChats(conversationUserData);
      console.log(data, "conversationUserData");
    });

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [storeId, serverURL]);

  useEffect(() => {
    // Update storeId if authenticated.user.storeId changes
    if (authenticated?.user?.storeId) {
      setStoreId(authenticated.user.storeId);
    }
  }, [authenticated?.user?.storeId]);

  const isUserOnline = (userId) => onlineUsers.has(userId);
  return (
    <ChatContext.Provider
      value={{
        userChats,
        setUserChats,
        isUserChatsLoading,
        userChatsError,
        socket,
        isUserOnline,
        newVideoRequestSignal,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
