import React from "react";
import Avatar from "react-avatar";
import "./ProfileImage.css";

const ProfileImage = ({ currentPatient, onEdit }) => {
  return (
    <div className="d-flex flex-column align-items-center text-center mt-5 mb-3">
      {currentPatient && currentPatient.picture ? (
        <img src={currentPatient.picture} alt="" id="profile-pic" />
      ) : (
        <Avatar
          className="avatar-profile"
          name={
            currentPatient &&
            currentPatient.firstName + " " + currentPatient.lastName
          }
          style={{ height: "150px", width: "138px" }}
        />
      )}
      <div className="d-flex flex-column mt-4">
        <div className="profile-name">
          {currentPatient &&
            currentPatient.firstName + " " + currentPatient.lastName}
        </div>
        <p id="description">{currentPatient.email}</p>
        <div className="mt-1">
          <button
            className="btn btn-primary request-edit"
            onClick={() => {
              // setDisplay({ ...display, profile: 'none', editProfile: 'block' })
              onEdit();
              //   setToggleProfile({ ...toggleProfile, editProfile: true });
            }}
          >
            Edit
          </button>
        </div>
      </div>

      {/* <br /> */}

      <br />
    </div>
  );
};

export default ProfileImage;
