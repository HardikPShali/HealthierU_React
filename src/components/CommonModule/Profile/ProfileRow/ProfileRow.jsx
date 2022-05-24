import React from 'react';
import './ProfileRow.css';

const ProfileRow = ({ icon, title, value }) => {
  return (
    <div className="d-flex align-items-center mb-3">
      <img src={icon} alt="icons" className="profile-column-icon" />
      <div className="d-flex flex-column align-items-start">
        <div className="profile-column-title">{title}</div>
        <div className="profile-column-value">{value}</div>
      </div>
    </div>
  );
};

export default ProfileRow;
