import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import useRole from "../../../custom-hooks/useRole";
import './CustomCallToast.css'
import defaultImage from '../../../images/default_image.png'

const CustomToastMessage = ({ payload }) => {
  const history = useHistory();
  const role = useRole();
  const [picture, setPicture] = useState("");

  const getRoleName = () => {
    return role[0].includes("ROLE_DOCTOR") ? "doctor" : "patient";
  };

  useEffect(() => {
    if (payload) {
      let profileImage =
        getRoleName() === "doctor"
          ? payload?.data?.patientPicture
          : payload?.data?.doctorPicture;
      setPicture(profileImage);
    }
  }, [payload]);

  const chatNotifHandler = () => {
    history.push(`/${getRoleName()}/chat?channelId=${payload.data.channelId}`);
  };



  return (
    <div
      onClick={() => {
        chatNotifHandler();
      }}
      className="call-notification-bar justify-content-start"
    >
      <div className="caller-img-container">
        {
          picture ? (
            <img src={picture} alt="profile picture" className="caller-img" />

          ) : (
            <img src={defaultImage} alt="profile picture" className="caller-img" />
          )
        }
      </div>
      <div className="caller-name msg-name">
        <div className="name">{payload.data.title}</div>
        <div className="call-tag text-small msg-text">{payload.data.message}</div>
      </div>
    </div>
  );
};

export default CustomToastMessage;
