import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const StatusPage = () => {
  const [authenticated] = useContext(UserContext);
  const navigate = useNavigate();

  function getStatus(status) {
    if (status === 'Process') {
      return 'Please complete your sign-up. Your document submission part is pending.';
    } else if (status === 'Submitted') {
      return 'Stay tuned, we are verifying your documents.';
    } else {
      return "No status available.";
    }
  }
  const statusMessage = getStatus(authenticated?.storeStatus || 'No Status');

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="shadow-lg p-8 rounded-lg bg-white max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4 text-center text-blue-600">Track Your Status</h2>
        <p className="text-gray-700 text-center mb-6">{statusMessage}</p>
        <div className="mt-4">
          {authenticated ? (
            <button
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              onClick={() => navigate('/dashboard')}
            >
              Go to Home Page
            </button>
          ) : (
            <button
              className="w-full bg-gray-500 text-white px-4 py-2 rounded cursor-not-allowed"
              disabled
            >
              Please Log In to Access
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusPage;
