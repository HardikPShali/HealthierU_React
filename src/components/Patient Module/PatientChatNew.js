import React, { useEffect, useState, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom"; // useParams, useHistory, useRouteMatch

import "./patient-chat.css";
import default_image from "../../images/default_image.png";
import { formatDate } from '../questionnaire/QuestionnaireService';
import { Button } from "react-bootstrap";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import IconButton from "@material-ui/core/IconButton";
// import Dialog from "@material-ui/core/Dialog";
// import DialogTitle from "@material-ui/core/DialogTitle";
// import DialogActions from "@material-ui/core/DialogActions";
// import { encryptedRSA, decryptedRSA } from "./../CommonModule/rsaencryption";
import NoRecord from "./../CommonModule/noRecordTemplate/noRecord";
import { handleAgoraAccessToken } from "../../service/agoratokenservice";
import SmallLoader from "../Loader/smallLoader";
import Meeting from "../video-call/pages/meeting";

import moment from "moment";
import { firestoreService, chatAndVideoService, commonUtilFunction } from "../../util";

// var firebaseRef;
let unsubscribe;
let clearSetTimeoutInterval = 0;

const PatientChat = (props) => {
  const [currentSelectedGroup, setCurrentSelectedGroup] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [openVideoCall, setOpenVideoCall] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [milisecondToRerender, setMilisecondToRerender] = useState(0); // milisecond to rerender chat and video button
  const [activeButton, setActiveButton] = useState({
    chatButton: false,
    videoButton: false,
  }); // for triggering chat and video button active or inactive

  const tempMessage = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    let chatGroup = searchParams.get("chatgroup");
    let openVideoAndChat = searchParams.get("openVideoCall");
    if (openVideoAndChat) {
      handleAgoraAccessToken(chatGroup, () => setOpenVideoCall(true))
    }
    chatGroup && openConversation(chatGroup);
  }, [location]);

  useEffect(() => {
    if (currentSelectedGroup) {
      unsubscribe = firestoreService.updateConversation(currentSelectedGroup, currentPatient.email, setChatMessages);
    }
  }, [currentSelectedGroup]);

  useEffect(() => {
    if (currentSelectedGroup && doctorDetailsList[currentSelectedGroup]) {
      let currentSelectedGroupAppointmentDetails = doctorDetailsList[currentSelectedGroup]["appointmentDetails"];
      if (currentSelectedGroupAppointmentDetails) {
        //logic for rerender chat and video button based on upcoming timesequence
        let timeToRerender = chatAndVideoService.isAppoinmentTimeUnderActiveCondition(currentSelectedGroupAppointmentDetails, setActiveButton);
        if (timeToRerender) {
          clearSetTimeoutInterval && clearTimeout(clearSetTimeoutInterval);
          clearSetTimeoutInterval = setTimeout(() => setMilisecondToRerender(timeToRerender), timeToRerender);
        }
      }
    }
  }, [currentSelectedGroup, props.doctorDetailsList, milisecondToRerender]);

  useEffect(() => {
    return () => {
      typeof unsubscribe === "function" && unsubscribe();
      clearSetTimeoutInterval && clearTimeout(clearSetTimeoutInterval);
    };
  }, []);

  const sendMessage = (event) => {
    const { currentPatient, doctorDetailsList } = props;
    const messageText = tempMessage.current.value;

    //const encryptedMessage = encryptedRSA(currentWrittenMessage);

    if (messageText && messageText.trim() !== "") {
      const message = {
        fromUser: currentPatient.email,
        message: messageText,
        toUser: doctorDetailsList[currentSelectedGroup].email,
      };

      firestoreService.sendMessageToFirestore(currentSelectedGroup, message);
      tempMessage.current.value = "";
    }
  };

  const openConversation = (currentGroup) => {
    if (!currentGroup) return;
    if (currentGroup === currentSelectedGroup) return;
    setActiveButton({
      chatButton: false,
      videoButton: false,
    });
    setCurrentSelectedGroup(currentGroup);
    let element = document.getElementById(currentGroup);
    if (element) {
      element.scrollIntoView(false);
    }
    typeof unsubscribe === "function" && unsubscribe();
  };

  const handleKeypress = (e) => {
    if (e.keyCode === 13) {
      sendMessage(e);
    }
  };

  const { unReadMessageList, currentPatient, doctorDetailsList, chatGroupList, updateChatGroupListTrigger, addedNewChatGroupListTrigger } = props; // , trigger

  const currentDoctorDetails = doctorDetailsList[currentSelectedGroup];
  const currentDoctorFullName = currentDoctorDetails
    ? `${currentDoctorDetails.firstName} ${currentDoctorDetails.middleName ? currentDoctorDetails.middleName + " " : ""}${currentDoctorDetails.lastName}`
    : "";
  const { chatButton, videoButton } = activeButton;

  const memoizedChatGroupToShow = useMemo(() => {
    let chatGroupListKeys = Object.keys(chatGroupList).sort((a, b) => new Date(chatGroupList[b].lastMessageTimeStamp) - new Date(chatGroupList[a].lastMessageTimeStamp));

    if (filterText) {
      chatGroupListKeys =
        chatGroupListKeys.length &&
        Object.keys(doctorDetailsList).length &&
        chatGroupListKeys.filter((current) =>
          commonUtilFunction
            .getFullName(doctorDetailsList[current])
            .toLowerCase()
            .includes(filterText.toLowerCase())
        );
    }
    !currentSelectedGroup && chatGroupListKeys.length && Object.keys(doctorDetailsList).length && openConversation(chatGroupListKeys[0]);
    return chatGroupListKeys.length && chatGroupListKeys;
  }, [filterText, updateChatGroupListTrigger, doctorDetailsList]);

  return (
    <div>
      <br />
      <div className="main-section">
        <div className="head-section">
          <div className="headLeft-section">
            {!openVideoCall && <input type="text" name="search" className="form-control" placeholder="Search..." onChange={(e) => setFilterText(e.target.value)} />}
          </div>
          <div className="headRight-section">
            <div className="headRight-sub">
              <h4>{currentDoctorFullName}</h4>
            </div>
          </div>
        </div>
        <div className="body-section justify-content-between d-inline-flex">
          {openVideoCall ? (
            <Meeting onClose={() => setOpenVideoCall(false)} />
          ) : (
            <div className="left-section mCustomScrollbar" data-mcs-theme="minimal-dark" id="chat-room-list">
              <ul>
                {memoizedChatGroupToShow ? (
                  memoizedChatGroupToShow.map((currentGroup) => {
                    return (
                      <li key={currentGroup} id={currentGroup} onClick={(e) => openConversation(currentGroup)} className={currentGroup === currentSelectedGroup ? "active" : ""}>
                        <div className="chatList">
                          <div className="img">
                            <i className="fa fa-circle"></i>
                            <img src={doctorDetailsList[currentGroup]?.picture || default_image} alt="" />
                          </div>
                          <div className="desc">
                            <b>{`${doctorDetailsList[currentGroup]?.firstName} ${doctorDetailsList[currentGroup]?.lastName}`}</b>
                            {unReadMessageList && unReadMessageList[currentGroup] && <span className="badge badge-success ml-2">{unReadMessageList[currentGroup].length}</span>}
                            <small className="time">{chatGroupList[currentGroup].lastMessageTimeStamp}</small>
                            <br />
                            <small>{chatGroupList[currentGroup].lastMessageContent}</small>
                          </div>
                        </div>
                      </li>
                    );
                  })
                ) : addedNewChatGroupListTrigger ? (
                  <NoRecord linkUrl="/patient/mydoctor" />
                ) : (
                  <SmallLoader />
                )}
              </ul>
            </div>
          )}
          <div className="right-section">
            {!chatMessages.length && <SmallLoader />}
            <div className="message mCustomScrollbar" data-mcs-theme="minimal-dark" id="chat-list">
              <ul>
                {chatMessages.map((current) => {
                  return current.fromUser === currentPatient.email ? (
                    <li className="msg-right" key={current.firebaseTimeStamp.toMillis()}>
                      <div className={`msg-left-sub ${current.isRead ? "blue" : "brown"}`}>
                        {current.AppointmentStatus === "Booked" || current.AppointmentStatus === "Cancelled" ? (
                          <span></span>
                        ) : (
                          <img src={currentPatient.picture || default_image} alt="" className={current.isRead ? "blue" : "brown"} />
                        )}

                        <div className={current.AppointmentStatus === "Booked" ? "appointment-msg-desc" : current.AppointmentStatus === "Cancelled" ? "appointment-cancelled-msg-desc" : "msg-desc"}>
                          {current.AppointmentStatus === "Booked" || current.AppointmentStatus === "Cancelled"
                            ? current.message + " at Date/Time " + moment(new Date(current.appointmentStartTime)).format("M/DD/YYYY h:mm a")
                            : current.message}
                        </div>
                        <small>{formatDate(current.firebaseTimeStamp.toMillis())}</small>
                      </div>
                    </li>
                  ) : (
                    <li className="msg-left" key={current.firebaseTimeStamp.toMillis()}>
                      <div className="msg-left-sub">
                        <img src={doctorDetailsList[currentSelectedGroup]?.picture || default_image} alt="" />
                        <div className="msg-desc">
                          {current.AppointmentStatus === "Booked" || current.AppointmentStatus === "Cancelled"
                            ? current.message + " at Date/Time " + moment(new Date(current.appointmentStartTime)).format("M/DD/YYYY h:mm a")
                            : current.message}
                        </div>
                        <small>{formatDate(current.firebaseTimeStamp.toMillis())}</small>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div hidden={"appointmentStatus" === "Cancelled"} className={chatButton ? "row" : "row disabled-div-chat"}>
              <div className="col-sm-9">
                <input
                  type="text"
                  ref={tempMessage}
                  className="form-control"
                  name="textMessage"
                  id="textMessage"
                  placeholder="type here..."
                  onKeyDown={(e) => handleKeypress(e)}
                  disabled={!chatButton}
                />
              </div>
              <div className="col-sm-1 video-button">
                {videoButton && !openVideoCall && (
                  <IconButton onClick={() => handleAgoraAccessToken(currentSelectedGroup, () => setOpenVideoCall(true))}>
                    <VideocamIcon id="active-video-icon" />
                  </IconButton>
                )}
                {!videoButton && (
                  <IconButton id="inactive-video-button">
                    <VideocamOffIcon id="inactive-video-icon" />
                  </IconButton>
                )}
              </div>
              <div className="col-sm-2">
                <Button variant="primary" onClick={(e) => sendMessage(e)} style={{ width: "90%" }}>
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientChat;
