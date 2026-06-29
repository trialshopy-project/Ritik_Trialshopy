import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Topbar2 from '../../layouts/Topbar2';

const SendNotification = () => {
  const [userId, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState(''); // New state for the URL
  const navigate = useNavigate();

  // Function to handle sending a notification to a specific user
  const handleSendNotification = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${import.meta.env.VITE_API_ENDPOINT}/api/send-notification`, {
        userId,
        title,
        message,
        url: link, // Use `link` state here
      });

      // After successfully sending the notification, navigate back to the notifications page
      navigate('/notifications');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const [send,setsend]=useState(false);

  // Function to handle broadcasting a notification to all users
  const handleBroadcastNotification = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_ENDPOINT}/api/send-notification/broadcast`, {
        title,
        message,
        url: link, // Use `link` state here
      });

      // After successfully broadcasting the notification, navigate back to the notifications page
      navigate('/notifications');
    } catch (error) {
      console.error('Error broadcasting notification:', error);
    }
  };
  function handleSend(){
    setsend(true);
  }
  useEffect(
    ()=>{
      handleBroadcastNotification();
      setsend(false);
    },[send]
  )

  return (
    <div className="flex w-screen lg:w-full lg:h-full h-screen overflow-y-scroll">
      <Topbar2 />
      <div className="lg:w-full lg:ml-2 md:ml-20 md:mr-4 sm:mr-4">
        {/* Section for Sending Notification to a Specific User */}
        <form onSubmit={handleSendNotification} className="p-4">
          <h2 className="text-2xl font-bold mb-4">Send Notification to User</h2>
          <div className="mb-4">
            <label htmlFor="userId" className="block text-gray-700 font-bold mb-2">
              User ID
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 font-bold mb-2">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border rounded p-2 w-full"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="link" className="block text-gray-700 font-bold mb-2">
              URL (Optional)
            </label>
            <input
              type="text"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
          <button type="submit" className="bg-customGray text-white px-4 py-2 rounded">
            Send Notification
          </button>
        </form>

        <hr className="my-8" />

        {/* Section for Broadcasting Notification to All Users */}
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Broadcast Notification to All Users</h2>
          <div className="mb-4">
            <label htmlFor="broadcastTitle" className="block text-gray-700 font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              id="broadcastTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="broadcastMessage" className="block text-gray-700 font-bold mb-2">
              Message
            </label>
            <textarea
              id="broadcastMessage"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border rounded p-2 w-full"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="broadcastLink" className="block text-gray-700 font-bold mb-2">
              URL (Optional)
            </label>
            <input
              type="text"
              id="broadcastLink"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSend}
          >
            Broadcast Notification
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendNotification;
