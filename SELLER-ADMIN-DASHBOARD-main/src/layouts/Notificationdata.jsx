import React, { useEffect, useState, useContext } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { UserContext } from '../components/context/UserContext';

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [authenticated] = useContext(UserContext);
  const userId = authenticated.user._id;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/api/s-notifications/${userId}`
      );
      const fetchedNotifications = response.data.notifications;
      setNotifications(fetchedNotifications.reverse()); // Reverse to display latest notifications first
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_API_ENDPOINT}`);

    socket.on('connect', () => {
      setSocketConnected(true);
      console.log('Connected to the server');

      socket.emit('join_room', userId);

      // Listen for new notifications
      socket.on('receive_notification', (notification) => {
        setNotifications((prevNotifications) => [notification, ...prevNotifications]); // Add new notification to the top
      });
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('receive_notification');
      socket.disconnect();
    };
  }, [userId]);
  // Function to handle deleting a notification
  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_ENDPOINT}/api/notifications/${id}`);
      setNotifications(notifications.filter((notification) => notification._id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-lg mx-auto border border-gray-200">
      {socketConnected ? (
        <ul className="space-y-4">
          {notifications.map((notif, index) => (
            <li
              key={index}
              className="bg-white p-4 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{notif.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(notif.createdAt).toLocaleDateString()}{' '}
                  {new Date(notif.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <p className="text-gray-800">{notif.message}</p>
              {notif.url && (
                <a
                  href={notif.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Click on this link
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700 text-lg">Connecting to server...</p>
      )}
    </div>
  );
};

export default NotificationComponent;
