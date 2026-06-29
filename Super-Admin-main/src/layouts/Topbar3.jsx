import React from 'react';
import { useNavigate } from 'react-router-dom';

const Headers = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user.profilePic)

  return (
    <div className="topbar">
      <div className="left-section">
        <button onClick={() => navigate('/myaccount')}>My Account</button>
      </div>
      <div className="right-section">
        {user && user.profilePic && (
          <img src={user.profilePic} alt="Profile" className="profile-image" />
        )}
      </div>
    </div>
  );
};

export default Headers;

